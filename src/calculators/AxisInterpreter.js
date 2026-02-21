import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(angleRad), y: cy + radius * Math.sin(angleRad) };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const sweep = endAngle - startAngle <= 180 ? 0 : 1;
  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${radius} ${radius} 0 ${sweep} 1 ${end.x} ${end.y}`, "Z"].join(" ");
}

const SECTORS = {
  left: { start: 270, end: 330, color: "#60a5fa" },
  normal: { start: 330, end: 450, color: "#34d399" },
  right: { start: 90, end: 180, color: "#fb923c" },
  extreme: { start: 180, end: 270, color: "#f87171" },
};

const INITIAL_STATE = { lead1: "positive", leadAvf: "positive" };

export default function AxisInterpreter() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const result = useMemo(() => {
    const { lead1, leadAvf } = values;
    if (lead1 === "positive" && leadAvf === "positive") return { interpretation: "Normal Axis", equiphasic: "aVL", sector: "normal" };
    if (lead1 === "positive" && leadAvf === "negative") return { interpretation: "Left Axis Deviation", equiphasic: "Lead II", sector: "left" };
    if (lead1 === "negative" && leadAvf === "positive") return { interpretation: "Right Axis Deviation", equiphasic: "Lead III", sector: "right" };
    if (lead1 === "negative" && leadAvf === "negative") return { interpretation: "Extreme Axis", equiphasic: "aVR", sector: "extreme" };
    return { interpretation: "Indeterminate", equiphasic: "", sector: "" };
  }, [values]);

  const size = 260, cx = 130, cy = 130, r = 96;
  const labels = [{ angle: 0, text: "0° (I)" }, { angle: 90, text: "90° (aVF)" }, { angle: 180, text: "180°" }, { angle: 270, text: "-90°" }, { angle: 330, text: "-30° (aVL)" }];

  return (
    <div className="calc-container" style={{ maxWidth: 720 }}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <div className="calc-box"><label className="calc-label">Lead I: </label><select value={values.lead1} onChange={(e) => setField("lead1", e.target.value)} className="calc-select"><option value="positive">Positive</option><option value="negative">Negative</option></select></div>
          <div className="calc-box"><label className="calc-label">Lead aVF: </label><select value={values.leadAvf} onChange={(e) => setField("leadAvf", e.target.value)} className="calc-select"><option value="positive">Positive</option><option value="negative">Negative</option></select></div>
          <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
          <div className="calc-result" style={{ marginTop: 16 }}>
            <p><strong>Interpretation:</strong> {result.interpretation}</p>
            <p><strong>Equiphasic lead:</strong> {result.equiphasic}</p>
          </div>
        </div>
        <div style={{ width: 320, textAlign: "center", margin: 'auto' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx} cy={cy} r={r} stroke="#374151" strokeWidth="1" fill="#fff" />
            {Object.entries(SECTORS).map(([key, s]) => (
              <path key={key} d={describeArc(cx, cy, r, s.start, s.end)} fill={key === result.sector ? s.color : "#fff"} opacity={key === result.sector ? 0.22 : 0.08} stroke={key === result.sector ? s.color : "#e5e7eb"} />
            ))}
            {labels.map(lbl => {
              const p = polarToCartesian(cx, cy, r + 16, lbl.angle);
              return <text key={lbl.angle} x={p.x} y={p.y} fontSize="10" fill="#374151" textAnchor="middle" dominantBaseline="middle">{lbl.text}</text>;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
