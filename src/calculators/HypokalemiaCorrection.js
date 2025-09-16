// src/calculators/HypokalemiaCorrection.js
import { useState } from "react";

export default function HypokalemiaCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedK, setObservedK] = useState("");
  const [desiredK, setDesiredK] = useState("4.0");
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");

  function calculateHypokalemia() {
    setResults(null);
    setMessage("");

    let weightKg = parseFloat(weight);
    let currentK = parseFloat(observedK);
    let targetK = parseFloat(desiredK);

    // basic validation
    if (isNaN(currentK) || currentK <= 0) {
      setMessage("⚠️ Please enter a valid observed serum K⁺ (mmol/L).");
      return;
    }

    if (isNaN(weightKg) || weightKg <= 0) {
      setMessage("⚠️ Please enter a valid weight.");
      return;
    }

    if (isNaN(targetK)) {
      setMessage("⚠️ Please enter a valid target serum K⁺ (mmol/L).");
      return;
    }

    // If observed is within normal range -> do not correct
    if (currentK >= 3.5 && currentK <= 5.5) {
      setMessage("✅ Serum potassium is within normal range (3.5–5.5 mmol/L). No correction required.");
      return;
    }

    // Hyperkalemia (outside scope)
    if (currentK > 5.5) {
      setMessage("⚠️ Observed K⁺ > 5.5 mmol/L — this tool is for hypokalemia only. Do NOT give K⁺ replacement here.");
      return;
    }

    // Now we have hypokalemia (currentK < 3.5)
    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    if (targetK <= currentK) {
      setMessage("⚠️ Target K⁺ must be greater than observed K⁺ to calculate a deficit.");
      return;
    }

    // Potassium Deficit formula (mmol)
    const deficit = (targetK - currentK) * weightKg * 0.4;

    // Maintenance range (mmol/day) 2–3 mmol/kg/day
    const maintenanceLow = weightKg * 2;
    const maintenanceHigh = weightKg * 3;

    // Total requirement range (mmol)
    const totalLow = deficit + maintenanceLow;
    const totalHigh = deficit + maintenanceHigh;

    setResults({
      deficit,
      maintenanceLow,
      maintenanceHigh,
      totalLow,
      totalHigh,
      weightKg,
      currentK,
      targetK,
    });
  }

  return (
    <div>
      <h2>Hypokalemia Correction Calculator</h2>

      <div>
        <label>Weight: </label>
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

      <div>
        <label>Observed Serum K⁺ (mmol/L): </label>
        <input
          type="number"
          step="0.1"
          value={observedK}
          onChange={(e) => setObservedK(e.target.value)}
        />
      </div>

      <div>
        <label>Target Serum K⁺ (mmol/L): </label>
        <input
          type="number"
          step="0.1"
          value={desiredK}
          onChange={(e) => setDesiredK(e.target.value)}
        />
      </div>

      <button onClick={calculateHypokalemia}>Calculate</button>

      {message && (
        <div style={{ marginTop: "1em" }}>
          <p>{message}</p>
        </div>
      )}

      {results && (
        <div style={{ marginTop: "1em" }}>
          <p>
            <strong>Deficit:</strong>{" "}
            {results.deficit.toFixed(1)} mmol
          </p>

          <p>
            <strong>Daily Maintenance:</strong>{" "}
            {results.maintenanceLow.toFixed(1)} – {results.maintenanceHigh.toFixed(1)} mmol/day
          </p>

          <p>
            <strong>Total:</strong>{" "}
            {results.totalLow.toFixed(1)} – {results.totalHigh.toFixed(1)} mmol
          </p>

          

          <h3>Notes</h3>
          <ul>
            <li><strong>Deficit</strong> = (Desired – Observed) × Weight(kg) × 0.4</li>
            <li><strong>Maintenance</strong> = 2 – 3 mmol/kg/day</li>
            <li><strong>Normal range</strong>: 3.5 – 5.5 mmol/L</li>
            <li><strong>Max daily dose</strong>: 120 mmol/day</li>
            <li><strong>Max infusion rate</strong>: 10–20 mmol/hr</li>
            <li><strong>Max concentration</strong>: 40 mmol/L</li>
            <li>Ensure <strong>urine output</strong> ≥ 0.5 mL/kg/hr (~30 mL/hr in adults) before giving IV replacement</li>
          </ul>
        </div>
      )}
    </div>
  );
}
