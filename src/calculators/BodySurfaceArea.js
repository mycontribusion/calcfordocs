// src/calculators/BodySurfaceArea.js
import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  height: "",
  heightUnit: "cm",
  bsa: null,
  interpretation: ""
};

export default function BodySurfaceArea() {
  const { values, updateFields, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const wRaw = parseFloat(values.weight);
    const hRaw = parseFloat(values.height);
    if (isNaN(wRaw) || isNaN(hRaw) || wRaw <= 0 || hRaw <= 0) {
      updateFields({ bsa: null, interpretation: "" });
      return;
    }
    // Convert weight to kilograms
    const wKg = values.weightUnit === "kg" ? wRaw : values.weightUnit === "g" ? wRaw / 1000 : wRaw * 0.453592;
    // Convert height to centimeters
    const hCm = values.heightUnit === "cm" ? hRaw : values.heightUnit === "m" ? hRaw * 100 : hRaw * 2.54;
    const bsa = Math.sqrt((wKg * hCm) / 3600);
    const formatted = bsa.toFixed(2);
    updateFields({ bsa: formatted, interpretation: `Body Surface Area = ${formatted} m²` });
  }, [values.weight, values.weightUnit, values.height, values.heightUnit, updateFields]);

  return (
    <div className="calc-container">
      <h2 className="calc-formula-title">Mosteller Formula</h2>
      <p className="calc-formula">BSA = √(Weight × Height / 3600)</p>
      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            value={values.weight}
            onChange={e => setField("weight", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={values.weightUnit}
            onChange={e => setField("weightUnit", e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Height:</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            value={values.height}
            onChange={e => setField("height", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={values.heightUnit}
            onChange={e => setField("heightUnit", e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="cm">cm</option>
            <option value="m">m</option>
            <option value="in">in</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">
        Reset Calculator
      </button>

      {values.bsa !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>
            <strong>BSA:</strong> {values.bsa} m²
          </p>
          <p style={{ color: "#0056b3", marginTop: 4 }}>{values.interpretation}</p>
        </div>
      )}
    </div>
  );
}
