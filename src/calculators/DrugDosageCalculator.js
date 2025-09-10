import { useState } from "react";
//import "./DrugDosageCalculator.css";

export default function DrugDosageCalculator() {
  const [dosePerKg, setDosePerKg] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg"); // default
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Convert entered weight to kg
  function convertToKg(value, unit) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;

    switch (unit) {
      case "kg":
        return n;
      case "g":
        return n / 1000;
      case "lb":
        return n * 0.453592;
      default:
        return n;
    }
  }

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const doseVal = Number(dosePerKg);
    const weightInKg = convertToKg(weight, weightUnit);

    if (!doseVal || !weightInKg) {
      setError("Enter valid dose and weight.");
      return;
    }

    const total = doseVal * weightInKg;
    setResult(Number(total.toFixed(2)));
  }

  function handleReset() {
    setDosePerKg("");
    setWeight("");
    setWeightUnit("kg");
    setResult(null);
    setError("");
  }

  return (
    <div className="dose-card">
      <h2 className="dose-title">Drug Dosage Calculator</h2>

      <form className="dose-form" onSubmit={handleCalculate}>
        <label className="label">Dose (per kg)</label>
        <input
          className="input-field"
          inputMode="decimal"
          value={dosePerKg}
          onChange={(e) => setDosePerKg(e.target.value)}
          placeholder="e.g., 10"
        />

        <label className="label">Patient Weight</label>
        <div className="flex-container">
          <input
            className="input-field flex-grow"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
          />
          <select
            className="select-field"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>
        </div>

        <div className="actions">
          <button type="submit" className="button">Calculate</button>
          <button type="button" className="button secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {error && <div className="result-box danger">{error}</div>}

      {result !== null && (
        <div className="result-box success">
          <strong>Total Dose:</strong> {result}
        </div>
      )}
    </div>
  );
}
