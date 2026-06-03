import React from "react";
import { useCalc, WeightField, ResetButton, SelectField } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  severity: "mild",
  // Global Sync Keys
  age: "",
  sex: "male",
};

export default function FluidCorrection() {
  const { values, suggestions, updateField: setField, syncField, reset } = useCalc(INITIAL_STATE);

  const result = (() => {
    const weightKg = toKg(values.weight, values.weightUnit);
    if (isNaN(weightKg) || weightKg <= 0) return { error: "Please enter a valid weight." };
    let dehydrationPercent = 0;
    if (values.severity === "mild") dehydrationPercent = 5;
    else if (values.severity === "moderate") dehydrationPercent = 10;
    else if (values.severity === "severe") dehydrationPercent = 15;

    // Deficit
    const deficit = dehydrationPercent * weightKg * 10;

    // Maintenance (Holliday–Segar)
    let maintenance = 0;
    if (weightKg <= 10) maintenance = weightKg * 100;
    else if (weightKg <= 20) maintenance = 1000 + (weightKg - 10) * 50;
    else maintenance = 1500 + (weightKg - 20) * 20;

    const totalFluids = deficit + maintenance;

    return {
      deficit: deficit.toFixed(0),
      maintenance: maintenance.toFixed(0),
      total: totalFluids.toFixed(0),
      percent: dehydrationPercent,
    };
  })();

  return (
    <div className="calc-container" style={{ maxWidth: 400 }}>

      {/* Weight */}
      <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} />

      {/* Severity */}
      <SelectField label="Dehydration Severity:" field="severity" values={values} setField={setField} options={[{ value: "mild", label: "Mild (~5%)" }, { value: "moderate", label: "Moderate (~10%)" }, { value: "severe", label: "Severe (~15%)" }]} />

      {/* Result */}
      <div style={{ marginTop: 16 }}>
        {result.error ? (
          <p className="calc-result" style={{ background: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>{result.error}</p>
        ) : (
          <div className="calc-result" style={{ textAlign: 'left' }}>
            <p><strong>Deficit ({result.percent}%):</strong> {result.deficit} mL</p>
            <p><strong>Maintenance:</strong> {result.maintenance} mL</p>
            <p><strong>Total (24h):</strong> {result.total} mL</p>

            <hr style={{ margin: "12px 0", borderColor: 'rgba(0,0,0,0.1)' }} />

            <p style={{ fontSize: '0.9rem' }}><strong>Formulas Used:</strong></p>
            <p style={{ fontSize: '0.85rem' }}>Deficit = % dehydration × Weight (kg) × 10</p>
            <p style={{ fontSize: '0.85rem' }}>Maintenance: Holliday–Segar method</p>
          </div>
        )}
      </div>
      <ResetButton onClick={reset} />
    </div>
  );
}
