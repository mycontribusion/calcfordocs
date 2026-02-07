import { useState, useEffect } from "react";
import "./CalculatorShared.css";

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
    <div className="calc-container">
      <h2 className="calc-title">Hypokalemia Correction Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">Weight: </label>
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

      <div className="calc-box">
        <label className="calc-label">Observed Serum K⁺ (mmol/L): </label>
        <input
          type="number"
          step="0.1"
          value={observedK}
          onChange={(e) => setObservedK(e.target.value)}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Target Serum K⁺ (mmol/L): </label>
        <input
          type="number"
          step="0.1"
          value={desiredK}
          onChange={(e) => setDesiredK(e.target.value)}
          className="calc-input"
        />
      </div>

      <button onClick={handleReset} className="calc-btn-reset">Reset</button>

      {message && (
        <div className="calc-result" style={{ marginTop: 16, borderColor: message.includes("✅") ? '#16a34a' : '#ea580c', color: message.includes("✅") ? '#16a34a' : '#ea580c', background: message.includes("✅") ? 'rgba(22, 163, 74, 0.05)' : 'rgba(234, 88, 12, 0.05)' }}>
          <p>{message}</p>
        </div>
      )}

      {results && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>
            <strong>Deficit:</strong> {results.deficit.toFixed(1)} mmol
          </p>

          <p style={{ margin: '8px 0', fontSize: '0.9rem', color: '#555' }}>
            Ensure <strong>urine output</strong> ≥ 0.5 mL/kg/hr (~30 mL/hr in adults) before giving IV replacement
          </p>

          <p>
            <strong>Daily Maintenance:</strong> {results.maintenance.toFixed(1)} mmol/day
          </p>

          <p style={{ marginTop: 8, fontSize: '1.1rem', color: '#0056b3' }}>
            <strong>Total Requirement:</strong> {results.total.toFixed(1)} mmol
          </p>

          <div style={{ marginTop: 16, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px' }}>Notes</h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.9rem', color: '#444' }}>
              <li><strong>Deficit</strong> = (Desired – Observed) × Weight(kg) × 0.6</li>
              <li><strong>Maintenance</strong> = 1 mmol/kg/day</li>
              <li><strong>Normal range</strong>: 3.5 – 5.5 mmol/L</li>
              <li><strong>Max daily dose</strong>: 120 mmol/day</li>
              <li><strong>Max infusion rate</strong>: 10–20 mmol/hr</li>
              <li><strong>Max concentration</strong>: 40 mmol/L</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
