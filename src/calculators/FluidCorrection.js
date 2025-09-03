// src/calculators/FluidCorrection.js
import { useState } from "react";

export default function FluidCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [severity, setSeverity] = useState("mild");
  const [result, setResult] = useState("");

  function calculateFluids() {
    let weightKg = parseFloat(weight);

    if (isNaN(weightKg) || weightKg <= 0) {
      setResult("Please enter a valid weight.");
      return;
    }

    // Convert lb → kg
    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    // Assign % dehydration based on severity
    let dehydrationPercent = 0;
    if (severity === "mild") {
      dehydrationPercent = 5;
    } else if (severity === "moderate") {
      dehydrationPercent = 10;
    } else if (severity === "severe") {
      dehydrationPercent = 15;
    }

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

    setResult(
      `Deficit (${dehydrationPercent}%): ${deficit.toFixed(
        0
      )} mL | Maintenance: ${maintenance.toFixed(
        0
      )} mL | Total: ${totalFluids.toFixed(0)} mL (24h)`
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Fluid Correction Calculator</h2>

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
      </div>

      {/* Severity Input */}
      <div className="mb-2">
        <label className="block mb-1">Dehydration Severity:</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="mild">Mild (~5%)</option>
          <option value="moderate">Moderate (~10%)</option>
          <option value="severe">Severe (~15%)</option>
        </select>
      </div>

      <button
        onClick={calculateFluids}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-3 font-medium">{result}</p>}
    </div>
  );
}
