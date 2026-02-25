import React from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  severity: "mild",
  // Global Sync Keys
  age: "",
  sex: "male",
};

export default function FluidCorrection() {
  const { values, suggestions, updateField: setField, syncField, reset } = useCalculator(INITIAL_STATE);

  const result = (() => {
    let weightKg = parseFloat(values.weight);
    if (isNaN(weightKg) || weightKg <= 0) return { error: "Please enter a valid weight." };

    // Convert lb → kg
    if (values.weightUnit === "lb") weightKg = weightKg * 0.453592;

    // Dehydration %
    let dehydrationPercent = 0;
    if (values.severity === "mild") dehydrationPercent = 5;
    else if (values.severity === "moderate") dehydrationPercent = 10;
    else if (values.severity === "severe") dehydrationPercent = 15;

    // Deficit
    const deficit = dehydrationPercent * weightKg * 10;

    // Maintenance (Holliday–Segar)
    let maintenance = 0;
    if (weightKg <= 10) maintenance = weightKg * 100;
    else if (weightKg <= 20) maintenance = 1000 + (weightKg - 10) * 50;
    else maintenance = 1500 + (weightKg - 20) * 20;

    const totalFluids = deficit + maintenance;

    return {
      deficit: deficit.toFixed(0),
      maintenance: maintenance.toFixed(0),
      total: totalFluids.toFixed(0),
      percent: dehydrationPercent,
    };
  })();

  return (
    <div className="calc-container" style={{ maxWidth: 400 }}>

      {/* Weight */}
      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <SyncSuggestion field="weight" suggestion={suggestions.weight} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.weight}
            onChange={(e) => setField("weight", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={values.weightUnit}
            onChange={(e) => setField("weightUnit", e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      {/* Severity */}
      <div className="calc-box">
        <label className="calc-label">Dehydration Severity:</label>
        <select
          value={values.severity}
          onChange={(e) => setField("severity", e.target.value)}
          className="calc-select"
        >
          <option value="mild">Mild (~5%)</option>
          <option value="moderate">Moderate (~10%)</option>
          <option value="severe">Severe (~15%)</option>
        </select>
      </div>

      {/* Result */}
      <div style={{ marginTop: 16 }}>
        {result.error ? (
          <p className="calc-result" style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>{result.error}</p>
        ) : (
          <div className="calc-result" style={{ textAlign: 'left' }}>
            <p><strong>Deficit ({result.percent}%):</strong> {result.deficit} mL</p>
            <p><strong>Maintenance:</strong> {result.maintenance} mL</p>
            <p><strong>Total (24h):</strong> {result.total} mL</p>

            <hr style={{ margin: "12px 0", borderColor: 'rgba(0,0,0,0.1)' }} />

            <p style={{ fontSize: '0.9rem' }}><strong>Formulas Used:</strong></p>
            <p style={{ fontSize: '0.85rem' }}>Deficit = % dehydration × Weight (kg) × 10</p>
            <p style={{ fontSize: '0.85rem' }}>Maintenance: Holliday–Segar method</p>
          </div>
        )}
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}
