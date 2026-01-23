import { useState, useEffect } from "react";

export default function HypokalemiaCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedK, setObservedK] = useState("");
  const [desiredK, setDesiredK] = useState("4.0");
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");

  // 🔄 Auto calculation
  useEffect(() => {
    // If any input is empty, reset results and message
    if (!weight || !observedK || !desiredK) {
      setResults(null);
      setMessage("");
      return;
    }

    let weightKg = parseFloat(weight);
    let currentK = parseFloat(observedK);
    let targetK = parseFloat(desiredK);

    // basic validation
    if (isNaN(currentK) || currentK <= 0) {
      setMessage("⚠️ Please enter a valid observed serum K⁺ (mmol/L).");
      setResults(null);
      return;
    }

    if (isNaN(weightKg) || weightKg <= 0) {
      setMessage("⚠️ Please enter a valid weight.");
      setResults(null);
      return;
    }

    if (isNaN(targetK)) {
      setMessage("⚠️ Please enter a valid target serum K⁺ (mmol/L).");
      setResults(null);
      return;
    }

    // Hyperkalemia (outside scope)
    if (currentK > 5.5) {
      setMessage("⚠️ Observed K⁺ > 5.5 mmol/L — this tool is for hypokalemia only. Do NOT give K⁺ replacement here.");
      setResults(null);
      return;
    }

    // Normal range — no correction needed
    if (currentK >= 3.5 && currentK <= 5.5) {
      setMessage("✅ Serum potassium is within normal range (3.5–5.5 mmol/L). No correction required.");
      setResults(null);
      return;
    }

    // Convert lb → kg
    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    if (targetK <= currentK) {
      setMessage("⚠️ Target K⁺ must be greater than observed K⁺ to calculate a deficit.");
      setResults(null);
      return;
    }

    // Potassium Deficit formula (mmol)
    const deficit = (targetK - currentK) * weightKg * 0.6;

    // Maintenance (mmol/day) 1 mmol/kg/day
    const maintenance = weightKg * 1;

    // Total requirement
    const total = deficit + maintenance;

    setResults({
      deficit,
      maintenance,
      total,
      weightKg,
      currentK,
      targetK,
    });

    setMessage(""); // clear any previous messages
  }, [weight, weightUnit, observedK, desiredK]);

  // 🔄 Reset all fields
  const handleReset = () => {
    setWeight("");
    setWeightUnit("kg");
    setObservedK("");
    setDesiredK("4.0");
    setResults(null);
    setMessage("");
  };

  return (
    <div>
      <h2>Hypokalemia Correction Calculator</h2>

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

      <div>
        <p></p>
        <label>Observed Serum K⁺ (mmol/L): </label><br />
        <input
          type="number"
          step="0.1"
          value={observedK}
          onChange={(e) => setObservedK(e.target.value)}
        />
      </div>

      <div>
        <p></p>
        <label>Target Serum K⁺ (mmol/L): </label><br />
        <input
          type="number"
          step="0.1"
          value={desiredK}
          onChange={(e) => setDesiredK(e.target.value)}
        />
      </div>

      <p></p>
      <button onClick={handleReset}>Reset</button><p></p>

      {message && (
        <div style={{ marginTop: "1em" }}>
          <p>{message}</p>
        </div>
      )}

      {results && (
        <div style={{ marginTop: "1em" }}>
          <p>
            <strong>Deficit:</strong> {results.deficit.toFixed(1)} mmol
          </p>

          <p>
            Ensure <strong>urine output</strong> ≥ 0.5 mL/kg/hr (~30 mL/hr in adults) before giving IV replacement
          </p>

          <p>
            <strong>Daily Maintenance:</strong> {results.maintenance.toFixed(1)} mmol/day
          </p>

          <p>
            <strong>Total Requirement:</strong> {results.total.toFixed(1)} mmol
          </p>

          <h3>Notes</h3>
          <ul>
            <li><strong>Deficit</strong> = (Desired – Observed) × Weight(kg) × 0.6</li>
            <li><strong>Maintenance</strong> = 1 mmol/kg/day</li>
            <li><strong>Normal range</strong>: 3.5 – 5.5 mmol/L</li>
            <li><strong>Max daily dose</strong>: 120 mmol/day</li>
            <li><strong>Max infusion rate</strong>: 10–20 mmol/hr</li>
            <li><strong>Max concentration</strong>: 40 mmol/L</li>
          </ul>
        </div>
      )}
    </div>
  );
}
