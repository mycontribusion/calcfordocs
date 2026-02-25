import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  confusion: false,
  ureaHigh: false,
  rrHigh: false,
  bpLow: false,
  age65: false,
  age: "",
  // Global Sync Keys
  urea: "",
  sbp: "",
  dbp: "",
};

export default function CURB65Calculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  // Auto-set criteria based on global demographics, labs, and vitals
  useEffect(() => {
    const ageVal = parseFloat(values.age);
    const ureaVal = parseFloat(values.urea);
    const sbpVal = parseFloat(values.sbp);
    const dbpVal = parseFloat(values.dbp);

    const updates = {};
    if (!isNaN(ageVal)) updates.age65 = ageVal >= 65;
    if (!isNaN(ureaVal)) updates.ureaHigh = ureaVal >= 7;
    if (!isNaN(sbpVal)) {
      if (sbpVal < 90) updates.bpLow = true;
      else if (!isNaN(dbpVal) && dbpVal <= 60) updates.bpLow = true;
      else updates.bpLow = false;
    } else if (!isNaN(dbpVal)) {
      updates.bpLow = dbpVal <= 60;
    }

    if (Object.keys(updates).length > 0) {
      updateFields(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.age, values.urea, values.sbp, values.dbp]);

  const score =
    (values.confusion ? 1 : 0) +
    (values.ureaHigh ? 1 : 0) +
    (values.rrHigh ? 1 : 0) +
    (values.bpLow ? 1 : 0) +
    (values.age65 ? 1 : 0);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={values.confusion}
            onChange={e => setField("confusion", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Confusion
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={values.ureaHigh}
            onChange={e => setField("ureaHigh", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Urea ≥ 7 mmol/L or BUN ≥ 20 mg/dL
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={values.rrHigh}
            onChange={e => setField("rrHigh", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Respiratory rate ≥ 30 /min
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={values.bpLow}
            onChange={e => setField("bpLow", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          SBP &lt; 90 mmHg or DBP ≤ 60 mmHg
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={values.age65}
            onChange={e => setField("age65", e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Age ≥ 65 years
        </label>
      </div>

      <button
        onClick={reset}
        className="calc-btn-reset"
      >
        Reset Calculator
      </button>

      <div className="calc-result" style={{ marginTop: 16 }}>
        Score: {score} / 5
        <div style={{ fontSize: "0.9rem", fontWeight: "normal", marginTop: 4 }}>
          {score <= 1
            ? "Mild CAP — consider outpatient care"
            : "Severe CAP — recommend hospitalization"}
        </div>
      </div>
    </div>
  );
}
