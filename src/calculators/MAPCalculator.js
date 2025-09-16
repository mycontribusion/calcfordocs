// src/calculators/MapCalculator.js
import { useState } from "react";

export default function MapCalculator() {
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [result, setResult] = useState("");
  const [formula, setFormula] = useState("");

  function calculateMAP() {
    let sbpVal = parseFloat(sbp);
    let dbpVal = parseFloat(dbp);

    if (
      isNaN(sbpVal) ||
      isNaN(dbpVal) ||
      sbpVal <= 0 ||
      dbpVal <= 0 ||
      sbpVal < dbpVal
    ) {
      setResult("Please enter valid SBP and DBP values.");
      setFormula("");
      return;
    }

    let map = dbpVal + (sbpVal - dbpVal) / 3;
    let category = "";

    if (map < 70) {
      category = "Low MAP - May indicate poor perfusion";
    } else if (map <= 100) {
      category = "Normal MAP";
    } else {
      category = "High MAP - May indicate hypertension risk";
    }

    setFormula(`Formula: MAP = DBP + (SBP - DBP) / 3`);
    setResult(`Mean Arterial Pressure (MAP): ${map.toFixed(2)} mmHg — ${category}`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">MAP Calculator</h2>

      <div className="mb-2">
        <label className="block mb-1">Systolic BP (mmHg):</label>
        <input
          type="number"
          value={sbp}
          onChange={(e) => setSbp(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Diastolic BP (mmHg):</label>
        <input
          type="number"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <button
        onClick={calculateMAP}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {formula && <p className="mt-3 text-sm italic">{formula}</p>}
      {result && <p className="mt-2 font-medium">{result}</p>}
    </div>
  );
}
