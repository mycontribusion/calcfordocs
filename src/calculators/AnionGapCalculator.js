import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  na: "",
  k: "",
  cl: "",
  hco3: "",
  alb: "",
  albUnit: "g/dL",
  result: null,
};

export default function AnionGapCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function interpretAG(value, usedK) {
    if (usedK) {
      if (value < 12) return "Low Anion Gap (with K⁺)";
      if (value <= 16) return "Normal Anion Gap (with K⁺)";
      return "High Anion Gap (with K⁺)";
    } else {
      if (value < 8) return "Low Anion Gap";
      if (value <= 12) return "Normal Anion Gap";
      return "High Anion Gap";
    }
  }

  useEffect(() => {
    const naVal = parseNum(values.na);
    const clVal = parseNum(values.cl);
    const hco3Val = parseNum(values.hco3);

    if (naVal === null || clVal === null || hco3Val === null) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const kVal = parseNum(values.k);
    const albVal = parseNum(values.alb);
    const usedK = kVal !== null;

    const ag = usedK ? naVal + kVal - (clVal + hco3Val) : naVal - (clVal + hco3Val);
    const roundedAG = Number(ag.toFixed(1));

    let corrected = null;
    let correctedInterp = null;

    if (albVal !== null) {
      const albGdL = values.albUnit === "g/L" ? albVal / 10 : albVal;
      corrected = ag + 2.5 * (4 - albGdL);
      corrected = Number(corrected.toFixed(1));
      correctedInterp = interpretAG(corrected, usedK);
    }

    updateFields({
      result: {
        ag: roundedAG,
        agInterp: interpretAG(roundedAG, usedK),
        corrected,
        correctedInterp,
        usedK,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.na, values.k, values.cl, values.hco3, values.alb, values.albUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Serum Sodium (Na, mmol/L)</label>
        <input type="number" inputMode="decimal" value={values.na} onChange={(e) => setField("na", e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Potassium (K⁺, optional)</label>
        <input type="number" inputMode="decimal" value={values.k} onChange={(e) => setField("k", e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Chloride (Cl, mmol/L)</label>
        <input type="number" inputMode="decimal" value={values.cl} onChange={(e) => setField("cl", e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Bicarbonate (HCO₃⁻, mmol/L)</label>
        <input type="number" inputMode="decimal" value={values.hco3} onChange={(e) => setField("hco3", e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Albumin (optional)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            inputMode="decimal"
            value={values.alb}
            onChange={(e) => setField("alb", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.albUnit} onChange={(e) => setField("albUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="g/dL">g/dL</option>
            <option value="g/L">g/L</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {values.result && (
        <div className="calc-result" style={{ marginTop: "1rem" }}>
          <p>
            <strong>Anion Gap:</strong> {values.result.ag} mmol/L<br />
            <em style={{ fontWeight: "normal" }}>{values.result.agInterp}</em>
            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>
              Formula: AG = Na – {values.result.usedK ? "(Cl + HCO₃ + K⁺)" : "(Cl + HCO₃)"}
            </span>
          </p>
          {values.result.corrected !== null && (
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8 }}>
              <p>
                <strong>Albumin-Corrected AG:</strong> {values.result.corrected} mmol/L<br />
                <em style={{ fontWeight: "normal" }}>{values.result.correctedInterp}</em>
                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>
                  Formula: Corrected AG = AG + 2.5 × (4 – Albumin g/dL)
                </span>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#555', marginTop: 8 }}>
                Normal AG ≈ 8–12 mmol/L. Low albumin can mask an elevated anion gap; corrected AG reveals the true gap.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
