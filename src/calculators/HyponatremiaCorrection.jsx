import React, { useEffect } from "react";
import { useCalc, NumberField, WeightField, ResetButton, ResultBox, SelectField, FormulaBox, CheckboxField } from "./CalcFields";
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
  // Symptomatic Hyponatremia mode
  symptomatic: false,
  symptomaticAgeGroup: "adult",
  symptomaticWeight: "50",
  bolusResult: null,
};

export default function HyponatremiaCorrection() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);
  const getInfusateNa = (fluidType) => ({ ns: 154, hts: 513, rl: 130 }[fluidType] || 0);

  // ─── Symptomatic mode: enforce weight rules ───
  // Adult locks weight at 50 kg; Child caps at 50 kg.
  // Runs whenever age group, weight, or symptomatic flag changes.
  useEffect(() => {
    if (!values.symptomatic) return;

    let nextWeight = values.symptomaticWeight;
    let changed = false;

    if (values.symptomaticAgeGroup === "adult") {
      if (nextWeight !== "50") {
        nextWeight = "50";
        changed = true;
      }
    } else if (values.symptomaticAgeGroup === "child") {
      const w = parseFloat(nextWeight);
      if (!isNaN(w) && w > 50) {
        nextWeight = "50";
        changed = true;
      }
    }

    if (changed) {
      updateFields({ symptomaticWeight: nextWeight });
    }
  }, [values.symptomaticAgeGroup, values.symptomaticWeight, values.symptomatic, updateFields]);

  // ─── Standard Adrogue–Madias calculation (disabled when symptomatic) ───
  useEffect(() => {
    if (values.symptomatic) {
      if (values.result !== null || values.warning !== "") {
        updateFields({ result: null, warning: "" });
      }
      return;
    }

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
  }, [values.sodium, values.weight, values.ageGroup, values.sex, values.fluid, values.volumeStatus, values.targetRise, values.age, values.symptomatic, updateFields]);

  // ─── Symptomatic 3% HTS bolus calculation ───
  // Dose = Weight (kg) × 3 mL, max 150 mL, over 20 minutes.
  useEffect(() => {
    if (!values.symptomatic) {
      if (values.bolusResult !== null) updateFields({ bolusResult: null });
      return;
    }

    const weightKg = parseFloat(values.symptomaticWeight);
    if (isNaN(weightKg) || weightKg <= 0) {
      if (values.bolusResult !== null) updateFields({ bolusResult: null });
      return;
    }

    let bolusVolume = weightKg * 3;
    if (bolusVolume > 150) bolusVolume = 150;

    const ratePerHour = (bolusVolume / 20) * 60; // mL/hr over 20 min

    updateFields({
      bolusResult: {
        weight: weightKg,
        bolusVolume: bolusVolume,
        ratePerHour: ratePerHour,
        durationMin: 20,
      }
    });
  }, [values.symptomatic, values.symptomaticAgeGroup, values.symptomaticWeight, updateFields]);

  // ─── Reset handler ───
  const handleReset = () => {
    reset();
    updateFields({ symptomatic: false, symptomaticAgeGroup: "adult", symptomaticWeight: "50", bolusResult: null });
  };

  return (
    <div className="calc-container">
      <FormulaBox title="Adrogue-Madias Formula & Reference">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Adrogue-Madias Equation:</p>
        <div style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap', marginBottom: 6 }}>
          <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', opacity: 0.9, display: 'inline-block' }}>
            Δ Na = (Infusate Na − Serum Na) ÷ (TBW + 1)
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>Total Body Water (TBW) Coefficients:</p>
        <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.75rem' }}>
          <li>⚠️ Max safe rise: ≤8–10 mmol/L per 24h</li>
          <li>⚠️ Rapid correction risks Osmotic Demyelination Syndrome (ODS)</li>
        </ul>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: 8, marginBottom: 4 }}>Symptomatic Hyponatremia — 3% HTS Bolus:</p>
        <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.75rem' }}>
          <li>Dose (Children less than 50kg): Weight (kg) × 3 mL of 3% HTS</li>
          <li>Dose (Adults or children 50kg or more): 150 mL</li>
          <li>Administer over 20 minutes</li>
          <li>May repeat once if symptoms persist</li>
          <li>Recheck Na after bolus; avoid overcorrection</li>
        </ul>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: 8, marginBottom: 4 }}>Unit Conversions:</p>
        <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.75rem' }}>
          <li>Weight (lb) → (kg): × 0.453592</li>
          <li>Weight (g) → (kg): ÷ 1000</li>
        </ul>
      </FormulaBox>

      {/* Symptomatic Hyponatremia toggle */}
      <CheckboxField
        label="Symptomatic"
        field="symptomatic"
        values={values}
        setField={setField}
      />

      {values.symptomatic ? (
        <>
          {/* Age Group selector: Adult / Child */}
          <SelectField
            label="Age Group"
            field="symptomaticAgeGroup"
            values={values}
            setField={setField}
            options={[
              { value: "adult", label: "Adult" },
              { value: "child", label: "Child" },
            ]}
          />

          {/* Weight input (kg) */}
          <NumberField
            label="Weight (kg)"
            field="symptomaticWeight"
            values={values}
            setField={setField}
            min="0"
            max="50"
            placeholder="e.g. 15"
            disabled={values.symptomaticAgeGroup === "adult"}
            inputStyle={values.symptomaticAgeGroup === "adult"
              ? { background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }
              : {}}
          />

          <p style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 4 }}>
            {values.symptomaticAgeGroup === "adult"
              ? "Adult mode: weight locked at 50 kg."
              : "Child mode: max weight 50 kg."}
          </p>
        </>
      ) : (
        <>
          {/* Row 1: Serum Na + Weight */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <NumberField label="Serum Na (mmol/L)" field="sodium" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
            <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
          </div>

          {/* Row 2: Sex + Age Group */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <SelectField label="Sex" field="sex" values={values} setField={setField} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
            <SelectField label="Age Group" field="ageGroup" values={values} setField={setField} options={[{ value: "nonelderly", label: "Non-elderly" }, { value: "elderly", label: "Elderly (≥65)" }]} />
          </div>

          {/* Row 3: Volume Status */}
          <SelectField label="Volume Status" field="volumeStatus" values={values} setField={setField}
            options={[
              { value: "hypovolemic", label: "Hypovolemic" },
              { value: "euvolemic", label: "Euvolemic (SIADH)" },
              { value: "hypervolemic", label: "Hypervolemic" },
            ]}
          />

          {/* Row 4: Infusate + Target Rise */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <SelectField label="Infusate Fluid" field="fluid" values={values} setField={setField}
              options={[{ value: "ns", label: "0.9% NS (154 mEq)" }, { value: "hts", label: "3% HTS (513 mEq)" }, { value: "rl", label: "Ringer's Lactate" }]}
            />
            <NumberField label="Target rise (mmol/24h)" field="targetRise" values={values} setField={setField} placeholder="e.g. 6" />
          </div>
        </>
      )}

      <ResetButton onClick={handleReset} />

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

      {/* Result: Standard or Symptomatic */}
      <ResultBox show={!!values.result || !!values.bolusResult}>
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
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>TBW estimate</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.result.tbw} L</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>Duration</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>24 hours</p>
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
                <li>⚠️ Rapid correction risks Osmotic Demyelination Syndrome (ODS)</li>
              </ul>
            </div>
          </>
        )}
        {values.bolusResult && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>3% HTS bolus volume</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.bolusResult.bolusVolume} mL</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: 2 }}>Administration time</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>{values.bolusResult.durationMin} minutes</p>
              </div>
            </div>
            <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 10 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, opacity: 0.6, marginBottom: 4 }}>3% Hypertonic Saline Bolus:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', fontSize: '0.78rem', opacity: 0.75 }}>
                <li>⚠️ Dose: Weight (kg) × 3 mL</li>
              </ul>
            </div>
          </>
        )}
      </ResultBox>
    </div>
  );
}
