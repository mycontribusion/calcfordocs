import { useState } from "react";

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
    <div style={{padding: 16, borderRadius: 8, maxWidth: 400, margin: "1rem auto" }}>
      <h2>Fluid Correction Calculator</h2>

      {/* Weight */}
      <label style={{ display: "block", marginBottom: 8 }}>
        Weight:
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Unit:
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </label>

      {/* Severity */}
      <label style={{ display: "block", marginBottom: 8 }}>
        Dehydration Severity:
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{ width: "100%", padding: 6, marginTop: 4 }}
        >
          <option value="mild">Mild (~5%)</option>
          <option value="moderate">Moderate (~10%)</option>
          <option value="severe">Severe (~15%)</option>
        </select>
      </label>

      {/* Result */}
      <div style={{ marginTop: 16 }}>
        {result.error ? (
          <p>{result.error}</p>
        ) : (
          <>
            <p><strong>Deficit ({result.percent}%):</strong> {result.deficit} mL</p>
            <p><strong>Maintenance:</strong> {result.maintenance} mL</p>
            <p><strong>Total (24h):</strong> {result.total} mL</p>

            <hr style={{ margin: "12px 0" }} />

            <p><strong>Formulas Used:</strong></p>
            <p>Deficit = % dehydration × Weight (kg) × 10</p>
            <p>Maintenance:</p>
            <ul>
              <li>First 10 kg → 100 mL/kg</li>
              <li>Next 10 kg → 50 mL/kg</li>
              <li>Above 20 kg → 20 mL/kg</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
