// src/calculators/AnionGapDeltaRatio.js
import { useState } from "react";

export default function AnionGapDeltaRatio() {
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState("");
  const [chloride, setChloride] = useState("");
  const [bicarbonate, setBicarbonate] = useState("");
  const [result, setResult] = useState("");

  function calculateAGandDelta() {
    const na = parseFloat(sodium);
    const k = parseFloat(potassium);
    const cl = parseFloat(chloride);
    const hco3 = parseFloat(bicarbonate);

    if ([na, k, cl, hco3].some((v) => isNaN(v))) {
      setResult("Please enter valid numerical values for all fields.");
      return;
    }

    // Calculate Anion Gap: AG = (Na + K) - (Cl + HCO3)
    const ag = na + k - (cl + hco3);

    // ΔGap = AG - 12 (normal AG)
    const deltaGap = ag - 12;

    // ΔRatio = ΔGap / (24 - HCO3)
    const deltaRatio = deltaGap / (24 - hco3);

    // Interpretation
    let interpretation = "";
    if (deltaRatio < 0.4) {
      interpretation =
        "Mixed disorder: high AG metabolic acidosis + normal AG acidosis";
    } else if (deltaRatio > 2) {
      interpretation =
        "Mixed disorder: high AG metabolic acidosis + metabolic alkalosis or pre-existing high HCO₃⁻";
    } else {
      interpretation = "Primary high AG metabolic acidosis";
    }

    setResult(
      `Anion Gap: ${ag.toFixed(2)} | ΔGap: ${deltaGap.toFixed(
        2
      )} | ΔRatio: ${deltaRatio.toFixed(2)} → ${interpretation}`
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">
        Anion Gap & Delta Gap / Delta Ratio Calculator
      </h2>

      <div className="mb-2"><p></p>
        <label className="mr-2">Sodium (Na⁺, mmol/L):</label><br />
        <input
          type="number"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 140"
        />
      </div>

      <div className="mb-2"><p></p>
        <label className="mr-2">Potassium (K⁺, mmol/L):</label><br />
        <input
          type="number"
          value={potassium}
          onChange={(e) => setPotassium(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 4.0"
        />
      </div>

      <div className="mb-2"><p></p>
        <label className="mr-2">Chloride (Cl⁻, mmol/L):</label><br />
        <input
          type="number"
          value={chloride}
          onChange={(e) => setChloride(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 100"
        />
      </div>

      <div className="mb-2"><p></p>
        <label className="mr-2">Bicarbonate (HCO₃⁻, mmol/L):</label><br />
        <input
          type="number"
          value={bicarbonate}
          onChange={(e) => setBicarbonate(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g., 18"
        />
      </div><p></p>

      <button
        onClick={calculateAGandDelta}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
    </div>
  );
}
