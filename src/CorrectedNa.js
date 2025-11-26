// src/calculators/CorrectedSodium.js
import { useState } from "react";

export default function CorrectedSodium() {
  const [sodium, setSodium] = useState("");
  const [glucose, setGlucose] = useState("");
  const [result, setResult] = useState("");

  function calculateCorrectedNa() {
    const na = parseFloat(sodium);
    const glu = parseFloat(glucose);

    if (isNaN(na) || isNaN(glu)) {
      setResult("Please enter valid numerical values for both sodium and glucose.");
      return;
    }

    // Corrected Sodium formula (mg/dL glucose)
    // 1.6 mEq/L increase per 100 mg/dL glucose above 100
    const correctedNa = na + 1.6 * ((glu - 100) / 100);

    setResult(`Corrected Sodium: ${correctedNa.toFixed(2)} mEq/L`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Corrected Sodium Calculator</h2>

      <div className="mb-2">
        <label className="mr-2">Measured Sodium (mEq/L):</label>
        <input
          type="number"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 135"
        />
      </div>

      <div className="mb-2">
        <label className="mr-2">Blood Glucose (mg/dL):</label>
        <input
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 300"
        />
      </div>

      <button
        onClick={calculateCorrectedNa}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
    </div>
  );
}
