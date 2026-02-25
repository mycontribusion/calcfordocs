import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  calcium: "",
  calciumUnit: "mmol/L",
  albumin: "",
  albuminUnit: "g/L",
  result: null,
  interpretation: "",
  // Global Sync Keys
  weight: "",
  age: "",
  sex: "male",
};

export default function CorrectedCalcium() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

  const parseRequired = (v) => {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  useEffect(() => {
    const caVal = parseRequired(values.calcium);
    const albVal = parseRequired(values.albumin);

    if (caVal === null || albVal === null) {
      if (values.result !== null) updateFields({ result: null, interpretation: "" });
      return;
    }

    let ca = caVal;
    let alb = albVal;

    if (values.calciumUnit === "mmol/L") ca = ca * 4.0;
    if (values.albuminUnit === "g/L") alb = alb / 10;

    let correctedCa = ca + 0.8 * (4 - alb);

    let interp = "";
    if (correctedCa < 8.5) interp = "Low (Hypocalcemia)";
    else if (correctedCa > 10.5) interp = "High (Hypercalcemia)";
    else interp = "Normal";

    if (values.calciumUnit === "mmol/L") correctedCa = correctedCa / 4.0;

    const finalRes = correctedCa.toFixed(2);
    if (values.result !== finalRes) {
      updateFields({ result: finalRes, interpretation: interp });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.calcium, values.calciumUnit, values.albumin, values.albuminUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Calcium:</label>
        <SyncSuggestion field="calcium" suggestion={suggestions.calcium} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.calcium}
            onChange={(e) => setField("calcium", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.calciumUnit} onChange={(e) => setField("calciumUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Albumin:</label>
        <SyncSuggestion field="albumin" suggestion={suggestions.albumin} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.albumin}
            onChange={(e) => setField("albumin", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.albuminUnit} onChange={(e) => setField("albuminUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="g/dL">g/dL</option>
            <option value="g/L">g/L</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {values.result !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>
            <strong>Corrected Calcium:</strong> {values.result} {values.calciumUnit}
          </p>
          <p style={{ marginTop: 4 }}><strong>Status:</strong> {values.interpretation}</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <span style={{ opacity: 0.7 }}>Formula: Corrected Ca = Measured Ca + 0.8 × (4 – Albumin g/dL)</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
              <li>Normal: 8.5–10.5 mg/dL (2.12–2.62 mmol/L)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
