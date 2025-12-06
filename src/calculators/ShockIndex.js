// src/calculators/ShockIndex.js
import { useState } from "react";

export default function ShockIndex() {
  const [heartRate, setHeartRate] = useState("");
  const [systolicBP, setSystolicBP] = useState("");
  const [result, setResult] = useState("");

  function calculateSI() {
    const hr = parseFloat(heartRate);
    const sbp = parseFloat(systolicBP);

    if (isNaN(hr) || hr <= 0 || isNaN(sbp) || sbp <= 0) {
      setResult("Please enter valid Heart Rate and Systolic BP values.");
      return;
    }

    const si = hr / sbp;
    let interpretation = "";

    if (si < 0.5) {
      interpretation = "Below normal – may indicate bradycardia or high BP";
    } else if (si >= 0.5 && si <= 0.7) {
      interpretation = "Normal Shock Index";
    } else if (si > 0.7 && si < 1) {
      interpretation = "Borderline – monitor patient closely";
    } else {
      interpretation = "High Shock Index – suggestive of shock or severe instability";
    }

    setResult(`Shock Index: ${si.toFixed(2)} → ${interpretation}`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Shock Index Calculator</h2>

      {/* Heart Rate */}
      <div className="mb-2">
        <label className="mr-2">Heart Rate (bpm):</label><br />
        <input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="e.g., 80"
          className="border px-2 py-1 rounded w-full"
        />
        <p></p>
      </div>

      {/* Systolic BP */}
      <div className="mb-2">
        <label className="mr-2">Systolic BP (mmHg):</label><br />
        <input
          type="number"
          value={systolicBP}
          onChange={(e) => setSystolicBP(e.target.value)}
          placeholder="e.g., 120"
          className="border px-2 py-1 rounded w-full"
        />
      </div><p></p>

      {/* Calculate Button */}
      <button
        onClick={calculateSI}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        Calculate
      </button>

      {/* Result */}
      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
    </div>
  );
}
