import React, { useEffect } from "react";
import { useCalc, CalcBox, NumberField, WeightField, HeightField, ResetButton, ResultBox, SyncSuggestion, SelectField } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
  sodium: "",
  weight: "",
  weightUnit: "kg",
  sex: "male",
  age: "",
  ageGroup: "nonelderly",
  volumeStatus: "hypovolemic",
  targetRise: "6",
  fluid: "ns",
  result: null,
  warning: "",
};

export default function HyponatremiaCorrection() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);
  const getInfusateNa = (fluidType) => ({ ns: 154, hts: 513, rl: 130 }[fluidType] || 0);

  useEffect(() => {
    const na = parseFloat(values.sodium);
    const weightKg = toKg(values.weight, values.weightUnit);
    const target = parseFloat(values.targetRise);

    // Auto-set ageGroup based on global age
    if (values.age) {
      const ageVal = parseFloat(values.age);
      if (!isNaN(ageVal)) {
        updateFields({ ageGroup: ageVal >= 65 ? "elderly" : "nonelderly" });
      }
    }

    if (isNaN(na) || isNaN(weightKg) || isNaN(target)) {
      if (values.result !== null || values.warning !== "") updateFields({ result: null, warning: "" });
      return;
    }

    let warn = "";
    if (na >= 135) {
      updateFields({ warning: "✅ Serum sodium is within normal range (≥ 135 mmol/L). This tool is for hyponatremia only.", result: null });
      return;
    }
    if (values.volumeStatus !== "hypovolemic" && values.fluid === "ns") warn = "⚠️ NS may worsen hyponatremia in euvolemic/hypervolemic states.";
    else warn = "Aim for ≤8 mmol/L rise in 24h. Avoid rapid correction.";

    if (target > 8) { updateFields({ warning: "⚠️ Target correction exceeds safe limit (≤8 mmol/L).", result: null }); return; }

    let tbwFactor = values.sex === "male" ? (values.ageGroup === "nonelderly" ? 0.6 : 0.5) : (values.ageGroup === "nonelderly" ? 0.5 : 0.45);
    const tbw = weightKg * tbwFactor;
    const deltaPerLiter = (getInfusateNa(values.fluid) - na) / (tbw + 1);

    if (deltaPerLiter <= 0) { updateFields({ warning: "⚠️ Selected fluid will not raise serum sodium.", result: null }); return; }

    const totalLiters = target / deltaPerLiter;
    const hourlyRate = (totalLiters * 1000) / 24;

    updateFields({
      result: { tbw: tbw.toFixed(1), deltaPerLiter: deltaPerLiter.toFixed(2), totalLiters: totalLiters.toFixed(2), hourlyRate: hourlyRate.toFixed(0) },
      warning: warn
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.weight, values.ageGroup, values.sex, values.fluid, values.volumeStatus, values.targetRise, values.age]);

  return (
    <div className="calc-container">
      <div style={{ display: "flex", gap: "8px" }}>
        <NumberField label="Serum Na (mmol/L)" field="sodium" values={values} setField={setField} suggestions={suggestions} syncField={syncField} style={{ flex: 1 }} />
        <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} style={{ flex: 1 }} />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <SelectField label="Sex" field="sex" values={values} setField={setField} options={[{value:"male",label:"Male"}, {value:"female",label:"Female"}]} style={{ flex: 1 }} />
        <SelectField label="Age Group" field="ageGroup" values={values} setField={setField} options={[{value:"nonelderly",label:"Non-elderly"}, {value:"elderly",label:"Elderly"}]} style={{ flex: 1 }} />
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <SelectField label="Volume Status" field="volumeStatus" values={values} setField={setField} options={[{value:"hypovolemic",label:"Hypovolemic"}, {value:"euvolemic",label:"Euvolemic (SIADH)"}, {value:"hypervolemic",label:"Hypervolemic"}]} style={{ flex: 1 }} />
        <SelectField label="Infusate" field="fluid" values={values} setField={setField} options={[{value:"ns",label:"0.9% NS"}, {value:"hts",label:"3% HTS"}, {value:"rl",label:"RL"}]} style={{ flex: 1 }} />
      </div>
      <NumberField label="Target Rise (mmol/24h)" field="targetRise" values={values} setField={setField} />
      <ResetButton onClick={reset} />
      {values.warning && <p className="calc-result" style={{ color: "darkred" }}>{values.warning}</p>}
      <ResultBox show={!!values.result}>
        {values.result && (
          <>
            <p><strong>ΔNa per 1 L:</strong> +{values.result.deltaPerLiter} mmol/L</p>
            <p><strong>Total Volume Needed:</strong> {values.result.totalLiters} L</p>
            <p><strong>Estimated Rate:</strong> {values.result.hourlyRate} mL/hr</p>
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
              <span style={{ opacity: 0.7 }}>Adrogue-Madias: ΔNa = (Infusate Na – Serum Na) / (TBW + 1)</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
                <li>⚠️ Max correction: ≤8–10 mmol/L per 24h</li>
                <li>⚠️ Rapid correction risks Osmotic Demyelination Syndrome (ODS)</li>
              </ul>
            </div>
          </>
        )}
      </ResultBox>
    </div>
  );
}
