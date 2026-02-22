import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = { sbp: "", dbp: "", map: null, pp: null };

export default function MapCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const s = parseFloat(values.sbp);
    const d = parseFloat(values.dbp);
    if (!s || !d || s < d) { if (values.map !== null) updateFields({ map: null, pp: null }); return; }
    const m = d + (s - d) / 3;
    const p = s - d;
    updateFields({ map: m.toFixed(1), pp: p });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sbp, values.dbp]);

  return (
    <div className="calc-container">
      <div className="calc-formula-box">
        MAP = DBP + (SBP - DBP) / 3
      </div>
      <div className="calc-box"><label className="calc-label">Systolic BP:</label><input type="number" value={values.sbp} onChange={e => setField("sbp", e.target.value)} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">Diastolic BP:</label><input type="number" value={values.dbp} onChange={e => setField("dbp", e.target.value)} className="calc-input" /></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.map && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>MAP:</strong> {values.map} mmHg &nbsp;
            <span style={{ fontSize: '0.9rem', color: parseFloat(values.map) < 65 ? '#c0392b' : parseFloat(values.map) <= 100 ? '#27ae60' : '#e67e22' }}>
              {parseFloat(values.map) < 65 ? '⚠️ Low — risk of organ hypoperfusion' : parseFloat(values.map) <= 100 ? '✅ Normal' : '⚠️ Elevated — assess for hypertension'}
            </span>
          </p>
          <p><strong>Pulse Pressure:</strong> {values.pp} mmHg</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <strong>Reference Ranges:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
              <li>&lt; 65: Low – organ hypoperfusion risk</li>
              <li>65 – 100: Normal</li>
              <li>&gt; 100: Elevated – hypertension</li>
              <li>Normal Pulse Pressure: 40 mmHg</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
