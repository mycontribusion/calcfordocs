import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  type: "urea", analyteValue: "", analyteUnit: "mmol/L", creatinineValue: "", creatinineUnit: "µmol/L", result: null
};

export default function UreaBunCrRatio() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const aVal = parseFloat(values.analyteValue);
    const cVal = parseFloat(values.creatinineValue);
    if (!aVal || !cVal) { if (values.result !== null) updateFields({ result: null }); return; }

    let ratio = 0;
    let interpretation = "";

    if (values.type === "bun") {
      const bun = values.analyteUnit === "mmol/L" ? aVal * 2.8 : aVal;
      const cr = values.creatinineUnit === "µmol/L" ? cVal / 88.4 : values.creatinineUnit === "mmol/L" ? (cVal * 1000) / 88.4 : cVal;
      ratio = bun / cr;

      if (ratio > 20) interpretation = "Prerenal (e.g., dehydration, GI bleed)";
      else if (ratio >= 10) interpretation = "Normal or postrenal";
      else interpretation = "Intrarenal (e.g., ATN), severe liver disease";
    } else {
      const urea = values.analyteUnit === "mmol/L" ? aVal : aVal / 6.0;
      const cr = values.creatinineUnit === "µmol/L" ? cVal : values.creatinineUnit === "mmol/L" ? cVal * 1000 : cVal * 88.4;
      ratio = (urea / cr) * 1000;

      if (ratio > 100) interpretation = "Prerenal (e.g., dehydration, GI bleed)";
      else if (ratio >= 40) interpretation = "Normal or postrenal";
      else interpretation = "Intrarenal (e.g., ATN), severe liver disease";
    }
    updateFields({ result: { ratio: ratio.toFixed(1), interpretation } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.analyteValue, values.creatinineValue, values.analyteUnit, values.creatinineUnit, values.type]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Type:</label><select value={values.type} onChange={e => updateFields({ type: e.target.value, analyteValue: "", creatinineValue: "" })} className="calc-select"><option value="urea">Urea (SI)</option><option value="bun">BUN (Conv)</option></select></div>
      <div className="calc-box"><label className="calc-label">{values.type === "bun" ? "BUN" : "Urea"}:</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" value={values.analyteValue} onChange={e => setField("analyteValue", e.target.value)} className="calc-input" style={{ flex: 1 }} /><select value={values.analyteUnit} onChange={e => setField("analyteUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mmol/L">mmol/L</option><option value="mg/dL">mg/dL</option></select></div></div>
      <div className="calc-box"><label className="calc-label">Creatinine:</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" value={values.creatinineValue} onChange={e => setField("creatinineValue", e.target.value)} className="calc-input" style={{ flex: 1 }} /><select value={values.creatinineUnit} onChange={e => setField("creatinineUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="µmol/L">µmol/L</option><option value="mg/dL">mg/dL</option></select></div></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Ratio:</strong> {values.result.ratio} : 1</p>
          <p><strong>Interpretation:</strong> {values.result.interpretation}</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <strong>Reference Ranges ({values.type === "bun" ? "BUN/Cr" : "Urea/Cr"}):</strong>
            {values.type === "bun" ? (
              <ul style={{ listStyle: "none", padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
                <li>&gt; 20:1: Prerenal</li>
                <li>10–20:1: Normal/Postrenal</li>
                <li>&lt; 10:1: Intrarenal</li>
              </ul>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
                <li>&gt; 100:1: Prerenal</li>
                <li>40–100:1: Normal/Postrenal</li>
                <li>&lt; 40:1: Intrarenal</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
