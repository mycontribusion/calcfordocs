import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  sodium: "",
  glucose: "",
  glucoseUnit: "mg/dL",
  urea: "",
  ureaUnit: "mmol/L",
  measured: "",
  result: null,
};

export default function SerumOsmolalityCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const naVal = parseFloat(values.sodium);
    const gluVal = values.glucoseUnit === "mg/dL" ? parseFloat(values.glucose) / 18 : parseFloat(values.glucose);
    const ureaVal = values.ureaUnit === "mg/dL" ? parseFloat(values.urea) / 2.8 : parseFloat(values.urea);

    if (isNaN(naVal) || isNaN(gluVal) || isNaN(ureaVal)) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const osm = 2 * naVal + gluVal + ureaVal;
    const measVal = values.measured === "" ? null : parseFloat(values.measured);
    const gap = (measVal !== null && !isNaN(measVal)) ? (measVal - osm).toFixed(1) : null;

    updateFields({ result: { osmolality: osm.toFixed(1), gap } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.glucose, values.glucoseUnit, values.urea, values.ureaUnit, values.measured]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Sodium (mmol/L):</label><input type="number" value={values.sodium} onChange={(e) => setField("sodium", e.target.value)} className="calc-input" /></div>
      <div className="calc-box">
        <label className="calc-label">Glucose:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.glucose} onChange={(e) => setField("glucose", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.glucoseUnit} onChange={(e) => setField("glucoseUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mmol/L">mmol/L</option><option value="mg/dL">mg/dL</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Urea:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.urea} onChange={(e) => setField("urea", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.ureaUnit} onChange={(e) => setField("ureaUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mmol/L">mmol/L</option><option value="mg/dL">mg/dL</option></select>
        </div>
      </div>
      <div className="calc-box"><label className="calc-label">Measured Osmolality (optional):</label><input type="number" value={values.measured} onChange={(e) => setField("measured", e.target.value)} className="calc-input" /></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result">
          <div className="calc-formula-box" style={{ marginBottom: 12, fontSize: '0.85rem' }}>
            Osm = 2×Na + Glucose + Urea (all in mmol/L)
          </div>
          <p><strong>Calculated:</strong> {values.result.osmolality} mOsm/kg</p>
          {values.result.gap !== null && (
            <>
              <p><strong>Osmol Gap:</strong> {values.result.gap} mOsm/kg</p>
              <p style={{ fontSize: '0.85rem', marginTop: 4, color: parseFloat(values.result.gap) > 10 ? '#c0392b' : '#27ae60' }}>
                {parseFloat(values.result.gap) > 10
                  ? '⚠️ Elevated gap (>10) — consider toxic alcohols, mannitol, or ketoacidosis'
                  : '✅ Normal osmol gap (≤10)'}
              </p>
            </>
          )}
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <strong>Reference:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
              <li>Normal: 275–295 mOsm/kg</li>
              <li>Normal osmol gap: &lt; 10 mOsm/kg</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
