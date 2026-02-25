import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  urea: "",
  ureaUnit: "mmol/L",
  creatinine: "",
  creatinineUnit: "µmol/L",
  ratio: null,
  interpretation: ""
};

export default function UreaCrRatio() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const urea = parseFloat(values.urea);
    const cr = parseFloat(values.creatinine);

    if (isNaN(urea) || isNaN(cr) || cr === 0) {
      if (values.ratio !== null) updateFields({ ratio: null, interpretation: "" });
      return;
    }

    // Convert to mg/dL for consistent BUN/Cr ratio (Standard is 10-20)
    const ureaMgdl = values.ureaUnit === "mmol/L" ? urea * 2.801 : urea;

    let crMgdl;
    if (values.creatinineUnit === "µmol/L") {
      crMgdl = cr / 88.4;
    } else if (values.creatinineUnit === "mmol/L") {
      crMgdl = (cr * 1000) / 88.4;
    } else {
      crMgdl = cr;
    }

    const ratio = ureaMgdl / crMgdl;
    const interp = ratio > 20
      ? "Suggests pre-renal cause (e.g., dehydration, GI bleed)"
      : ratio < 10
        ? "Suggests intra-renal cause (e.g., ATN)"
        : "Normal or post-renal cause";

    updateFields({ ratio: ratio.toFixed(1), interpretation: interp });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.urea, values.ureaUnit, values.creatinine, values.creatinineUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Urea / BUN:</label>
        <SyncSuggestion field="urea" suggestion={suggestions.urea} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.urea}
            onChange={(e) => setField("urea", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.ureaUnit} onChange={(e) => setField("ureaUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mmol/L">mmol/L</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Creatinine:</label>
        <SyncSuggestion field="creatinine" suggestion={suggestions.creatinine} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.creatinine}
            onChange={(e) => setField("creatinine", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.creatinineUnit} onChange={(e) => setField("creatinineUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="µmol/L">µmol/L</option>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {values.ratio !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>BUN/Cr Ratio:</strong> {values.ratio} : 1</p>
          <p style={{ marginTop: 4, color: '#0056b3' }}>{values.interpretation}</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem', opacity: 0.8 }}>
            <strong>Interpretation Guide:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
              <li>• &gt; 20:1: Prerenal</li>
              <li>• 10–20:1: Normal/Postrenal</li>
              <li>• &lt; 10:1: Intrarenal</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
