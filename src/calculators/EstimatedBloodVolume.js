// src/calculators/EstimatedBloodVolume.js
import { useState } from "react";
import "./CalculatorShared.css";

export default function EstimatedBloodVolume() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [ageGroup, setAgeGroup] = useState("neonate");

  const validatePositiveNumber = (n) => {
    const x = Number(n);
    return Number.isFinite(x) && x > 0;
  };

  // Auto-calc result
  const result = (() => {
    if (!validatePositiveNumber(weight)) return "⚠️ Please enter a valid positive weight.";

    const weightKg = unit === "lb" ? Number(weight) * 0.453592 : Number(weight);

    let range = [70, 70]; // default adult male
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

    return ebvLow === ebvHigh
      ? `Estimated Blood Volume: ${ebvLow.toFixed(0)} mL`
      : `Estimated Blood Volume: ${ebvLow.toFixed(0)} – ${ebvHigh.toFixed(0)} mL`;
  })();

  return (
    <div className="calc-container" style={{ maxWidth: 360 }}>
      <h2 className="calc-title">Estimated Blood Volume (EBV)</h2>

      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Unit:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="calc-select"
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">Age Group:</label>
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="calc-select"
        >
          <option value="neonate">Neonate (85–90 mL/kg)</option>
          <option value="infant">Infant (75–80 mL/kg)</option>
          <option value="child">Child (70–75 mL/kg)</option>
          <option value="adultMale">Adult Male (~70 mL/kg)</option>
          <option value="adultFemale">Adult Female (~65 mL/kg)</option>
        </select>
      </div>

      <div className="calc-result" style={{ marginTop: 12 }}>
        {result}
      </div>
    </div>
  );
}
