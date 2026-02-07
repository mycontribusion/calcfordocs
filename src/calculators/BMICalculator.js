// src/calculators/BmiCalculator.js
import { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("m");
  const [result, setResult] = useState("");

  function calculateBMI() {
    let weightKg = parseFloat(weight);
    let heightM = parseFloat(height);

    if (
      !Number.isFinite(weightKg) ||
      !Number.isFinite(heightM) ||
      weightKg <= 0 ||
      heightM <= 0
    ) {
      setResult("");
      return;
    }

    // Convert weight to kg
    if (weightUnit === "lb") {
      weightKg *= 0.453592;
    }

    // Convert height to meters
    if (heightUnit === "cm") {
      heightM /= 100;
    } else if (heightUnit === "inch") {
      heightM *= 0.0254;
    }

    const bmi = weightKg / (heightM * heightM);
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";

    setResult(`BMI: ${bmi.toFixed(2)} - ${category}`);
  }

  // 🔁 Auto-calculate silently
  useEffect(() => {
    calculateBMI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, weightUnit, height, heightUnit]);

  function handleReset() {
    setWeight("");
    setHeight("");
    setWeightUnit("kg");
    setHeightUnit("cm");
    setResult("");
  }

  return (
    <div className="calc-container">
      <h2 className="calc-title">BMI Calculator</h2>

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

      {/* Height */}
      <div className="calc-box">
        <label className="calc-label">Height:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="inch">inch</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleReset}
        className="calc-btn-reset"
      >
        Reset
      </button>

      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p className="font-medium">{result}</p>
          <p className="text-sm text-gray-600 mt-2" style={{ fontSize: '0.9rem', color: '#555' }}>
            Formula: <span className="font-mono">BMI = weight (kg) ÷ [height (m)]²</span>
          </p>
        </div>
      )}
    </div>
  );
}
