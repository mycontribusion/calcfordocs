import React, { useEffect } from "react";
import { useCalc, CalcBox, NumberField, WeightField, HeightField, ResetButton, ResultBox, SyncSuggestion, SelectField } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
  dose: "",
  weight: "",
  weightUnit: "kg",
  doseUnit: "/kg",
  numDoses: 1,
  duration: "",
  durationUnit: "hours",
  result: null,
  error: "",
};

export default function DrugDosageCalculator() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const isWeightBased = values.doseUnit.includes("kg");

    if (!values.dose || (isWeightBased && !values.weight)) {
      if (values.result !== null || values.error !== "") updateFields({ result: null, error: "" });
      return;
    }

    const n = Number(values.weight);
    let w = null;
    if (isWeightBased) {
      if (Number.isFinite(n) && n > 0) {
        w = toKg(values.weight, values.weightUnit);
      } else {
        updateFields({ error: "Enter valid weight.", result: null });
        return;
      }
    }

    const d = Number(values.dose);
    let dur = Number(values.duration);
    const nDoses = Number(values.numDoses);

    if ((values.doseUnit === "/min" || values.doseUnit === "/kg/min") && (!dur || dur <= 0)) {
      updateFields({ error: "Enter valid duration.", result: null });
      return;
    }

    if (values.durationUnit === "hours" && (values.doseUnit === "/min" || values.doseUnit === "/kg/min")) dur *= 60;

    let total = 0;
    switch (values.doseUnit) {
      case "/kg": total = d * w; break;
      case "/kg/day":
        if (!nDoses || nDoses < 1) { updateFields({ error: "Enter valid number of doses.", result: null }); return; }
        total = (d * w) / nDoses; break;
      case "/min": total = d * dur; break;
      case "/kg/min": total = d * w * dur; break;
      default: updateFields({ error: "Invalid dosing type.", result: null }); return;
    }
    updateFields({ result: total.toFixed(2), error: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.dose, values.weight, values.weightUnit, values.doseUnit, values.numDoses, values.duration, values.durationUnit]);

  return (
    <div className="calc-container">
      <NumberField
        label="Dose:" field="dose" values={values} setField={setField} placeholder="Enter dose"
        units={[{value:"/kg",label:"/kg"},{value:"/kg/day",label:"/kg/day"},{value:"/min",label:"/min"},{value:"/kg/min",label:"/kg/min"}]}
        unitField="doseUnit" unitFlex={1.5}
      />
      {values.doseUnit !== "/min" && (
        <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} includeGrams={true} />
      )}
      {values.doseUnit === "/kg/day" && (
        <NumberField label="Number of divided doses per day:" field="numDoses" values={values} setField={setField} min="1" />
      )}
      {(values.doseUnit === "/min" || values.doseUnit === "/kg/min") && (
        <NumberField
          label="Duration:" field="duration" values={values} setField={setField} min="1"
          units={[{value:"hours",label:"hours"},{value:"minutes",label:"minutes"}]}
          unitField="durationUnit"
        />
      )}
      <ResetButton onClick={reset} />
      {values.error && <ResultBox style={{ color: '#ef4444', borderColor: '#ef4444' }}>{values.error}</ResultBox>}
      <ResultBox show={values.result !== null && !values.error}>
        <strong>Total Dose:</strong> {values.result}
      </ResultBox>
    </div>
  );
}
