import { useState, useEffect } from "react";
import "./CalculatorShared.css";

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
    <div className="calc-container">
      <h2 className="calc-title">Pediatric Transfusion Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="calc-select">
          <option value="pcv">PCV</option>
          <option value="hb">Hb</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">Observed {method.toUpperCase()}:</label>
        <input
          type="number"
          value={observedValue}
          onChange={(e) => setObservedValue(e.target.value)}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Target {method.toUpperCase()}:</label>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Blood type / Product:</label>
        <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="calc-select">
          <option value="whole">Whole blood (factor 6)</option>
          <option value="sedimented">Sedimented (factor 4)</option>
          <option value="packed">Packed cells (factor 3)</option>
          <option value="custom">Custom / Factor from PCV</option>
        </select>
      </div>

      {bloodType === "custom" && (
        <div className="calc-box">
          <label className="calc-label">Enter PCV of donated blood (%):</label>
          <input
            type="number"
            value={customPCV}
            onChange={(e) => setCustomPCV(e.target.value)}
            className="calc-input"
          />
        </div>
      )}

      <button onClick={reset} className="calc-btn-reset">Reset</button>

      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <p style={{ fontSize: '1.2rem', color: '#0056b3' }}>{result.volume}</p>
              {result.note && <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 8 }}>{result.note}</p>}
              <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 4 }}>{result.formula}</p>
              <p style={{ fontSize: '0.9rem', color: '#555' }}>Factor used: {result.factorUsed}</p>
            </>
          )}
        </div>
      )}

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: 12, padding: 8, background: '#f9f9f9', borderRadius: 6 }}>
        Factor is automatically set according to blood type: Whole blood = 6, Sedimented = 4, Packed cells = 3. Custom factor is calculated from PCV if selected.
      </p>
    </div>
  );
}
