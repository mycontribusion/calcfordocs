import { useState, useEffect } from "react";

export default function PediatricTransfusionCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedValue, setObservedValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [method, setMethod] = useState("pcv"); // pcv or hb
  const [bloodType, setBloodType] = useState("whole"); // whole, sedimented, packed, custom
  const [customPCV, setCustomPCV] = useState(""); // only if custom
  const [useFactor, setUseFactor] = useState(true);
  const [result, setResult] = useState(null);

  const formulaUsed = "Transfusion Volume = Weight (kg) × (Target Hb – Observed Hb) × Factor";

  const getFactor = () => {
    if (!useFactor) return null;
    switch (bloodType) {
      case "whole":
        return 6;
      case "sedimented":
        return 4;
      case "packed":
        return 3;
      case "custom":
        const pcvFraction = Number(customPCV) / 100;
        if (!pcvFraction || pcvFraction <= 0) return null;
        return 3 / pcvFraction;
      default:
        return 3;
    }
  };

  const calculateTransfusion = () => {
    const w = weightUnit === "lb" ? Number(weight) * 0.453592 : Number(weight);
    let observed = Number(observedValue);
    let target = Number(targetValue);
    const factor = getFactor();

    if (!w || !observed || !target || target <= observed || (useFactor && factor === null)) {
      setResult({ error: "⚠️ Please enter valid inputs." });
      return;
    }

    let conversionNote = "";

    if (method === "pcv") {
      observed = observed / 3;
      target = target / 3;
      conversionNote = `Converted PCV to Hb: Observed Hb = ${observed.toFixed(
        1
      )}, Target Hb = ${target.toFixed(1)}`;
    }

    const transfusionVolume = w * (target - observed) * (factor ?? 1);

    setResult({
      volume: `Transfusion Volume: ${transfusionVolume.toFixed(0)} mL`,
      note: conversionNote,
      formula: formulaUsed,
      factorUsed: factor,
    });
  };

  // Auto-calculate
  useEffect(() => {
    if (weight && observedValue && targetValue && useFactor) {
      calculateTransfusion();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, weightUnit, observedValue, targetValue, method, bloodType, customPCV, useFactor]);

  const reset = () => {
    setWeight("");
    setWeightUnit("kg");
    setObservedValue("");
    setTargetValue("");
    setMethod("pcv");
    setBloodType("packed");
    setCustomPCV("");
    setUseFactor(true);
    setResult(null);
  };

  return (
    <div>
      <h2>Pediatric Transfusion Calculator</h2>

      <label>
        Weight:
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </label>
      <label>
        <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </label>
      <p></p>

      <label>
        Method:
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="pcv">PCV</option>
          <option value="hb">Hb</option>
        </select>
      </label>
      <p></p>

      <label>
        Observed {method.toUpperCase()}:
        <input type="number" value={observedValue} onChange={(e) => setObservedValue(e.target.value)} />
      </label>
      <p></p>

      <label>
        Target {method.toUpperCase()}:
        <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} />
      </label>
      <p></p>

      <label>
        Blood type / Product:
        <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
          <option value="whole">Whole blood (factor 6)</option>
          <option value="sedimented">Sedimented (factor 4)</option>
          <option value="packed">Packed cells (factor 3)</option>
          <option value="custom">Custom / Factor from PCV</option>
        </select>
      </label>
      <p></p>

      {bloodType === "custom" && (
        <>
          <label>
            Enter PCV of donated blood (%):
            <input type="number" value={customPCV} onChange={(e) => setCustomPCV(e.target.value)} />
          </label>
          <p></p>
        </>
      )}
      <p></p>

      <button onClick={reset}>Reset</button>
      <p></p>

      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>{result.volume}</p>
              {result.note && <p>{result.note}</p>}
              <p>{result.formula}</p>
              <p>Factor used: {result.factorUsed}</p>
            </>
          )}
        </div>
      )}

      <p style={{ fontSize: "0.9em", color: "gray" }}>
        Factor is automatically set according to blood type: Whole blood = 6, Sedimented = 4, Packed cells = 3. Custom factor is calculated from PCV if selected.
      </p>
    </div>
  );
}
