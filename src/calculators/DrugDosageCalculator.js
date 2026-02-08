import React, { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function DrugDosageCalculator() {
  const [dose, setDose] = useState(""); // the dose value
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [doseUnit, setDoseUnit] = useState("/kg"); // selected dosing type
  const [numDoses, setNumDoses] = useState(1); // for /kg/day
  const [duration, setDuration] = useState(""); // for /min or /kg/min
  const [durationUnit, setDurationUnit] = useState("hours"); // default to hours
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Convert weight to kg
  const convertWeightToKg = (value, unit) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;
    switch (unit) {
      case "kg": return n;
      case "g": return n / 1000;
      case "lb": return n * 0.453592;
      default: return n;
    }
  };

  const calculate = () => {
    setError("");
    setResult(null);

    const w = convertWeightToKg(weight, weightUnit);
    const d = Number(dose);
    let dur = Number(duration);
    const nDoses = Number(numDoses);

    if (!d || (doseUnit.includes("kg") && !w)) {
      setError("Enter valid dose and weight.");
      return;
    }

    if ((doseUnit === "/min" || doseUnit === "/kg/min") && (!dur || dur <= 0)) {
      setError("Enter valid duration.");
      return;
    }

    // Convert duration to minutes if hours is selected
    if (durationUnit === "hours" && (doseUnit === "/min" || doseUnit === "/kg/min")) {
      dur *= 60;
    }

    let total = 0;

    switch (doseUnit) {
      case "/kg":
        total = d * w;
        break;
      case "/kg/day":
        if (!nDoses || nDoses < 1) {
          setError("Enter valid number of doses.");
          return;
        }
        total = (d * w) / nDoses;
        break;
      case "/min":
        total = d * dur;
        break;
      case "/kg/min":
        total = d * w * dur;
        break;
      default:
        setError("Invalid dosing type.");
        return;
    }

    setResult(total.toFixed(2));
  };

  // Auto-calculate when relevant inputs change
  useEffect(() => {
    if (dose && weight) calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dose, weight, weightUnit, doseUnit, numDoses, duration, durationUnit]);

  const reset = () => {
    setDose("");
    setWeight("");
    setWeightUnit("kg");
    setDoseUnit("/kg");
    setNumDoses(1);
    setDuration("");
    setDurationUnit("hours");
    setResult(null);
    setError("");
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Dose:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            inputMode="decimal"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            placeholder="Enter dose"
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={doseUnit} onChange={(e) => setDoseUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="/kg">/kg</option>
            <option value="/kg/day">/kg/day</option>
            <option value="/min">/min</option>
            <option value="/kg/min">/kg/min</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Patient weight"
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      {/* Conditional extra inputs */}
      {doseUnit === "/kg/day" && (
        <div className="calc-box">
          <label className="calc-label">Number of divided doses per day:</label>
          <input
            type="number"
            min="1"
            value={numDoses}
            onChange={(e) => setNumDoses(e.target.value)}
            className="calc-input"
          />
        </div>
      )}

      {(doseUnit === "/min" || doseUnit === "/kg/min") && (
        <div className="calc-box">
          <label className="calc-label">Duration:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="calc-input"
              style={{ flex: 2 }}
            />
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value)}
              className="calc-select"
              style={{ flex: 1 }}
            >
              <option value="hours">hours</option>
              <option value="minutes">minutes</option>
            </select>
          </div>
        </div>
      )}

      <button type="button" onClick={reset} className="calc-btn-reset">Reset</button>

      {error && <div className="calc-result" style={{ marginTop: 16, color: '#ef4444', borderColor: '#ef4444' }}>{error}</div>}

      {result !== null && !error && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <strong>Total Dose:</strong> {result}
        </div>
      )}
    </div>
  );
}
