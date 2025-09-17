// src/calculators/WeightEstimator.js
import { useState } from "react";

export default function WeightEstimator() {
  const [age, setAge] = useState("");
  const [unit, setUnit] = useState("months");
  const [formula, setFormula] = useState("nelson");
  const [result, setResult] = useState(null);

  function estimateWeight(age, unit, formula) {
    let weight;
    let explanation = "";
    let converted = "";

    // Convert units if necessary
    let months = 0;
    let years = 0;

    if (unit === "days") {
      months = age / 30.44; // approx conversion
      converted = `${age} days ≈ ${months.toFixed(1)} months`;
    } else if (unit === "months") {
      months = age;
      if (months >= 12) {
        years = months / 12;
        converted = `${age} months ≈ ${years.toFixed(1)} years`;
      } else {
        converted = `${age} months`;
      }
    } else if (unit === "years") {
      years = age;
      converted = `${age} years`;
    }

    // Apply formulas
    if (formula === "nelson") {
      if (months >= 3 && months <= 11) {
        weight = (months + 9) / 2;
        explanation = `Nelson Formula: Weight = (Age in months + 9) / 2`;
      } else if (years >= 1 && years <= 6) {
        weight = 2 * years + 8;
        explanation = `Nelson Formula: Weight = (2 × Age in years) + 8`;
      } else if (years >= 7 && years <= 12) {
        weight = 7 * years - 5;
        explanation = `Nelson Formula: Weight = (7 × Age in years) - 5`;
      } else {
        return null;
      }
    } else if (formula === "bestGuess") {
      if (months >= 1 && months <= 11) {
        weight = (months + 9) / 2;
        explanation = `Best Guess Formula: Weight = (Age in months + 9) / 2`;
      } else if (years >= 1 && years <= 5) {
        weight = 2 * years + 5;
        explanation = `Best Guess Formula: Weight = (2 × Age in years) + 5`;
      } else if (years >= 5 && years <= 14) {
        weight = 4 * years;
        explanation = `Best Guess Formula: Weight = 4 × Age in years`;
      } else {
        return null;
      }
    }

    return {
      weight: weight.toFixed(1),
      explanation,
      converted,
    };
  }

  function handleCalculate() {
    const ageNum = parseFloat(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setResult({ error: "Please enter a valid age." });
      return;
    }
    const res = estimateWeight(ageNum, unit, formula);
    if (!res) {
      setResult({ error: "Estimation not available for this age range." });
      return;
    }
    setResult(res);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Weight Estimator</h2>

      <div className="mb-2">
        Age:
        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        >
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>

      <div className="mb-2"><p></p>
        <label className="mr-2">Formula:</label>
        <select
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="nelson">Nelson</option>
          <option value="bestGuess">Best Guess</option>
        </select>
      </div><p></p>

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && result.error && (
        <p className="mt-2 text-sm font-medium text-red-600">{result.error}</p>
      )}

      {result && !result.error && (
        <div className="mt-2 text-sm font-medium">
          <p>Estimated Weight: {result.weight} kg</p>
          <p>{result.explanation}</p>
          <p>Converted Age: {result.converted}</p>
        </div>
      )}
    </div>
  );
}
