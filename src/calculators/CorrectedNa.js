import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  sodium: "",
  glucose: "",
  glucoseUnit: "mg/dL",
  result: "",
  interpretation: null,
};

export default function CorrectedSodium() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const na = parseFloat(values.sodium);
    let glu = parseFloat(values.glucose);

    if (isNaN(na) || isNaN(glu)) {
      if (values.result !== "" || values.interpretation !== null) updateFields({ result: "", interpretation: null });
      return;
    }

    // Convert glucose to mg/dL if in mmol/L
    if (values.glucoseUnit === "mmol/L") glu = glu * 18.0182;

    // Corrected Na = Na + 1.6 * ((Glucose - 100) / 100)
    const correctedNa = na + 1.6 * ((glu - 100) / 100);
    const roundedNa = parseFloat(correctedNa.toFixed(2));

    let status = roundedNa < 135 ? "Hyponatremia" : roundedNa > 145 ? "Hypernatremia" : "Normal";
    let color = status === "Normal" ? "#16a34a" : status === "Hyponatremia" ? "#d97706" : "#dc2626";

    updateFields({
      result: `Corrected Sodium: ${roundedNa} mmol/L`,
      interpretation: { status, color }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.glucose, values.glucoseUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Sodium (mmol/L):</label>
        <SyncSuggestion field="sodium" suggestion={suggestions.sodium} onSync={syncField} />
        <input type="number" value={values.sodium} onChange={(e) => setField("sodium", e.target.value)} className="calc-input" />
      </div>
      <div className="calc-box">
        <label className="calc-label">Glucose:</label>
        <SyncSuggestion field="glucose" suggestion={suggestions.glucose} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.glucose} onChange={(e) => setField("glucose", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.glucoseUnit} onChange={(e) => setField("glucoseUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mg/dL">mg/dL</option><option value="mmol/L">mmol/L</option></select>
        </div>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result">
          <p style={{ fontWeight: "bold" }}>{values.result}</p>
          {values.interpretation && <p>Status: <strong style={{ color: values.interpretation.color }}>{values.interpretation.status}</strong></p>}
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem', opacity: 0.7 }}>
            Formula: Corrected Na = Na + 1.6 × ((Glucose mg/dL – 100) / 100)
          </div>
        </div>
      )}
    </div>
  );
}
