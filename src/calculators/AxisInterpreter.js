import React, { useState } from "react";

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = cx + radius * Math.cos(angleRad);
  const y = cy + radius * Math.sin(angleRad);
  return { x, y };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const sweep = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${sweep} 1 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

export default function AxisInterpreter() {
  const [lead1, setLead1] = useState("positive");
  const [leadAvf, setLeadAvf] = useState("positive");
  const [result, setResult] = useState({ interpretation: "", equiphasic: "", sector: "" });

  const interpretAxis = (l1, avf) => {
    if (l1 === "positive" && avf === "positive") return {
      interpretation: "Normal Axis (-30° to +90°)",
      equiphasic: "Lead aVL",
      sector: "normal"
    };
    if (l1 === "positive" && avf === "negative") return {
      interpretation: "Left Axis Deviation (-90° to -30°)",
      equiphasic: "Lead II",
      sector: "left"
    };
    if (l1 === "negative" && avf === "positive") return {
      interpretation: "Right Axis Deviation (+90° to +180°)",
      equiphasic: "Lead III",
      sector: "right"
    };
    if (l1 === "negative" && avf === "negative") return {
      interpretation: "Extreme / Indeterminate Axis (-180° to -90°)",
      equiphasic: "Lead aVR",
      sector: "extreme"
    };
    return { interpretation: "Indeterminate", equiphasic: "", sector: "" };
  };

  const handleInterpret = () => {
    setResult(interpretAxis(lead1, leadAvf));
  };

  const sectors = {
    left: { start: 270, end: 330, color: "#60a5fa" },
    normal: { start: 330, end: 450, color: "#34d399" },
    right: { start: 90, end: 180, color: "#fb923c" },
    extreme: { start: 180, end: 270, color: "#f87171" },
  };

  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 96;

  const angleLabels = [
    { angle: 0, text: "0° (I)" },
    { angle: 60, text: "60° (II)" },
    { angle: 90, text: "90° (aVF)" },
    { angle: 120, text: "120° (III)" },
    { angle: 180, text: "180°" },
    { angle: 270, text: "-90°" },
    { angle: 300, text: "-60°" },
    { angle: 330, text: "-30° (aVL)" },
  ];

  const activeSector = result.sector || "normal";

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <h2>Axis Interpreter</h2>

          <div>
            <label>Lead I: </label>
            <select value={lead1} onChange={(e) => setLead1(e.target.value)}>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div><p></p>
            <label>Lead aVF: </label>
            <select value={leadAvf} onChange={(e) => setLeadAvf(e.target.value)}>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <button onClick={handleInterpret} style={{ marginTop: 8, padding: "6px 12px", background: "#2563eb", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" }}>
            Interpret
          </button>

          <div style={{ marginTop: 10, padding: 10, background: "#015c9c", borderRadius: 6, border: "1px solid #e5e7eb" }}>
            <div><strong>Interpretation:</strong> {result.interpretation || "—"}</div>
            <div><strong>Equiphasic lead:</strong> {result.equiphasic || "—"}</div>
          </div>
        </div>

        <div style={{ width: 320, textAlign: "center" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} stroke="#374151" strokeWidth="1" fill="#fff" />

            {Object.entries(sectors).map(([key, s]) => (
              <path
                key={key}
                d={describeArc(cx, cy, r, s.start, s.end)}
                fill={key === activeSector ? s.color : "#fff"}
                opacity={key === activeSector ? 0.22 : 0.08}
                stroke={key === activeSector ? s.color : "#e5e7eb"}
                strokeWidth={key === activeSector ? 1.2 : 0.8}
              />
            ))}

            <circle cx={cx} cy={cy} r={r} stroke="#111827" strokeWidth="0.7" fill="none" />

            {angleLabels.map(lbl => {
              const p = polarToCartesian(cx, cy, r + 16, lbl.angle);
              return (
                <text key={lbl.angle} x={p.x} y={p.y} fontSize="10" fill="#374151" textAnchor="middle" dominantBaseline="middle">
                  {lbl.text}
                </text>
              );
            })}

            <text x={cx} y={cy - 6} fontSize="12" textAnchor="middle" fill="#111827">Hexaxial Reference</text>
            <text x={cx} y={cy + 12} fontSize="10" textAnchor="middle" fill="#374151">0° → right, clockwise</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
