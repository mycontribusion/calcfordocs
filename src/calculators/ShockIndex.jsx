import React, { useEffect } from "react";
import { useCalc, NumberField, ResetButton, FormulaBox } from "./CalcFields";

const INITIAL_STATE = { heartRate: "", sbp: "", result: null };

export default function ShockIndex() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const hr = parseFloat(values.heartRate);
    const sbp = parseFloat(values.sbp);
    if (!hr || !sbp) { if (values.result !== null) updateFields({ result: null }); return; }
    const si = hr / sbp;
    const interp = si < 0.5 ? "Low" : si <= 0.7 ? "Normal" : si < 1.0 ? "Borderline" : "High risk of shock";
    const color = si < 0.5 ? "#16a34a" : si <= 0.7 ? "#16a34a" : si < 1.0 ? "#ea580c" : "#dc2626";
    updateFields({ result: { index: si.toFixed(2), interp, color } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.heartRate, values.sbp]);

  return (
    <div className="calc-container">
      <FormulaBox title="Shock Index Formula & Risk Guide">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formula:</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>Shock Index = Heart Rate ÷ Systolic BP</p>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Interpretation:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>&lt; 0.5: Low</li>
          <li>0.5 – 0.7: Normal</li>
          <li>0.8 – 0.9: Borderline — monitor closely</li>
          <li>≥ 1.0: High risk of haemorrhagic shock / need urgent intervention</li>
        </ul>
        <p style={{ margin: "6px 0 0", fontSize: '0.73rem', opacity: 0.75 }}>Normal resting SI ≈ 0.5–0.7. Elevated SI suggests inadequate cardiac output relative to HR.</p>
      </FormulaBox>

      <NumberField label="Heart Rate (bpm):" field="heartRate" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <NumberField label="Systolic BP (mmHg):" field="sbp" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <ResetButton onClick={reset} />
      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Shock Index:</strong> {values.result.index}</p>
          <p style={{ marginTop: 4, fontWeight: 700, color: values.result.color }}>{values.result.interp}</p>
        </div>
      )}
    </div>
  );
}
