import React, { useEffect } from "react";
import { useCalc, ResetButton, FormulaBox } from "./CalcFields";
import { toKg, toCm } from "../utils/unitConversion";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  height: "",
  heightUnit: "cm",
  bsa: null,
  interpretation: ""
};

export default function BodySurfaceArea() {
  const { values, updateFields, updateField: setField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const wRaw = parseFloat(values.weight);
    const hRaw = parseFloat(values.height);
    if (isNaN(wRaw) || isNaN(hRaw) || wRaw <= 0 || hRaw <= 0) {
      updateFields({ bsa: null, interpretation: "" });
      return;
    }
    const wKg = toKg(wRaw, values.weightUnit);
    const hCm = toCm(hRaw, values.heightUnit);
    const bsa = Math.sqrt((wKg * hCm) / 3600);
    const formatted = bsa.toFixed(2);
    updateFields({ bsa: formatted, interpretation: `Body Surface Area = ${formatted} m²` });
  }, [values.weight, values.weightUnit, values.height, values.heightUnit, updateFields]);

  return (
    <div className="calc-container">
      <FormulaBox title="Mosteller Formula & Normal BSA Tiers">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Mosteller Formula:</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>
          BSA (m²) = √[ Weight (kg) × Height (cm) ÷ 3600 ]
        </p>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Average Reference Values:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>Adult Male:</strong> ~1.9 m²</li>
          <li><strong>Adult Female:</strong> ~1.6 m²</li>
          <li><strong>Children (9–12 yrs):</strong> ~1.07 m²</li>
          <li><strong>Infants:</strong> ~0.25 m²</li>
        </ul>
      </FormulaBox>

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

      <ResetButton onClick={reset} />

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
