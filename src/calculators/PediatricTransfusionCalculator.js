import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  observedValue: "",
  targetValue: "",
  method: "pcv", // pcv or hb
  bloodType: "whole", // whole, sedimented, packed, custom
  customPCV: "",
  useFactor: true,
  result: null,
};

export default function PediatricTransfusionCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const w = values.weightUnit === "lb" ? Number(values.weight) * 0.453592 : Number(values.weight);
    let observed = Number(values.observedValue);
    let target = Number(values.targetValue);

    let factor = null;
    if (values.useFactor) {
      switch (values.bloodType) {
        case "whole": factor = 6; break;
        case "sedimented": factor = 4; break;
        case "packed": factor = 3; break;
        case "custom":
          const pcvFraction = Number(values.customPCV) / 100;
          if (pcvFraction && pcvFraction > 0) factor = 3 / pcvFraction;
          break;
        default: factor = 3;
      }
    }

    if (!w || !observed || !target || target <= observed || (values.useFactor && factor === null)) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    let conversionNote = "";
    if (values.method === "pcv") {
      observed = observed / 3;
      target = target / 3;
      conversionNote = `Converted PCV to Hb: Observed Hb = ${observed.toFixed(1)}, Target Hb = ${target.toFixed(1)}`;
    }

    const transfusionVolume = w * (target - observed) * (factor ?? 1);
    updateFields({
      result: {
        volume: `Transfusion Volume: ${transfusionVolume.toFixed(0)} mL`,
        note: conversionNote,
        formula: "Transfusion Volume = Weight (kg) × (Target Hb – Observed Hb) × Factor",
        factorUsed: factor,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.weight, values.weightUnit, values.observedValue, values.targetValue, values.method, values.bloodType, values.customPCV, values.useFactor]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Weight:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.weight} onChange={(e) => setField("weight", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.weightUnit} onChange={(e) => setField("weightUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="kg">kg</option><option value="lb">lb</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Method:</label>
        <select value={values.method} onChange={(e) => setField("method", e.target.value)} className="calc-select"><option value="pcv">PCV</option><option value="hb">Hb</option></select>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "48%" }} className="calc-box"><label className="calc-label">Observed {values.method.toUpperCase()}:</label><input type="number" value={values.observedValue} onChange={(e) => setField("observedValue", e.target.value)} className="calc-input" /></div>
        <div style={{ width: "48%" }} className="calc-box"><label className="calc-label">Target {values.method.toUpperCase()}:</label><input type="number" value={values.targetValue} onChange={(e) => setField("targetValue", e.target.value)} className="calc-input" /></div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Blood type / Product:</label>
        <select value={values.bloodType} onChange={(e) => setField("bloodType", e.target.value)} className="calc-select"><option value="whole">Whole blood (factor 6)</option><option value="sedimented">Sedimented (factor 4)</option><option value="packed">Packed cells (factor 3)</option><option value="custom">Custom / Factor from PCV</option></select>
      </div>
      {values.bloodType === "custom" && (
        <div className="calc-box"><label className="calc-label">Enter PCV of donated blood (%):</label><input type="number" value={values.customPCV} onChange={(e) => setField("customPCV", e.target.value)} className="calc-input" /></div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result">
          {values.result.error ? <p style={{ color: 'red' }}>{values.result.error}</p> : <><p style={{ fontSize: '1.2rem', color: '#0056b3' }}>{values.result.volume}</p>{values.result.note && <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 8 }}>{values.result.note}</p>}<p style={{ fontSize: '0.9rem', color: '#555', marginTop: 4 }}>{values.result.formula}</p><p style={{ fontSize: '0.9rem', color: '#555' }}>Factor used: {values.result.factorUsed}</p></>}
        </div>
      )}
    </div>
  );
}
