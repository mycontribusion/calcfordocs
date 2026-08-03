import React, { useEffect } from "react";
import { useCalc, SyncSuggestion, FormulaBox, ResetButton } from "./CalcFields";

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
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

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
      <FormulaBox title="CURB-65 Criteria & Severity Management">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Criteria (1 point each):</p>
        <ul style={{ margin: "0 0 6px", paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>C:</strong> Confusion (abnormal mental state)</li>
          <li><strong>U:</strong> Urea ≥ 7 mmol/L (BUN ≥ 20 mg/dL)</li>
          <li><strong>R:</strong> Respiratory Rate ≥ 30 /min</li>
          <li><strong>B:</strong> Blood Pressure (SBP &lt; 90 or DBP ≤ 60 mmHg)</li>
          <li><strong>65:</strong> Age ≥ 65 years</li>
        </ul>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Management Recommendations:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>0 – 1 point:</strong> Low risk (&lt;3% 30-day mortality) — Home treatment / Outpatient</li>
          <li><strong>2 points:</strong> Moderate risk (9% mortality) — Consider hospital admission / close outpatient</li>
          <li><strong>3 – 5 points:</strong> High risk (17–30% mortality) — Hospital admission, assess for ICU if 4–5</li>
        </ul>
      </FormulaBox>

      <div className="calc-box">
        <SyncSuggestion field="age" suggestion={suggestions.age} onSync={syncField} />
        <SyncSuggestion field="urea" suggestion={suggestions.urea} onSync={syncField} />
        <SyncSuggestion field="sbp" suggestion={suggestions.sbp} onSync={syncField} />
        <SyncSuggestion field="dbp" suggestion={suggestions.dbp} onSync={syncField} />

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

      <ResetButton onClick={reset} />

      <div className="calc-result" style={{ marginTop: 16 }}>
        Score: {score} / 5
        <div style={{ fontSize: "0.9rem", fontWeight: "normal", marginTop: 4 }}>
          {score <= 1
            ? "Mild CAP — consider outpatient care"
            : score === 2
            ? "Moderate CAP — consider inpatient admission"
            : "Severe CAP — inpatient admission recommended (assess ICU requirement)"}
        </div>
      </div>
    </div>
  );
}
