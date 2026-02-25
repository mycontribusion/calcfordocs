import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  calcium: "",
  calciumUnit: "mg/dL",
  phosphate: "",
  phosphateUnit: "mg/dL",
  albumin: "",
  albuminUnit: "g/dL",
  product: null,
  correctedCalcium: null,
};

export default function CalciumPhosphateProduct() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const caVal = parseFloat(values.calcium);
    const phVal = parseFloat(values.phosphate);
    const albVal = parseFloat(values.albumin);

    if (isNaN(caVal) || isNaN(phVal)) {
      if (values.product !== null) updateFields({ product: null, correctedCalcium: null });
      return;
    }

    const caMgdl = values.calciumUnit === "mmol/L" ? caVal * 4.01 : caVal;
    const phMgdl = values.phosphateUnit === "mmol/L" ? phVal * 3.1 : phVal;

    let finalCa = caMgdl;
    if (!isNaN(albVal)) {
      finalCa = caMgdl + 0.8 * (4.0 - albVal);
    }

    updateFields({
      product: (finalCa * phMgdl).toFixed(1),
      correctedCalcium: !isNaN(albVal) ? finalCa.toFixed(1) : null
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.calcium, values.calciumUnit, values.phosphate, values.phosphateUnit, values.albumin]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Calcium:</label>
        <SyncSuggestion field="calcium" suggestion={suggestions.calcium} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.calcium} onChange={(e) => setField("calcium", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.calciumUnit} onChange={(e) => setField("calciumUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mg/dL">mg/dL</option><option value="mmol/L">mmol/L</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Phosphate:</label>
        <SyncSuggestion field="phosphate" suggestion={suggestions.phosphate} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.phosphate} onChange={(e) => setField("phosphate", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.phosphateUnit} onChange={(e) => setField("phosphateUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mg/dL">mg/dL</option><option value="mmol/L">mmol/L</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Albumin:</label>
        <SyncSuggestion field="albumin" suggestion={suggestions.albumin} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.albumin} onChange={(e) => setField("albumin", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.albuminUnit} onChange={(e) => setField("albuminUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="g/dL">g/dL</option></select>
        </div>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.product && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Product:</strong> {values.product} mg²/dL²</p>
          {values.correctedCalcium && <p style={{ marginTop: 4 }}><strong>Corrected Calcium:</strong> {values.correctedCalcium} mg/dL</p>}
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <span style={{ opacity: 0.7 }}>Formula: Ca (mg/dL) × Phosphate (mg/dL)</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
              <li>&lt; 55: Low risk</li>
              <li>55–70: Moderate risk</li>
              <li>&gt; 70: High risk of vascular calcification</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
