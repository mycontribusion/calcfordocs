import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  sodium: "",
  potassium: "",
  chloride: "",
  bicarbonate: "",
  albumin: "",
  albuminUnit: "g/dL",
  result: null,
};

export default function AnionGapDeltaRatio() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  const albuminToGdL = (val, unit) => {
    if (val === null) return null;
    return unit === "g/L" ? val / 10 : unit === "mg/mL" ? val / 100 : val;
  };

  useEffect(() => {
    const na = parseFloat(values.sodium);
    const k = parseFloat(values.potassium);
    const cl = parseFloat(values.chloride);
    const hco3 = parseFloat(values.bicarbonate);

    if (isNaN(na) || isNaN(k) || isNaN(cl) || isNaN(hco3)) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const albRaw = values.albumin === "" ? null : parseFloat(values.albumin);
    const ag = na + k - (cl + hco3);

    let agCorr = null;
    let albuminGdL = null;
    if (albRaw !== null && !isNaN(albRaw)) {
      albuminGdL = albuminToGdL(albRaw, values.albuminUnit);
      agCorr = ag + 2.5 * (4 - albuminGdL);
    }

    const agUsed = agCorr !== null && agCorr >= 12 ? agCorr : ag;
    let deltaGap = agUsed >= 12 ? agUsed - 12 : null;
    let deltaRatio = null;
    let deltaInterpretation = null;

    if (deltaGap !== null) {
      if (Math.abs(24 - hco3) > 1e-9) {
        deltaRatio = deltaGap / (24 - hco3);
        deltaInterpretation = deltaRatio < 0.4 ? "ΔRatio < 0.4 → Mixed: HAGMA + NAGMA" : deltaRatio > 2 ? "ΔRatio > 2 → Mixed: HAGMA + Met Alk" : "ΔRatio 0.4–2 → Primary HAGMA";
      } else {
        deltaInterpretation = "Cannot compute ΔRatio: HCO₃⁻ is 24";
      }
    }

    const res = {
      ag: ag.toFixed(2),
      agCorr: agCorr?.toFixed(2),
      albuminGdL: albuminGdL?.toFixed(2),
      deltaGap: deltaGap?.toFixed(2),
      deltaRatio: deltaRatio?.toFixed(2),
      deltaInterpretation,
    };
    updateFields({ result: res });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.potassium, values.chloride, values.bicarbonate, values.albumin, values.albuminUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Sodium (Na⁺):</label><input type="number" value={values.sodium} onChange={(e) => setField("sodium", e.target.value)} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">Potassium (K⁺):</label><input type="number" value={values.potassium} onChange={(e) => setField("potassium", e.target.value)} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">Chloride (Cl⁻):</label><input type="number" value={values.chloride} onChange={(e) => setField("chloride", e.target.value)} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">Bicarbonate (HCO₃⁻):</label><input type="number" value={values.bicarbonate} onChange={(e) => setField("bicarbonate", e.target.value)} className="calc-input" /></div>
      <div className="calc-box">
        <label className="calc-label">Albumin (optional):</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="number" value={values.albumin} onChange={(e) => setField("albumin", e.target.value)} className="calc-input" style={{ flex: 2 }} />
          <select value={values.albuminUnit} onChange={(e) => setField("albuminUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="g/dL">g/dL</option><option value="g/L">g/L</option></select>
        </div>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <p><strong>Anion Gap:</strong> {values.result.ag} mmol/L</p>
            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Formula: AG = (Na + K) – (Cl + HCO₃)</span>
          </div>
          {values.result.agCorr && (
            <div style={{ marginBottom: 12 }}>
              <p><strong>Corrected AG:</strong> {values.result.agCorr} mmol/L</p>
              <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7 }}>Formula: Corrected AG = AG + 2.5 × (4 – Albumin g/dL)</span>
            </div>
          )}
          {values.result.deltaInterpretation && (
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 12 }}>
              <p><strong>ΔRatio:</strong> {values.result.deltaRatio}</p>
              <p style={{ marginTop: 4, fontWeight: '500', color: '#0056b3' }}>{values.result.deltaInterpretation}</p>
              <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>Formula: ΔRatio = (AGUsed – 12) / (24 – HCO₃)</span>

              <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.02)', padding: 10, borderRadius: 6, fontSize: '0.85rem' }}>
                <strong>Interpretation Guide:</strong>
                <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
                  <li>&lt; 0.4: Mixed HAGMA + NAGMA</li>
                  <li>0.4 – 1.0: HAGMA (RTAs, early DKA)</li>
                  <li>1.0 – 2.0: Pure HAGMA (Lactic acidosis, DKA)</li>
                  <li>&gt; 2.0: Mixed HAGMA + Metabolic Alkalosis</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
