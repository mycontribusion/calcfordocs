import { useEffect } from "react";
import { useCalc, WeightField, ResetButton, SelectField, FormulaBox } from "./CalcFields";
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
      conversionNote = `Converted PCV to Hb: Observed Hb = ${observed.toFixed(1)} g/dL, Target Hb = ${target.toFixed(1)} g/dL`;
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
      <FormulaBox title="Pediatric Blood Transfusion Formula & Factors">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formula:</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>
          Vol (mL) = Weight (kg) × (Target Hb − Observed Hb) × Factor
        </p>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Multiplication Factors by Product:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>Whole Blood:</strong> Factor = 6</li>
          <li><strong>Sedimented Red Cells:</strong> Factor = 4</li>
          <li><strong>Packed Red Blood Cells (PRBCs):</strong> Factor = 3</li>
          <li><strong>Custom Product PCV:</strong> Factor = 3 ÷ (PCV % ÷ 100)</li>
        </ul>
        <p style={{ margin: "6px 0 0", fontSize: '0.73rem', opacity: 0.75 }}>Note: Hb (g/dL) ≈ PCV (%) ÷ 3. PRBC rate is typically 10–15 mL/kg over 2–4 hours.</p>
      </FormulaBox>

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
        <div className="calc-result" style={{ marginTop: 16 }}>
          {values.result.error ? <p style={{ color: 'red' }}>{values.result.error}</p> : <><p style={{ fontSize: '1.2rem', color: '#0056b3' }}>{values.result.volume}</p>{values.result.note && <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 8 }}>{values.result.note}</p>}<p style={{ fontSize: '0.9rem', color: '#555', marginTop: 4 }}>{values.result.formula}</p><p style={{ fontSize: '0.9rem', color: '#555' }}>Factor used: {values.result.factorUsed}</p></>}
        </div>
      )}
    </div>
  );
}
