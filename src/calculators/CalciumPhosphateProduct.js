// src/calculators/CalciumPhosphateProduct.js
import { useState } from "react";

export default function CalciumPhosphateProduct() {
  const [calcium, setCalcium] = useState("");
  const [phosphate, setPhosphate] = useState("");
  const [caUnit, setCaUnit] = useState("mmol"); // default mmol/L
  const [phUnit, setPhUnit] = useState("mmol"); // default mmol/L
  const [result, setResult] = useState("");

  // Conversion factors
  const caConv = 0.2495; // 1 mg/dL → mmol/L
  const phConv = 0.3229; // 1 mg/dL → mmol/L

  function convertToMgDL(value, type, unit) {
    if (unit === "mmol") {
      return type === "calcium" ? value / caConv : value / phConv;
    }
    return value; // already in mg/dL
  }

  function interpretCaP() {
    const caVal = parseFloat(calcium);
    const phVal = parseFloat(phosphate);

    if (isNaN(caVal) || isNaN(phVal) || caVal <= 0 || phVal <= 0) {
      setResult("Please enter valid numerical values.");
      return;
    }

    // Convert both to mg/dL for calculation
    const caMg = convertToMgDL(caVal, "calcium", caUnit);
    const phMg = convertToMgDL(phVal, "phosphate", phUnit);

    const product = caMg * phMg;

    let interpretation = "";
    if (product < 55) {
      interpretation = "Low risk of vascular calcification";
    } else if (product <= 70) {
      interpretation = "Moderate risk of vascular calcification";
    } else {
      interpretation = "High risk of vascular calcification";
    }

    setResult(
      `Ca × P Product: ${product.toFixed(2)} mg²/dL² → ${interpretation}`
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Calcium-Phosphate Product Calculator</h2>

      {/* Calcium input */}
      <div className="mb-2">
        <label className="mr-2">Serum Calcium: <br /></label>
        <input
          type="number"
          placeholder="Enter Calcium"
          value={calcium}
          onChange={(e) => setCalcium(e.target.value)}
          className="border px-2 py-1 rounded w-full mb-1"
        />
        <select
          value={caUnit}
          onChange={(e) => setCaUnit(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="mmol">mmol/L</option>
          <option value="mg">mg/dL</option>
        </select>
      </div>

      {/* Phosphate input */}
      <div className="mb-2"><p></p>
        <label className="mr-2">Serum Phosphate:</label><br />
        <input
          type="number"
          placeholder="Enter Phosphate"
          value={phosphate}
          onChange={(e) => setPhosphate(e.target.value)}
          className="border px-2 py-1 rounded w-full mb-1"
        />
        <select
          value={phUnit}
          onChange={(e) => setPhUnit(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="mmol">mmol/L</option>
          <option value="mg">mg/dL</option>
        </select>
      </div>

      {/* Calculate button */}
      <div className="mb-2"><p></p>
        <button
          onClick={interpretCaP}
          className="bg-blue-500 text-white px-3 py-1 rounded w-full"
        >
          Calculate
        </button>
      </div>

      {/* Result */}
      {result && <p className="mt-2 text-sm font-medium">{result}</p>}

      {/* Formula */}
      <div className="mt-4 text-sm">
        <p><strong>Formula:</strong> Ca × P = Serum Calcium × Serum Phosphate</p>
        <p><strong>Units:</strong> mg/dL × mg/dL → mg²/dL²</p>
      </div>
    </div>
  );
}
