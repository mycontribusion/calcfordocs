import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  creatinine: "",
  creatinineUnit: "µmol/L",
  age: "",
  sex: "male",
  egfr: null,
  interpretation: "",
};

function EGFRCalculator() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  const interpretEGFR = (value) => {
    if (value >= 90) return "G1: Normal kidney function (≥90)";
    if (value >= 60) return "G2: Mildly decreased kidney function (60–89)";
    if (value >= 45) return "G3a: Mild–moderate CKD (45–59)";
    if (value >= 30) return "G3b: Moderate–severe CKD (30–44)";
    if (value >= 15) return "G4: Severe CKD (15–29)";
    return "G5: Kidney failure (<15)";
  };

  const parseRequired = (v) => {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  useEffect(() => {
    const scrVal = parseRequired(values.creatinine);
    const ageVal = parseRequired(values.age);

    if (scrVal === null || ageVal === null) {
      if (values.egfr !== null) updateFields({ egfr: null, interpretation: "" });
      return;
    }

    let scrMgdl;
    if (values.creatinineUnit === "µmol/L") {
      scrMgdl = scrVal / 88.4;
    } else if (values.creatinineUnit === "mmol/L") {
      scrMgdl = (scrVal * 1000) / 88.4;
    } else {
      scrMgdl = scrVal;
    }

    const kappa = values.sex === "male" ? 0.9 : 0.7;
    const alpha = values.sex === "male" ? -0.302 : -0.241;

    const scrRatio = scrMgdl / kappa;
    const minPart = Math.min(scrRatio, 1) ** alpha;
    const maxPart = Math.max(scrRatio, 1) ** -1.2;
    const ageFactor = 0.9938 ** ageVal;
    const sexFactor = values.sex === "female" ? 1.012 : 1;

    const result = 142 * minPart * maxPart * ageFactor * sexFactor;
    const rounded = Number(result.toFixed(1));

    if (values.egfr !== rounded) {
      updateFields({ egfr: rounded, interpretation: interpretEGFR(rounded) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.creatinine, values.creatinineUnit, values.age, values.sex]);

  return (
    <div className="calc-container">
      <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>CKD-EPI 2021</h3>

      <div className="calc-box">
        <label className="calc-label">Serum Creatinine:</label>
        <SyncSuggestion field="creatinine" suggestion={suggestions.creatinine} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.creatinine}
            onChange={(e) => setField("creatinine", e.target.value)}
            placeholder="e.g., 80"
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.creatinineUnit} onChange={(e) => setField("creatinineUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="µmol/L">µmol/L</option>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Age (years):</label>
        <SyncSuggestion field="age" suggestion={suggestions.age} onSync={syncField} />
        <input
          type="number"
          value={values.age}
          onChange={(e) => setField("age", e.target.value)}
          placeholder="e.g., 40"
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Sex: </label>
        <select value={values.sex} onChange={(e) => setField("sex", e.target.value)} className="calc-select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {values.egfr !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>eGFR:</strong> {values.egfr} mL/min/1.73m²</p>
          <p><strong>Interpretation:</strong> {values.interpretation}</p>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              background: 'rgba(0,0,0,0.02)',
              textAlign: 'left'
            }}
          >
            <strong>Formula Used (CKD-EPI 2021):</strong>
            <br />
            <code style={{ display: 'block', margin: '8px 0', background: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 4 }}>
              eGFR = 142 × min(SCr/κ, 1)<sup>α</sup> × max(SCr/κ, 1)<sup>−1.200</sup> × 0.9938<sup>Age</sup> × (1.012 if female)
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

export default EGFRCalculator;
