// src/calculators/AxisInterpreter.js
import React, { useState } from "react";

/**
 * AxisInterpreter with corrected teaching diagram (hexaxial).
 * - 0° is to the right, angles increase clockwise (screen-friendly).
 * - Highlights the correct sector based on Lead I and aVF polarity.
 *
 * Note: This component uses the common sign-based quick method:
 *  - Lead I +, aVF +  => Normal axis (≈ -30° to +90°)
 *  - Lead I +, aVF -  => Left axis deviation (≈ -90° to -30°)
 *  - Lead I -, aVF +  => Right axis deviation (≈ +90° to +180°)
 *  - Lead I -, aVF -  => Extreme (≈ -90° to -180° / +180° to +270°)
 */

function polarToCartesian(cx, cy, radius, angleDeg) {
  // angleDeg here is measured CLOCKWISE from +X (right).
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = cx + radius * Math.cos(angleRad);
  const y = cy + radius * Math.sin(angleRad);
  return { x, y };
}

// describe an arc (clockwise) from startAngle to endAngle, angles in degrees
function describeArc(cx, cy, radius, startAngle, endAngle) {
  // allow endAngle > 360 for wrap (e.g., 330 -> 450)
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  // length of arc span
  const sweep = endAngle - startAngle;
  const largeArcFlag = sweep > 180 ? 1 : 0;
  // sweepFlag = 1 -> arc drawn in positive-angle (clockwise) direction (we want clockwise)
  const d = [
    `M ${cx} ${cy}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    "Z",
  ].join(" ");
  return d;
}

export default function AxisInterpreter() {
  const [lead1, setLead1] = useState("positive");
  const [leadAvf, setLeadAvf] = useState("positive");
  const [result, setResult] = useState({ interpretation: "", equiphasic: "" });

  function interpretAxis(l1, avf) {
    if (l1 === "positive" && avf === "positive") {
      return {
        interpretation: "Normal Axis (≈ -30° to +90°)",
        equiphasic: "Lead aVL (often equiphasic)",
        sector: "normal",
      };
    } else if (l1 === "positive" && avf === "negative") {
      return {
        interpretation: "Left Axis Deviation (≈ -90° to -30°)",
        equiphasic: "Lead II",
        sector: "left",
      };
    } else if (l1 === "negative" && avf === "positive") {
      return {
        interpretation: "Right Axis Deviation (≈ +90° to +180°)",
        equiphasic: "Lead III",
        sector: "right",
      };
    } else if (l1 === "negative" && avf === "negative") {
      return {
        interpretation: "Extreme Axis / Indeterminate (≈ -90° to -180° / +180° to +270°)",
        equiphasic: "Lead aVR",
        sector: "extreme",
      };
    }
    return { interpretation: "Indeterminate", equiphasic: "", sector: null };
  }

  function handleInterpret() {
    setResult(interpretAxis(lead1, leadAvf));
  }

  // sector angle definitions (degrees measured clockwise from right)
  const sectors = {
    left: { start: 270, end: 330, color: "#60a5fa" },       // -90 to -30
    normal: { start: 330, end: 450, color: "#34d399" },     // -30 to +90 (wraps)
    right: { start: 90, end: 180, color: "#fb923c" },       // +90 to +180
    extreme: { start: 180, end: 270, color: "#f87171" },    // +180 to +270 (-180 to -90)
  };

  // SVG layout
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 96;

  // labels for major angles (deg) in our orientation:
  // 0° (right), 90° (down), 180° (left), 270° (up), and the -30/-60 etc.
  const angleLabels = [
    { angle: 0, text: "0° (I)" },
    { angle: 30, text: "30°" },
    { angle: 60, text: "60° (II)" },
    { angle: 90, text: "90° (aVF)" },
    { angle: 120, text: "120°" },
    { angle: 150, text: "150°" },
    { angle: 180, text: "180° (III)" },
    { angle: 210, text: "210°" },
    { angle: 240, text: "240°" },
    { angle: 270, text: "270° (-90°)" },
    { angle: 300, text: "300° (-60°)" },
    { angle: 330, text: "330° (-30° / aVL)" },
  ];

  // determine which sector to highlight
  const activeSector = result.sector || "normal";

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <h2 style={{ margin: "0 0 8px" }}>Axis Interpreter</h2>

          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Lead I:</label>
            <select value={lead1} onChange={(e) => setLead1(e.target.value)}>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Lead aVF:</label>
            <select value={leadAvf} onChange={(e) => setLeadAvf(e.target.value)}>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <button onClick={handleInterpret} style={{
              background: "#2563eb", color: "white", padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer"
            }}>
              Interpret
            </button>
          </div>

          <div style={{ padding: 12, borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
            <div><strong>Interpretation:</strong> {result.interpretation || "—"}</div>
            <div style={{ marginTop: 6 }}><strong>Equiphasic lead:</strong> {result.equiphasic || "—"}</div>
          </div>
        </div>

        <div style={{ width: 320, textAlign: "center" }}>
          {/* SVG diagram */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* base circle */}
            <circle cx={cx} cy={cy} r={r} stroke="#374151" strokeWidth="1" fill="#fff" />

            {/* draw sectors */}
            {Object.entries(sectors).map(([key, s]) => {
              const start = s.start;
              const end = s.end;
              // describeArc handles end > 360 if needed
              const pathD = describeArc(cx, cy, r, start, end);
              const isActive = key === activeSector;
              return (
                <path
                  key={key}
                  d={pathD}
                  fill={isActive ? s.color : "#ffffff"}
                  opacity={isActive ? 0.22 : 0.08}
                  stroke={isActive ? s.color : "#e5e7eb"}
                  strokeWidth={isActive ? 1.2 : 0.8}
                />
              );
            })}

            {/* circle outline again for clarity */}
            <circle cx={cx} cy={cy} r={r} stroke="#111827" strokeWidth="0.7" fill="none" />

            {/* radial lines & angle labels */}
            {angleLabels.map((lbl) => {
              const pInner = polarToCartesian(cx, cy, r - 10, lbl.angle);
              const pOuter = polarToCartesian(cx, cy, r + 14, lbl.angle);
              const textPos = polarToCartesian(cx, cy, r + 26, lbl.angle);
              return (
                <g key={lbl.angle}>
                  <line x1={pInner.x} y1={pInner.y} x2={pOuter.x} y2={pOuter.y} stroke="#9ca3af" strokeWidth="0.8" />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    fontSize="10"
                    fill="#374151"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {lbl.text}
                  </text>
                </g>
              );
            })}

            {/* center labels */}
            <text x={cx} y={cy - 6} fontSize="12" textAnchor="middle" fill="#111827">Hexaxial Reference</text>
            <text x={cx} y={cy + 12} fontSize="10" textAnchor="middle" fill="#374151">0°→ right, angles clockwise</text>
          </svg>
        </div>
      </div>

      {/* Legend */}
      
    </div>
  );
}
