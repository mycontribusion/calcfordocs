import React, { useState } from "react";
import "./CalculatorShared.css";

export default function RuleOfNines() {
  const parts = [
    // HEAD
    { label: "Anterior Head", value: 4.5 },
    { label: "Posterior Head", value: 4.5 },

    // LEFT ARM
    { label: "Anterior Left Arm", value: 4.5 },
    { label: "Posterior Left Arm", value: 4.5 },

    // RIGHT ARM
    { label: "Anterior Right Arm", value: 4.5 },
    { label: "Posterior Right Arm", value: 4.5 },

    // TRUNK
    { label: "Anterior Chest", value: 9 },
    { label: "Anterior Abdomen", value: 9 },
    { label: "Upper Back", value: 9 },
    { label: "Lower Back", value: 9 },

    // LEFT LEG
    { label: "Anterior Left Thigh", value: 4.5 },
    { label: "Posterior Left Thigh", value: 4.5 },
    { label: "Anterior Left Leg/Shin", value: 4.5 },
    { label: "Posterior Left Leg/Calf", value: 4.5 },

    // RIGHT LEG
    { label: "Anterior Right Thigh", value: 4.5 },
    { label: "Posterior Right Thigh", value: 4.5 },
    { label: "Anterior Right Leg/Shin", value: 4.5 },
    { label: "Posterior Right Leg/Calf", value: 4.5 },

    // PERINEUM
    { label: "Perineum", value: 1 },
  ];

  const [checked, setChecked] = useState({});
  const [total, setTotal] = useState(0);

  const toggle = (label) => {
    const updated = { ...checked, [label]: !checked[label] };
    setChecked(updated);

    // Recalculate total
    let sum = 0;
    parts.forEach((p) => {
      if (updated[p.label]) sum += p.value;
    });
    setTotal(sum);
  };

  const reset = () => {
    setChecked({});
    setTotal(0);
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        {parts.map((p) => (
          <label key={p.label} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checked[p.label] || false}
              onChange={() => toggle(p.label)}
              style={{ marginRight: 10 }}
            />
            {p.label} ({p.value}%)
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset" style={{ marginBottom: 16 }}>Reset</button>

      <div className="calc-result">
        <strong>Total Burn Area:</strong> {total}%
      </div>
    </div>
  );
}
