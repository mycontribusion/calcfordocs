// src/calculators/GlucoseConverter.js
import { useState } from "react";

export default function GlucoseConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mg"); // default mg/dL
  const [type, setType] = useState("random");
  const [result, setResult] = useState("");

  function convertGlucose() {
    let val = parseFloat(value);
    if (isNaN(val) || val <= 0) {
      setResult("Please enter a valid glucose level.");
      return;
    }

    const factor = 18.0182; // 1 mmol/L = 18.0182 mg/dL
    let convertedValue = 0;
    let displayUnit = "";
    let normalRange = "";
    let category = "";
    let categoryColor = "";

    if (unit === "mg") {
      let valMmol = val / factor;
      convertedValue = valMmol;
      displayUnit = "mmol/L";

      if (type === "fasting") {
        normalRange = "3.9 – 5.6 mmol/L";
        if (valMmol < 3.9) { category = "Hypoglycemia"; categoryColor = "red"; }
        else if (valMmol <= 5.6) { category = "Normal"; categoryColor = "green"; }
        else if (valMmol < 7.0) { category = "Prediabetes"; categoryColor = "yellow"; }
        else { category = "Diabetes"; categoryColor = "red"; }
      } else {
        normalRange = "< 7.8 mmol/L";
        if (valMmol < 3.9) { category = "Hypoglycemia"; categoryColor = "red"; }
        else if (valMmol < 7.8) { category = "Normal"; categoryColor = "green"; }
        else if (valMmol < 11.1) { category = "Prediabetes"; categoryColor = "yellow"; }
        else { category = "Diabetes"; categoryColor = "red"; }
      }
    } else {
      let valMg = val * factor;
      convertedValue = valMg;
      displayUnit = "mg/dL";

      if (type === "fasting") {
        normalRange = "70 – 100 mg/dL";
        if (valMg < 70) { category = "Hypoglycemia"; categoryColor = "red"; }
        else if (valMg <= 100) { category = "Normal"; categoryColor = "green"; }
        else if (valMg < 126) { category = "Prediabetes"; categoryColor = "yellow"; }
        else { category = "Diabetes"; categoryColor = "red"; }
      } else {
        normalRange = "< 140 mg/dL";
        if (valMg < 70) { category = "Hypoglycemia"; categoryColor = "red"; }
        else if (valMg < 140) { category = "Normal"; categoryColor = "green"; }
        else if (valMg < 200) { category = "Prediabetes"; categoryColor = "yellow"; }
        else { category = "Diabetes"; categoryColor = "red"; }
      }
    }

    setResult([
      `Conversion Formula: 1 mmol/L = 18.0182 mg/dL`,
      <span key="converted">
        Converted Value: {convertedValue.toFixed(2)} {displayUnit}{" "}
        <span style={{ color: categoryColor, fontWeight: "bold" }}>
          ({category})
        </span>
      </span>,
      `Normal Range (${type === "fasting" ? "Fasting" : "Random"}): ${normalRange}`
    ]);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Glucose Converter</h2>

      <div className="mb-2">
        <label className="block mb-1">Glucose Value:</label><br />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="mg">mg/dL</option>
          <option value="mmol">mmol/L</option>
        </select>
      </div>

      <div className="mb-2">
        <p></p>
        <label className="block mb-1">Type: </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="fasting">Fasting</option>
          <option value="random">Random</option>
        </select>
      </div>
      <p></p>
      <button
        onClick={convertGlucose}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Convert & Interpret
      </button>

      {Array.isArray(result) &&
        result.map((line, idx) => (
          <p key={idx} className="mb-2 text-sm font-medium">
            {line}
          </p>
        ))}
    </div>
  );
}
