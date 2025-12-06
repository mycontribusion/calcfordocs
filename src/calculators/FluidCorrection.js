import { useState } from "react";

export default function FluidCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [severity, setSeverity] = useState("mild");
  const [result, setResult] = useState(null);

  function calculateFluids() {
    let weightKg = parseFloat(weight);

    if (isNaN(weightKg) || weightKg <= 0) {
      setResult({ error: "Please enter a valid weight." });
      return;
    }

    // Convert lb → kg
    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    // Assign % dehydration based on severity
    let dehydrationPercent = 0;
    if (severity === "mild") dehydrationPercent = 5;
    else if (severity === "moderate") dehydrationPercent = 10;
    else if (severity === "severe") dehydrationPercent = 15;

    // Deficit calculation
    const deficit = dehydrationPercent * weightKg * 10;

    // Maintenance calculation (Holliday–Segar)
    let maintenance = 0;
    if (weightKg <= 10) {
      maintenance = weightKg * 100;
    } else if (weightKg <= 20) {
      maintenance = 1000 + (weightKg - 10) * 50;
    } else {
      maintenance = 1500 + (weightKg - 20) * 20;
    }

    const totalFluids = deficit + maintenance;

    setResult({
      deficit: deficit.toFixed(0),
      maintenance: maintenance.toFixed(0),
      total: totalFluids.toFixed(0),
      percent: dehydrationPercent,
    });
  }

  return (
    <div>
      <h2>Fluid Correction Calculator</h2>

      {/* Weight Input */}
      <div>
        <label>Weight: </label><br />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </div>

      {/* Severity Input */}
      <p></p>
      <div>
        <label>Dehydration Severity: </label><br />
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="mild">Mild (~5%)</option>
          <option value="moderate">Moderate (~10%)</option>
          <option value="severe">Severe (~15%)</option>
        </select>
      </div>
      <p></p>

      <button onClick={calculateFluids}>Calculate</button>

      {result && (
        <div style={{ marginTop: "15px" }}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p><strong>Deficit ({result.percent}%):</strong> {result.deficit} mL</p>
              <p><strong>Maintenance:</strong> {result.maintenance} mL</p>
              <p><strong>Total (24h):</strong> {result.total} mL</p>

              <hr />

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
      )}
    </div>
  );
}
