import React, { useEffect } from "react";
import { useCalc, NumberField, WeightField, ResetButton, ResultBox, SelectField } from "./CalcFields";
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

      {/* Row 1: Serum Na + Weight */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <NumberField label="Serum Na (mmol/L)" field="sodium" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
        <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      </div>

      {/* Row 2: Sex + Age Group */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <SelectField label="Sex" field="sex" values={values} setField={setField} options={[{value:"male",label:"Male"}, {value:"female",label:"Female"}]} />
        <SelectField label="Age Group" field="ageGroup" values={values} setField={setField} options={[{value:"nonelderly",label:"Non-elderly"}, {value:"elderly",label:"Elderly (≥65)"}]} />
      </div>

      {/* Row 3: Volume Status */}
      <SelectField label="Volume Status" field="volumeStatus" values={values} setField={setField}
        options={[
          {value:"hypovolemic", label:"Hypovolemic"},
          {value:"euvolemic",   label:"Euvolemic (SIADH)"},
          {value:"hypervolemic",label:"Hypervolemic"},
        ]}
      />

      {/* Row 4: Infusate + Target Rise */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <SelectField label="Infusate Fluid" field="fluid" values={values} setField={setField}
          options={[{value:"ns",label:"0.9% NS (154 mEq)"}, {value:"hts",label:"3% HTS (513 mEq)"}, {value:"rl",label:"Ringer's Lactate"}]}
        />
        <NumberField label="Target rise (mmol/24h)" field="targetRise" values={values} setField={setField} placeholder="e.g. 6" />
      </div>

      <ResetButton onClick={reset} />

      {/* Warning */}
      {values.warning && (
        <div style={{
          marginTop: 8,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'var(--status-warning-bg, #fff8e1)',
          border: '1px solid var(--status-warning, #f59e0b)',
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          lineHeight: 1.5,
        }}>
          {values.warning}
        </div>
      )}

      {/* Result */}
      <ResultBox show={!!values.result}>
        {values.result && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>ΔNa per 1 L infusate</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>+{values.result.deltaPerLiter} mmol/L</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>Total volume needed</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.result.totalLiters} L</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>Infusion rate</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.result.hourlyRate} mL/hr</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>TBW estimate</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.result.tbw} L</p>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 10 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.6, marginBottom: 4 }}>Adrogue–Madias Equation:</p>
              <div style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', opacity: 0.85, display: 'inline-block' }}>
                  ΔNa = (Infusate Na − Serum Na) ÷ (TBW + 1)
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: '0.78rem', opacity: 0.75 }}>
                <li>⚠️ Max safe rise: ≤8–10 mmol/L per 24h</li>
                <li>⚠️ Rapid correction risks Osmotic Demyelination Syndrome (ODS)</li>
              </ul>
            </div>
          </>
        )}
      </ResultBox>
    </div>
  );
}
