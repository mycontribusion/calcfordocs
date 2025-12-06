// src/calculators/BmiCalculator.js
import { useState } from "react";

export default function BmiCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [result, setResult] = useState("");

  function calculateBMI() {
    let weightKg = parseFloat(weight);
    let heightM = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
      setResult("Please enter valid weight and height.");
      return;
    }

    // Convert weight to kg
    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    // Convert height to meters
    if (heightUnit === "cm") {
      heightM = heightM / 100;
    } else if (heightUnit === "inch") {
      heightM = heightM * 0.0254;
    } else if (heightUnit === "m") {
      heightM = heightM / 1; // already meters
    }

    let bmi = weightKg / (heightM * heightM);
    let category = "";

    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 24.9) {
      category = "Normal weight";
    } else if (bmi < 29.9) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    setResult(`BMI: ${bmi.toFixed(2)} - ${category}`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">BMI Calculator</h2>

      {/* Weight Input */}
      <div className="mb-2">
        <label className="block mb-1">Weight:</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div><p></p>

      {/* Height Input */}
      <div className="mb-2">
        <label className="block mb-1">Height:</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="inch">inch</option>
          </select>
        </div>
      </div><p></p>

      <button
        onClick={calculateBMI}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-3 font-medium">{result}</p>}
      <p className="text-sm text-gray-600 mt-2">
            Formula: <span className="font-mono">BMI = weight (kg) ÷ [height (m)]²</span>
          </p>
    </div>
  );
}
