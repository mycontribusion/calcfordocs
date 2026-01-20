// src/calculators/GlucoseConverter.js
import { useState } from "react";

export default function GlucoseConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mg"); // mg/dL or mmol/L
  const [type, setType] = useState("random"); // fasting or random
  const [result, setResult] = useState(null);

  function roundTo1Decimal(num) {
    return Math.round(num * 10) / 10;
  }

  function convertGlucose() {
    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) {
      setResult({
        error: "Please enter a valid glucose level."
      });
      return;
    }

    const factor = 18.0182; // 1 mmol/L = 18.0182 mg/dL

    let convertedValue;
    let displayUnit;
    let normalRange;
    let category;
    let categoryColor;

    if (unit === "mg") {
      // mg/dL → mmol/L
      const valMmol = val / factor;
      convertedValue = roundTo1Decimal(valMmol);
      displayUnit = "mmol/L";

      if (type === "fasting") {
        normalRange = "3.9 – 5.6 mmol/L";
        if (valMmol < 3.9) {
          category = "Hypoglycemia";
          categoryColor = "red";
        } else if (valMmol <= 5.6) {
          category = "Normal";
          categoryColor = "green";
        } else if (valMmol < 7.0) {
          category = "Prediabetes";
          categoryColor = "orange";
        } else {
          category = "Diabetes";
          categoryColor = "red";
        }
      } else {
        normalRange = "< 7.8 mmol/L";
        if (valMmol < 3.9) {
          category = "Hypoglycemia";
          categoryColor = "red";
        } else if (valMmol < 7.8) {
          category = "Normal";
          categoryColor = "green";
        } else if (valMmol < 11.1) {
          category = "Prediabetes";
          categoryColor = "orange";
        } else {
          category = "Diabetes";
          categoryColor = "red";
        }
      }
    } else {
      // mmol/L → mg/dL
      const valMg = val * factor;
      convertedValue = roundTo1Decimal(valMg);
      displayUnit = "mg/dL";

      if (type === "fasting") {
        normalRange = "70 – 100 mg/dL";
        if (valMg < 70) {
          category = "Hypoglycemia";
          categoryColor = "red";
        } else if (valMg <= 100) {
          category = "Normal";
          categoryColor = "green";
        } else if (valMg < 126) {
          category = "Prediabetes";
          categoryColor = "orange";
        } else {
          category = "Diabetes";
          categoryColor = "red";
        }
      } else {
        normalRange = "< 140 mg/dL";
        if (valMg < 70) {
          category = "Hypoglycemia";
          categoryColor = "red";
        } else if (valMg < 140) {
          category = "Normal";
          categoryColor = "green";
        } else if (valMg < 200) {
          category = "Prediabetes";
          categoryColor = "orange";
        } else {
          category = "Diabetes";
          categoryColor = "red";
        }
      }
    }

    setResult({
      convertedValue,
      displayUnit,
      category,
      categoryColor,
      normalRange,
      typeLabel: type === "fasting" ? "Fasting" : "Random"
    });
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem"
      }}
    >
      <h2>Glucose Converter</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Glucose Value:</label>
        <br />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <br /><br />
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="mg">mg/dL</option>
          <option value="mmol">mmol/L</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Type:</label>
        <br />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="fasting">Fasting</option>
          <option value="random">Random</option>
        </select>
      </div>

      <button onClick={convertGlucose}>Convert & Interpret</button>

      {result && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p>Conversion Formula: 1 mmol/L = 18.0182 mg/dL</p>

              <p>
                Converted Value: {result.convertedValue}{" "}
                {result.displayUnit}{" "}
                <strong style={{ color: result.categoryColor }}>
                  ({result.category})
                </strong>
              </p>

              <p>
                Normal Range ({result.typeLabel}): {result.normalRange}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
