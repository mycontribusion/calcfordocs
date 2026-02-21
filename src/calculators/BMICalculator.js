// src/calculators/BmiCalculator.js
import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  height: "",
  heightUnit: "cm",
  result: "",
};

export default function BmiCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    let weightKg = parseFloat(values.weight);
    let heightM = parseFloat(values.height);

    if (
      !Number.isFinite(weightKg) ||
      !Number.isFinite(heightM) ||
      weightKg <= 0 ||
      heightM <= 0
    ) {
      if (values.result !== "") updateFields({ result: "" });
      return;
    }

    // Convert weight to kg
    if (values.weightUnit === "lb") {
      weightKg *= 0.453592;
    }

    // Convert height to meters
    let hM = heightM;
    if (values.heightUnit === "cm") {
      hM /= 100;
    } else if (values.heightUnit === "inch") {
      hM *= 0.0254;
    }

    const bmi = weightKg / (hM * hM);
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";

    const finalRes = `BMI: ${bmi.toFixed(2)} - ${category}`;
    if (values.result !== finalRes) {
      updateFields({ result: finalRes });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.weight, values.weightUnit, values.height, values.heightUnit]);

  return (
    <div className="calc-container">

      {/* Weight */}
      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.weight}
            onChange={(e) => setField("weight", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={values.weightUnit}
            onChange={(e) => setField("weightUnit", e.target.value)}
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
            value={values.height}
            onChange={(e) => setField("height", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={values.heightUnit}
            onChange={(e) => setField("heightUnit", e.target.value)}
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
        onClick={reset}
        className="calc-btn-reset"
      >
        Reset Calculator
      </button>

      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p className="font-medium">{values.result}</p>
          <p className="text-sm text-gray-600 mt-2" style={{ fontSize: '0.9rem', color: '#555' }}>
            Formula: <span className="font-mono">BMI = weight (kg) ÷ [height (m)]²</span>
          </p>
        </div>
      )}
    </div>
  );
}
