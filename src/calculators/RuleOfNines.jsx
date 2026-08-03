import React, { useMemo } from "react";
import { useCalc, ResetButton, FormulaBox } from "./CalcFields";

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
  const { values, updateField: setField, reset } = useCalc(INITIAL_STATE);

  const total = useMemo(() => {
    let sum = 0;
    PARTS.forEach((p) => { if (values[p.key]) sum += p.value; });
    return sum;
  }, [values]);

  return (
    <div className="calc-container">
      <FormulaBox title="Wallace Rule of Nines TBSA Guide">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Adult TBSA Breakdown:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>Head & Neck: 9% (4.5% Ant, 4.5% Post)</li>
          <li>Each Arm: 9% (4.5% Ant, 4.5% Post)</li>
          <li>Anterior Trunk: 18% (Chest 9%, Abdomen 9%)</li>
          <li>Posterior Trunk: 18% (Upper Back 9%, Lower Back 9%)</li>
          <li>Each Leg: 18% (9% Ant, 9% Post)</li>
          <li>Perineum: 1%</li>
        </ul>
      </FormulaBox>

      <div className="calc-box">
        {PARTS.map((p) => (
          <label key={p.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={values[p.key]} onChange={(e) => setField(p.key, e.target.checked)} style={{ marginRight: 10 }} /> {p.label} ({p.value}%)
          </label>
        ))}
      </div>

      <ResetButton onClick={reset} />
      <div className="calc-result"><strong>Total Burn Area:</strong> {total}%</div>
    </div>
  );
}
