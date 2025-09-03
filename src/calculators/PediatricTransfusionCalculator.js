import { useState } from "react";

export default function PediatricTransfusionCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedHb, setObservedHb] = useState("");
  const [targetHb, setTargetHb] = useState("10");
  const [result, setResult] = useState("");

  const validatePositiveNumber = (n) => {
    const x = Number(n);
    return Number.isFinite(x) && x > 0;
  };

  const calculateTransfusion = () => {
    if (!validatePositiveNumber(weight) || !validatePositiveNumber(observedHb)) {
      setResult("⚠️ Please enter valid positive numbers for weight and Hb.");
      return;
    }

    let weightKg =
      weightUnit === "lb" ? Number(weight) * 0.453592 : Number(weight);

    const observed = Number(observedHb);
    const desired = Number(targetHb);

    if (desired <= observed) {
      setResult("✅ No transfusion needed (target Hb already achieved).");
      return;
    }

    const deltaHb = desired - observed;
    const volume = deltaHb * weightKg * 3; // mL of PRBC

    setResult(
      `Transfusion Volume: ${volume.toFixed(
        0
      )} mL of packed red cells (≈ ${deltaHb} g/dL × ${weightKg.toFixed(
        1
      )} kg × 3 mL/kg).`
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">
        Pediatric Blood Transfusion (Anemia)
      </h2>

      <label className="block mb-2">
        Weight:
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </label>

      <label className="block mb-2">
        Unit:
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </label>

      <label className="block mb-2">
        Observed Hb (g/dL):
        <input
          type="number"
          min="1"
          step="0.1"
          value={observedHb}
          onChange={(e) => setObservedHb(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </label>

      <label className="block mb-2">
        Target Hb (g/dL):
        <input
          type="number"
          min="1"
          step="0.1"
          value={targetHb}
          onChange={(e) => setTargetHb(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </label>

      <button
        onClick={calculateTransfusion}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Calculate
      </button>

      {result && <p className="mt-3 font-semibold">{result}</p>}

      <p className="mt-4 text-sm text-gray-600">
        ⚠️ Note: Usual transfusion volume in pediatrics is{" "}
        <strong>10–15 mL/kg PRBC over 3–4 hours</strong>.  
        Monitor vitals and avoid fluid overload.
      </p>
    </div>
  );
}
