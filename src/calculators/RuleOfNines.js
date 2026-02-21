import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const PARTS = [
  { label: "Anterior Head", value: 4.5, key: "ah" }, { label: "Posterior Head", value: 4.5, key: "ph" },
  { label: "Anterior Left Arm", value: 4.5, key: "ala" }, { label: "Posterior Left Arm", value: 4.5, key: "pla" },
  { label: "Anterior Right Arm", value: 4.5, key: "ara" }, { label: "Posterior Right Arm", value: 4.5, key: "pra" },
  { label: "Anterior Chest", value: 9, key: "ac" }, { label: "Anterior Abdomen", value: 9, key: "aa" },
  { label: "Upper Back", value: 9, key: "ub" }, { label: "Lower Back", value: 9, key: "lb" },
  { label: "Anterior Left Thigh", value: 4.5, key: "alt" }, { label: "Posterior Left Thigh", value: 4.5, key: "plt" },
  { label: "Anterior Left Leg/Shin", value: 4.5, key: "all" }, { label: "Posterior Left Leg/Calf", value: 4.5, key: "plc" },
  { label: "Anterior Right Thigh", value: 4.5, key: "art" }, { label: "Posterior Right Thigh", value: 4.5, key: "prt" },
  { label: "Anterior Right Leg/Shin", value: 4.5, key: "arl" }, { label: "Posterior Right Leg/Calf", value: 4.5, key: "prc" },
  { label: "Perineum", value: 1, key: "per" },
];

const INITIAL_STATE = PARTS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {});

export default function RuleOfNines() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const total = useMemo(() => {
    let sum = 0;
    PARTS.forEach((p) => { if (values[p.key]) sum += p.value; });
    return sum;
  }, [values]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        {PARTS.map((p) => (
          <label key={p.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={values[p.key]} onChange={(e) => setField(p.key, e.target.checked)} style={{ marginRight: 10 }} /> {p.label} ({p.value}%)
          </label>
        ))}
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      <div className="calc-result"><strong>Total Burn Area:</strong> {total}%</div>
    </div>
  );
}
