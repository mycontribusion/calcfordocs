import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  consciousness: 0,
  vomiting: 0,
  headache: 0,
  dbp: "70",
  sbp: "",
  atheroma: 0,
};

export default function SirirajScore() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const { score, interpretation } = useMemo(() => {
    if (values.dbp === "") return { score: null, interpretation: "" };
    const dbpVal = Number(values.dbp) || 0;
    const result = (2.5 * values.consciousness) + (2 * values.vomiting) + (2 * values.headache) + (0.1 * dbpVal) - (3 * values.atheroma) - 12;
    let interp = "";
    if (result > 1) interp = "Likely Hemorrhagic Stroke";
    else if (result < -1) interp = "Likely Ischemic Stroke";
    else interp = "Indeterminate (Grey Zone) → Imaging required";
    return { score: result.toFixed(2), interpretation: interp };
  }, [values]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Consciousness:</label>
        <select className="calc-select" value={values.consciousness} onChange={(e) => setField("consciousness", Number(e.target.value))}>
          <option value={0}>Alert</option><option value={1}>Drowsy/Stuporous</option><option value={2}>Semi-coma/Coma</option>
        </select>
      </div>
      <div className="calc-box">
        <label className="calc-label">Vomiting:</label>
        <select className="calc-select" value={values.vomiting} onChange={(e) => setField("vomiting", Number(e.target.value))}>
          <option value={0}>Absent</option><option value={1}>Present</option>
        </select>
      </div>
      <div className="calc-box">
        <label className="calc-label">Headache:</label>
        <select className="calc-select" value={values.headache} onChange={(e) => setField("headache", Number(e.target.value))}>
          <option value={0}>Absent</option><option value={1}>Present</option>
        </select>
      </div>
      <div className="calc-box">
        <label className="calc-label">Diastolic BP (mmHg):</label>
        <input type="number" className="calc-input" value={values.dbp} onChange={(e) => setField("dbp", e.target.value)} placeholder="e.g. 90" />
      </div>
      <div className="calc-box">
        <label className="calc-label">Atheroma markers:</label>
        <select className="calc-select" value={values.atheroma} onChange={(e) => setField("atheroma", Number(e.target.value))}>
          <option value={0}>Absent</option><option value={1}>Present</option>
        </select>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {score !== null && (
        <div className="calc-result">
          <p><strong>Score:</strong> {score}</p><p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}
