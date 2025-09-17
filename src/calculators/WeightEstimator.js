// src/calculators/WeightEstimator.js
import { useState } from "react";

export default function WeightEstimator() {
  const [age, setAge] = useState("");
  const [unit, setUnit] = useState("years");
  const [result, setResult] = useState("");
  const [formula, setFormula] = useState("");

  function estimateWeight(age, unit) {
    let weight;
    let usedFormula = "";

    if (unit === "days") {
      weight = age * 0.02 + 3;
      usedFormula = "Weight = (Age in days × 0.02) + 3";
    } else if (unit === "months") {
      weight = age * 0.5 + 4;
      usedFormula = "Weight = (Age in months × 0.5) + 4";
    } else if (unit === "years") {
      if (age >= 1 && age <= 5) {
        weight = 2 * age + 8;
        usedFormula = "Weight = (Age in years × 2) + 8";
      } else if (age >= 6 && age <= 12) {
        weight = 3 * age + 7;
        usedFormula = "Weight = (Age in years × 3) + 7";
      } else if (age >= 13 && age <= 18) {
        weight = 3.5 * age + 5;
        usedFormula = "Weight = (Age in years × 3.5) + 5";
      } else {
        return { weight: null, formula: "Estimation not available for this age range." };
      }
    }

    return weight
      ? { weight: `${weight.toFixed(2)} kg`, formula: usedFormula }
      : { weight: null, formula: "Invalid age input." };
  }

  function handleCalculate() {
    const ageNum = parseFloat(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setResult("Please enter a valid age.");
      setFormula("");
      return;
    }

    const { weight, formula } = estimateWeight(ageNum, unit);
    setResult(weight ? "Estimated Weight: " + weight : formula);
    setFormula(weight ? "Formula Used: " + formula : "");
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Weight Estimator</h2>

      <div className="mb-2">
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

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
      {formula && <p className="mt-1 text-xs text-gray-600 italic">{formula}</p>}
    </div>
  );
}
