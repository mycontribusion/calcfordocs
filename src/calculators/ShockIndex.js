import React, { useEffect } from "react";
import { useCalc, NumberField, ResetButton } from "./CalcFields";

const INITIAL_STATE = { heartRate: "", sbp: "", result: null };

export default function ShockIndex() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const hr = parseFloat(values.heartRate);
    const sbp = parseFloat(values.sbp);
    if (!hr || !sbp) { if (values.result !== null) updateFields({ result: null }); return; }
    const si = hr / sbp;
    const interp = si < 0.5 ? "Low" : si <= 0.7 ? "Normal" : si < 1.0 ? "Borderline" : "High risk of shock";
    updateFields({ result: { index: si.toFixed(2), interp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.heartRate, values.sbp]);

  return (
    <div className="calc-container">
      <NumberField label="Heart Rate (bpm):" field="heartRate" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <NumberField label="Systolic BP (mmHg):" field="sbp" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <ResetButton onClick={reset} />
      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Shock Index:</strong> {values.result.index}</p>
          <p><strong>Interpretation:</strong> {values.result.interp}</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <strong>Reference Ranges:</strong>
            <ul style={{ listStyle: "none", padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
              <li>&lt; 0.5: Low</li>
              <li>0.5 – 0.7: Normal</li>
              <li>0.8 – 0.9: Borderline</li>
              <li>≥ 1.0: High Risk</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
