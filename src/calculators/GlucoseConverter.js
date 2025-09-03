// src/calculators/GlucoseConverter.js
import { useState } from "react";

export default function GlucoseConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mg"); // default mg/dL
  const [type, setType] = useState("fasting");
  const [result, setResult] = useState("");

  function convertGlucose() {
    let val = parseFloat(value);
    if (isNaN(val) || val <= 0) {
      setResult("Please enter a valid glucose level.");
      return;
    }

    let convertedValue = val;
    let convertedUnit = unit;

    // Conversion
    if (unit === "mmol") {
      convertedValue = val * 18.0182;
      convertedUnit = "mg/dL";
    } else {
      convertedValue = val / 18.0182;
      convertedUnit = "mmol/L";
    }

    // Category determination
    let category = "";
    if (unit === "mg") {
      if (type === "fasting") {
        if (val < 70) category = "(Low - Hypoglycemia)";
        else if (val < 100) category = "(Normal)";
        else if (val < 126) category = "(Impaired Fasting Glucose - Prediabetes)";
        else category = "(Diabetes)";
      } else {
        if (val < 140) category = "(Normal)";
        else if (val < 200) category = "(Impaired Glucose Tolerance - Prediabetes)";
        else category = "(Diabetes)";
      }
    } else {
      if (type === "fasting") {
        if (val < 3.9) category = "(Low - Hypoglycemia)";
        else if (val < 5.6) category = "(Normal)";
        else if (val < 7.0) category = "(Impaired Fasting Glucose - Prediabetes)";
        else category = "(Diabetes)";
      } else {
        if (val < 7.8) category = "(Normal)";
        else if (val < 11.1) category = "(Impaired Glucose Tolerance - Prediabetes)";
        else category = "(Diabetes)";
      }
    }

    setResult(
      `Converted Value: ${convertedValue.toFixed(2)} ${convertedUnit} ${category}`
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Glucose Converter</h2>

      <div className="mb-2">
        <label className="block mb-1">Glucose Value:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Unit:</label>
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
        <label className="block mb-1">Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="fasting">Fasting</option>
          <option value="random">Random/OGTT</option>
        </select>
      </div>

      <button
        onClick={convertGlucose}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Convert
      </button>

      {result && <p className="mt-3 text-sm font-medium">{result}</p>}
    </div>
  );
}
