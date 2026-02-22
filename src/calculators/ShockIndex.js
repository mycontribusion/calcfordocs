import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = { heartRate: "", systolicBP: "", result: null };

export default function ShockIndex() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const hr = parseFloat(values.heartRate);
    const sbp = parseFloat(values.systolicBP);
    if (!hr || !sbp) { if (values.result !== null) updateFields({ result: null }); return; }
    const si = hr / sbp;
    const interp = si < 0.5 ? "Low" : si <= 0.7 ? "Normal" : si < 1.0 ? "Borderline" : "High risk of shock";
    updateFields({ result: { index: si.toFixed(2), interp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.heartRate, values.systolicBP]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Heart Rate (bpm):</label><input type="number" value={values.heartRate} onChange={e => setField("heartRate", e.target.value)} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">Systolic BP (mmHg):</label><input type="number" value={values.systolicBP} onChange={e => setField("systolicBP", e.target.value)} className="calc-input" /></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
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
