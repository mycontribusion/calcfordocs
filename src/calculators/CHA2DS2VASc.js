import React, { useMemo, useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const CRITERIA = [
  { label: "Congestive heart failure / LV dysfunction", value: 1, key: "chf" },
  { label: "Hypertension (treated or untreated)", value: 1, key: "htn" },
  { label: "Age ≥ 75 years", value: 2, key: "age75" },
  { label: "Diabetes mellitus", value: 1, key: "dm" },
  { label: "Stroke / TIA / thromboembolism history", value: 2, key: "stroke" },
  { label: "Vascular disease (MI, PAD, aortic plaque)", value: 1, key: "vd" },
  { label: "Age 65–74 years", value: 1, key: "age64" },
  { label: "Female sex", value: 1, key: "female" },
];

const INITIAL_STATE = {
  chf: false,
  htn: false,
  age75: false,
  dm: false,
  stroke: false,
  vd: false,
  age64: false,
  female: false,
  // Global Sync Keys
  age: "",
  sex: "male",
};

export default function CHA2DS2VASc() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  // Auto-set age and sex criteria based on global patient state
  useEffect(() => {
    const ageVal = parseFloat(values.age);
    const isFemale = values.sex === "female";

    const updates = {};
    if (!isNaN(ageVal)) {
      updates.age75 = ageVal >= 75;
      updates.age64 = ageVal >= 65 && ageVal < 75;
    }
    updates.female = isFemale;

    updateFields(updates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.age, values.sex]);

  const score = useMemo(() => {
    let sum = 0;
    CRITERIA.forEach((c) => {
      if (values[c.key]) sum += c.value;
    });
    return sum;
  }, [values]);

  const interpretation = useMemo(() => {
    let sex = values.female ? "female" : "male";
    let text = "";

    if (sex === "male") {
      if (score === 0) text = "Low risk — no anticoagulation needed.";
      else if (score === 1) text = "Intermediate risk — consider anticoagulation.";
      else text = "High risk — anticoagulation recommended.";
    } else {
      if (score === 1) text = "Low risk — no anticoagulation needed.";
      else if (score === 2) text = "Intermediate risk — consider anticoagulation.";
      else if (score >= 3) text = "High risk — anticoagulation recommended.";
    }
    return text;
  }, [score, values.female]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <SyncSuggestion field="age" suggestion={suggestions.age} onSync={syncField} />
        <SyncSuggestion field="sex" suggestion={suggestions.sex} onSync={syncField} />
        {CRITERIA.map((c) => (
          <label key={c.key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={values[c.key]}
              onChange={(e) => setField(c.key, e.target.checked)}
              style={{ marginRight: 10 }}
            />
            <span>{c.label} ({c.value} point{c.value > 1 ? "s" : ""})</span>
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {(score > 0 || (values.female && score >= 1)) && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Total Score:</strong> {score}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}
