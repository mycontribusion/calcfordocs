// src/calculators/HypokalemiaCorrection.js
import { useState } from "react";

export default function HypokalemiaCorrection() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedK, setObservedK] = useState("");
  const [desiredK, setDesiredK] = useState("4.0");
  const [result, setResult] = useState("");
  const [interpretation, setInterpretation] = useState("");

  function calculateHypokalemia() {
    let weightKg = parseFloat(weight);
    let currentK = parseFloat(observedK);
    let targetK = parseFloat(desiredK);

    if (isNaN(currentK) || currentK <= 0) {
      setResult("⚠️ Please enter a valid observed serum K⁺.");
      setInterpretation("");
      return;
    }

    // Normal range → no correction
    if (currentK >= 3.5 && currentK <= 5.5) {
      setInterpretation({ text: "🟢 Normal (No correction needed)", class: "text-green-600" });
      setResult("✅ Serum potassium is within normal range (3.5–5.5 mmol/L). No supplementation required.");
      return;
    }

    // Hyperkalemia → stop
    if (currentK > 5.5) {
      setInterpretation({ text: "🔴 Hyperkalemia", class: "text-red-600" });
      setResult("⚠️ Serum K⁺ is above 5.5 mmol/L. This tool is for hypokalemia only. Do NOT correct. Manage hyperkalemia accordingly.");
      return;
    }

    // Hypokalemia case
    if (isNaN(weightKg) || weightKg <= 0 || isNaN(targetK) || targetK <= currentK) {
      setResult("⚠️ Please enter valid weight and target K⁺ > observed.");
      setInterpretation("");
      return;
    }

    if (weightUnit === "lb") {
      weightKg = weightKg * 0.453592;
    }

    // Formula: (Desired - Observed) × weight(kg) × 0.4
    const deficit = (targetK - currentK) * weightKg * 0.4;

    // Safe daily max check
    let warning = "";
    if (deficit > 120) {
      warning =
        "\n⚠️ Deficit exceeds safe daily max (120 mEq). Correction must be spread over several days.";
    }

    setInterpretation({ text: "🔴 Hypokalemia (Correction needed)", class: "text-red-600" });

    setResult(
      `💊 Estimated Potassium Deficit: ${deficit.toFixed(0)} mEq KCl required.${warning}

📌 Normal serum K⁺ range: 3.5 – 5.5 mmol/L

⚠️ Safety Notes:
- Patient must have adequate urine output:
   • >0.5 mL/kg/hr
   • ~30 mL/hr in adults
   • ~720 mL/day
- Oral route preferred for mild hypokalemia.
- **Max daily dose:** 120 mEq/day
- **Max infusion rate:** 
   • 10 mEq/hr (peripheral)
   • 20 mEq/hr (central with ECG monitoring)
- **Max concentration:** 
   • 40 mEq/L (peripheral)
   • 60–80 mEq/L (central, ICU only)
- Always recheck serum K⁺ after partial replacement.
- Use cautiously in renal impairment.`
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Hypokalemia Correction Calculator</h2>

      {/* Weight Input */}
      <div className="mb-2">
        <label className="block mb-1">Weight:</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      {/* Observed Potassium Input */}
      <div className="mb-2">
        <label className="block mb-1">Observed Serum K⁺ (mmol/L):</label>
        <input
          type="number"
          step="0.1"
          value={observedK}
          onChange={(e) => setObservedK(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {/* Desired Potassium Input */}
      <div className="mb-2">
        <label className="block mb-1">Target Serum K⁺ (mmol/L):</label>
        <input
          type="number"
          step="0.1"
          value={desiredK}
          onChange={(e) => setDesiredK(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <small className="text-gray-600">
          Default is 4.0 mmol/L, but you can adjust.
        </small>
      </div>

      <button
        onClick={calculateHypokalemia}
        className="bg-orange-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {interpretation && (
        <p className={`mt-3 font-bold ${interpretation.class}`}>
          {interpretation.text}
        </p>
      )}

      {result && (
        <pre className="mt-3 font-medium whitespace-pre-line">{result}</pre>
      )}
    </div>
  );
}
