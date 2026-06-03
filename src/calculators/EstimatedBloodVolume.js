import React, { useEffect } from "react";
import { useCalc, NumberField, ResetButton, SelectField } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  ageGroup: "neonate",
  // Global Sync Keys
  age: "",
  sex: "male",
};

export default function EstimatedBloodVolume() {
  const { values, suggestions, updateField: setField, syncField, reset } = useCalc(INITIAL_STATE);

  // Auto-set ageGroup based on age and sex global state
  useEffect(() => {
    const ageVal = parseFloat(values.age);
    if (!isNaN(ageVal)) {
      if (ageVal < 0.1) setField("ageGroup", "neonate");
      else if (ageVal < 1) setField("ageGroup", "infant");
      else if (ageVal < 18) setField("ageGroup", "child");
      else setField("ageGroup", values.sex === "female" ? "adultFemale" : "adultMale");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.age, values.sex]);

  const validatePositiveNumber = (n) => {
    const x = Number(n);
    return Number.isFinite(x) && x > 0;
  };

  // Auto-calc result
  const result = (() => {
    const { weight, weightUnit, ageGroup } = values;
    if (!validatePositiveNumber(weight)) return "⚠️ Please enter a valid positive weight.";

    const weightKg = toKg(weight, weightUnit);

    let range = [70, 70]; // default adult male
    switch (ageGroup) {
      case "neonate":
        range = [85, 90];
        break;
      case "infant":
        range = [75, 80];
        break;
      case "child":
        range = [70, 75];
        break;
      case "adultMale":
        range = [70, 70];
        break;
      case "adultFemale":
        range = [65, 65];
        break;
      default:
        range = [70, 70];
    }

    const ebvLow = weightKg * range[0];
    const ebvHigh = weightKg * range[1];

    return { low: ebvLow.toFixed(0), high: ebvHigh === ebvLow ? null : ebvHigh.toFixed(0), formula: `${range[0]}${range[1] !== range[0] ? '–' + range[1] : ''} mL/kg` };
  })();

  return (
    <div className="calc-container" style={{ maxWidth: 360 }}>

      <NumberField label="Weight:" field="weight" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />

      <SelectField label="Unit:" field="weightUnit" values={values} setField={setField} options={[{value: "kg", label: "kg"}, {value: "lb", label: "lb"}]} />

      <SelectField label="Age Group:" field="ageGroup" values={values} setField={setField} options={[{value: "neonate", label: "Neonate (85–90 mL/kg)"}, {value: "infant", label: "Infant (75–80 mL/kg)"}, {value: "child", label: "Child (70–75 mL/kg)"}, {value: "adultMale", label: "Adult Male (~70 mL/kg)"}, {value: "adultFemale", label: "Adult Female (~65 mL/kg)"}]} />

      <div className="calc-result" style={{ marginTop: 12 }}>
        {typeof result === 'string' ? result : (
          <>
            <p><strong>Estimated Blood Volume:</strong> {result.low}{result.high ? ` – ${result.high}` : ''} mL</p>
            <div style={{ marginTop: 8, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
              <span style={{ opacity: 0.7 }}>Formula: Weight (kg) × {result.formula}</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
                <li>Neonate: 85–90 mL/kg</li>
                <li>Infant: 75–80 mL/kg</li>
                <li>Child: 70–75 mL/kg</li>
                <li>Adult Male: ~70 mL/kg</li>
                <li>Adult Female: ~65 mL/kg</li>
              </ul>
            </div>
          </>
        )}
      </div>
      <ResetButton onClick={reset} />
    </div>
  );
}
