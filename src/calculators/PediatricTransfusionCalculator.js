import { useEffect } from "react";
import { useCalc, CalcBox, NumberField, WeightField, HeightField, ResetButton, ResultBox, SelectField, SyncSuggestion } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

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
  // Global Sync Keys
  age: "",
  sex: "male",
};

export default function PediatricTransfusionCalculator() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const w = toKg(values.weight, values.weightUnit);
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
      <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <SelectField label="Method:" field="method" values={values} setField={setField} options={[{ value: "pcv", label: "PCV" }, { value: "hb", label: "Hb" }]} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "48%" }} className="calc-box">
          <label className="calc-label">Observed {values.method.toUpperCase()}:</label>
          <input type="number" value={values.observedValue} onChange={(e) => setField("observedValue", e.target.value)} className="calc-input" />
        </div>
        <div style={{ width: "48%" }} className="calc-box">
          <label className="calc-label">Target {values.method.toUpperCase()}:</label>
          <input type="number" value={values.targetValue} onChange={(e) => setField("targetValue", e.target.value)} className="calc-input" />
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Blood type / Product:</label>
        <select value={values.bloodType} onChange={(e) => setField("bloodType", e.target.value)} className="calc-select">
          <option value="whole">Whole blood (factor 6)</option>
          <option value="sedimented">Sedimented (factor 4)</option>
          <option value="packed">Packed cells (factor 3)</option>
          <option value="custom">Custom / Factor from PCV</option>
        </select>
      </div>
      {values.bloodType === "custom" && (
        <div className="calc-box">
          <label className="calc-label">Enter PCV of donated blood (%):</label>
          <input type="number" value={values.customPCV} onChange={(e) => setField("customPCV", e.target.value)} className="calc-input" />
        </div>
      )}
      <ResetButton onClick={reset} />
      {values.result && (
        <div className="calc-result">
          {values.result.error ? <p style={{ color: 'red' }}>{values.result.error}</p> : <><p style={{ fontSize: '1.2rem', color: '#0056b3' }}>{values.result.volume}</p>{values.result.note && <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 8 }}>{values.result.note}</p>}<p style={{ fontSize: '0.9rem', color: '#555', marginTop: 4 }}>{values.result.formula}</p><p style={{ fontSize: '0.9rem', color: '#555' }}>Factor used: {values.result.factorUsed}</p></>}
        </div>
      )}
    </div>
  );
}
