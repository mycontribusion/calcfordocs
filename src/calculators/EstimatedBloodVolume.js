// src/calculators/EstimatedBloodVolume.js
import { useState } from "react";

export default function EstimatedBloodVolume() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [ageGroup, setAgeGroup] = useState("neonate");
  const [result, setResult] = useState("");

  const validatePositiveNumber = (n) => {
    const x = Number(n);
    return Number.isFinite(x) && x > 0;
  };

  const calculateEBV = () => {
    if (!validatePositiveNumber(weight)) {
      setResult("⚠️ Please enter a valid positive weight.");
      return;
    }

    // Convert weight to kg
    let weightKg = unit === "lb" ? Number(weight) * 0.453592 : Number(weight);

    let range = [70, 70]; // default for adult male
    switch (ageGroup) {
      case "neonate":
        range = [85, 90];
        break;
      case "infant":
        range = [75, 80];
        break;
      case "child":
        range = [70, 75];
        break;
      case "adultMale":
        range = [70, 70];
        break;
      case "adultFemale":
        range = [65, 65];
        break;
      default:
        range = [70, 70];
    }

    const ebvLow = weightKg * range[0];
    const ebvHigh = weightKg * range[1];

    let output =
      ebvLow === ebvHigh
        ? `Estimated Blood Volume: ${ebvLow.toFixed(0)} mL`
        : `Estimated Blood Volume: ${ebvLow.toFixed(0)} – ${ebvHigh.toFixed(0)} mL`;

    setResult(output);
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Estimated Blood Volume (EBV)</h2>

      <label className="block mb-2">
        Weight:
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </label>

      <label className="block mb-2">
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </label>
      <p></p>

      <label className="block mb-2">
        Age Group:
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="neonate">Neonate (85–90 mL/kg)</option>
          <option value="infant">Infant (75–80 mL/kg)</option>
          <option value="child">Child (70–75 mL/kg)</option>
          <option value="adultMale">Adult Male (~70 mL/kg)</option>
          <option value="adultFemale">Adult Female (~65 mL/kg)</option>
        </select>
      </label>
      <p></p>

      <button
        onClick={calculateEBV}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-3 font-semibold">{result}</p>}
    </div>
  );
}
