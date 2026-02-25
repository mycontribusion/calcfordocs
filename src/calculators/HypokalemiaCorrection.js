import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  potassium: "",
  desiredK: "4.0",
  results: null,
  message: "",
};

export default function HypokalemiaCorrection() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    if (!values.weight || !values.potassium || !values.desiredK) {
      if (values.results !== null || values.message !== "") updateFields({ results: null, message: "" });
      return;
    }

    let weightKg = parseFloat(values.weight);
    let currentK = parseFloat(values.potassium);
    let targetK = parseFloat(values.desiredK);

    if (isNaN(currentK) || currentK <= 0) { updateFields({ message: "⚠️ Please enter a valid observed serum K⁺ (mmol/L).", results: null }); return; }
    if (isNaN(weightKg) || weightKg <= 0) { updateFields({ message: "⚠️ Please enter a valid weight.", results: null }); return; }
    if (isNaN(targetK)) { updateFields({ message: "⚠️ Please enter a valid target serum K⁺ (mmol/L).", results: null }); return; }

    if (currentK > 5.5) { updateFields({ message: "⚠️ Observed K⁺ > 5.5 mmol/L — this tool is for hypokalemia only.", results: null }); return; }
    if (currentK >= 3.5 && currentK <= 5.5) { updateFields({ message: "✅ Serum potassium is within normal range (3.5–5.5 mmol/L).", results: null }); return; }

    if (values.weightUnit === "lb") weightKg = weightKg * 0.453592;
    if (targetK <= currentK) { updateFields({ message: "⚠️ Target K⁺ must be greater than observed K⁺.", results: null }); return; }

    const deficit = (targetK - currentK) * weightKg * 0.6;
    const maintenance = weightKg * 1;
    const total = deficit + maintenance;

    updateFields({ results: { deficit, maintenance, total }, message: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.weight, values.weightUnit, values.potassium, values.desiredK]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Weight: </label>
        <SyncSuggestion field="weight" suggestion={suggestions.weight} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.weight} onChange={(e) => setField("weight", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.weightUnit} onChange={(e) => setField("weightUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="kg">kg</option><option value="lb">lb</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Observed Serum K⁺ (mmol/L): </label>
        <SyncSuggestion field="potassium" suggestion={suggestions.potassium} onSync={syncField} />
        <input type="number" step="0.1" value={values.potassium} onChange={(e) => setField("potassium", e.target.value)} className="calc-input" />
      </div>
      <div className="calc-box">
        <label className="calc-label">Target Serum K⁺ (mmol/L): </label>
        <input type="number" step="0.1" value={values.desiredK} onChange={(e) => setField("desiredK", e.target.value)} className="calc-input" />
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.message && <div className="calc-result" style={{ marginTop: 16, borderColor: values.message.includes("✅") ? '#16a34a' : '#ea580c', color: values.message.includes("✅") ? '#16a34a' : '#ea580c' }}><p>{values.message}</p></div>}
      {values.results && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Deficit:</strong> {values.results.deficit.toFixed(1)} mmol</p>
          <p><strong>Daily Maintenance:</strong> {values.results.maintenance.toFixed(1)} mmol/day</p>
          <p style={{ marginTop: 8, fontSize: '1.1rem', color: '#0056b3' }}><strong>Total Requirement:</strong> {values.results.total.toFixed(1)} mmol</p>

          <div style={{ marginTop: 16, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px' }}>Notes & Safety</h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.85rem', color: '#444' }}>
              <li><strong>Formula:</strong> Deficit = (Target – Observed) × Weight(kg) × 0.6</li>
              <li><strong>Maintenance:</strong> 1 mmol/kg/day</li>
              <li>Ensure <strong>urine output</strong> ≥ 0.5 mL/kg/hr before IV replacement</li>
              <li><strong>Max daily dose:</strong> 120 mmol/day</li>
              <li><strong>Max infusion rate:</strong> 10–20 mmol/hr</li>
              <li><strong>Max concentration:</strong> 40 mmol/L (peripheral line)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
