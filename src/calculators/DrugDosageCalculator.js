import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

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
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

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
        switch (values.weightUnit) {
          case "kg": w = n; break;
          case "g": w = n / 1000; break;
          case "lb": w = n * 0.453592; break;
          default: w = n;
        }
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
      <div className="calc-box">
        <label className="calc-label">Dose:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" inputMode="decimal" value={values.dose} onChange={(e) => setField("dose", e.target.value)} placeholder="Enter dose" className="calc-input" style={{ flex: 2 }} />
          <select value={values.doseUnit} onChange={(e) => setField("doseUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="/kg">/kg</option><option value="/kg/day">/kg/day</option><option value="/min">/min</option><option value="/kg/min">/kg/min</option>
          </select>
        </div>
      </div>
      {values.doseUnit !== "/min" && (
        <div className="calc-box">
          <label className="calc-label">Weight:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="number" value={values.weight} onChange={(e) => setField("weight", e.target.value)} placeholder="Patient weight" className="calc-input" style={{ flex: 2 }} />
            <select value={values.weightUnit} onChange={(e) => setField("weightUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
              <option value="kg">kg</option><option value="g">g</option><option value="lb">lb</option>
            </select>
          </div>
        </div>
      )}
      {values.doseUnit === "/kg/day" && (
        <div className="calc-box"><label className="calc-label">Number of divided doses per day:</label><input type="number" min="1" value={values.numDoses} onChange={(e) => setField("numDoses", e.target.value)} className="calc-input" /></div>
      )}
      {(values.doseUnit === "/min" || values.doseUnit === "/kg/min") && (
        <div className="calc-box"><label className="calc-label">Duration:</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" min="1" value={values.duration} onChange={(e) => setField("duration", e.target.value)} className="calc-input" style={{ flex: 2 }} /><select value={values.durationUnit} onChange={(e) => setField("durationUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="hours">hours</option><option value="minutes">minutes</option></select></div></div>
      )}
      <button type="button" onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.error && <div className="calc-result" style={{ marginTop: 16, color: '#ef4444', borderColor: '#ef4444' }}>{values.error}</div>}
      {values.result !== null && !values.error && <div className="calc-result" style={{ marginTop: 16 }}><strong>Total Dose:</strong> {values.result}</div>}
    </div>
  );
}
