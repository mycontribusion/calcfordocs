import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  age: "",
  unit: "days",
  formula: "default",
  birthWeight: "",
  weightResult: "",
  formulaResult: "",
};

export default function PediatricWeightEstimator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  const ageInMonths = () => {
    if (!values.age) return 0;
    if (values.unit === "days") return values.age / 30.44;
    return values.unit === "months" ? values.age : values.age * 12;
  };

  useEffect(() => {
    const months = ageInMonths();
    const years = months / 12;
    const isNeonatalDefault = values.formula === "default" && months <= 3;

    if (!values.age || (isNeonatalDefault && !values.birthWeight)) {
      if (values.weightResult !== "" || values.formulaResult !== "") updateFields({ weightResult: "", formulaResult: "" });
      return;
    }

    let weight = null;
    let explanation = "";

    if (values.formula === "nelson") {
      if (months >= 3 && months <= 11) { weight = (months + 9) / 2; explanation = "Nelson: (Age in months + 9) ÷ 2"; }
      else if (years >= 1 && years <= 6) { weight = 2 * years + 8; explanation = "Nelson: (2 × Age in years) + 8"; }
      else if (years >= 7 && years <= 12) { weight = 7 * years - 5; explanation = "Nelson: (7 × Age in years) - 5"; }
    } else if (values.formula === "bestGuess") {
      if (months < 12) { weight = (months + 9) / 2; explanation = "Best Guess: (Age in months + 9) ÷ 2"; }
      else if (years >= 1 && years <= 5) { weight = 2 * years + 5; explanation = "Best Guess: (2 × Age in years) + 5"; }
      else if (years >= 5 && years <= 14) { weight = 4 * years; explanation = "Best Guess: 4 × Age in years"; }
    } else {
      if (months <= 3) { weight = ((values.age - 10) * 30 + Number(values.birthWeight)) / 1000; explanation = "(Age in days - 10) × 30 + Birth Weight"; }
      else if (months <= 12) { weight = (months + 8) / 2; explanation = "(Age in months + 8) ÷ 2"; }
      else if (years <= 6) { weight = 2 * years + 8; explanation = "(2 × Age in years) + 8"; }
      else if (years <= 12) { weight = (7 * years - 5) / 2; explanation = "(7 × Age in years - 5) ÷ 2"; }
    }

    if (weight !== null) updateFields({ weightResult: `Estimated Weight: ${weight.toFixed(1)} kg`, formulaResult: explanation });
    else updateFields({ weightResult: "Not applicable for this age range", formulaResult: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.age, values.unit, values.formula, values.birthWeight]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Age:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.age} onChange={(e) => setField("age", Number(e.target.value))} className="calc-input" style={{ flex: 2 }} />
          <select value={values.unit} onChange={(e) => setField("unit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="days">Days</option><option value="months">Months</option><option value="years">Years</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Formula:</label>
        <select value={values.formula} onChange={(e) => setField("formula", e.target.value)} className="calc-select"><option value="nelson">Nelson</option><option value="bestGuess">Best Guess</option><option value="default">Default</option></select>
      </div>
      {values.formula === "default" && ageInMonths() <= 3 && (
        <div className="calc-box"><label className="calc-label">Birth Weight (grams):</label><input type="number" value={values.birthWeight} onChange={(e) => setField("birthWeight", Number(e.target.value))} className="calc-input" /></div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.weightResult && <div className="calc-result"><p><strong>{values.weightResult}</strong></p>{values.formulaResult && <p style={{ fontSize: "0.9em", marginTop: 5 }}>{values.formulaResult}</p>}</div>}
    </div>
  );
}
