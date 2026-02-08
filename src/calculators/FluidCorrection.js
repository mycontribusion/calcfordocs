import { useState } from "react";
import "./CalculatorShared.css";

export default function FluidCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [severity, setSeverity] = useState("mild");

  const result = (() => {
    let weightKg = parseFloat(weight);
    if (isNaN(weightKg) || weightKg <= 0) return { error: "Please enter a valid weight." };

    // Convert lb → kg
    if (weightUnit === "lb") weightKg = weightKg * 0.453592;

    // Dehydration %
    let dehydrationPercent = 0;
    if (severity === "mild") dehydrationPercent = 5;
    else if (severity === "moderate") dehydrationPercent = 10;
    else if (severity === "severe") dehydrationPercent = 15;

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
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
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
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
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
    </div>
  );
}
