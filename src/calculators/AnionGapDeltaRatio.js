import { useEffect, useState } from "react";
import "./CalculatorShared.css";

export default function AnionGapDeltaRatio() {
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState("");
  const [chloride, setChloride] = useState("");
  const [bicarbonate, setBicarbonate] = useState("");
  const [albumin, setAlbumin] = useState(""); // optional
  const [albuminUnit, setAlbuminUnit] = useState("g/dL");

  const [result, setResult] = useState(null);

  /* ---------- Helpers ---------- */
  const parseNum = (v) => {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const albuminToGdL = (val, unit) => {
    if (val === null) return null;
    switch (unit) {
      case "g/L":
        return val / 10;
      case "mg/mL":
        return val / 100;
      case "g%":
      case "g/dL":
      default:
        return val;
    }
  };

  /* ---------- Auto Calculate ---------- */
  useEffect(() => {
    const na = parseNum(sodium);
    const k = parseNum(potassium);
    const cl = parseNum(chloride);
    const hco3 = parseNum(bicarbonate);

    // 🔒 Required fields check
    if ([na, k, cl, hco3].some((v) => v === null)) {
      setResult(null);
      return;
    }

    const albRaw = albumin === "" ? null : parseNum(albumin);

    // AG (with potassium)
    const ag = na + k - (cl + hco3);
    const agRounded = Number(ag.toFixed(2));

    // Albumin-corrected AG
    let agCorr = null;
    let albuminGdL = null;

    if (albRaw !== null) {
      albuminGdL = albuminToGdL(albRaw, albuminUnit);
      agCorr = Number((ag + 2.5 * (4 - albuminGdL)).toFixed(2));
    }

    const uncorrectedHigh = ag >= 12;
    const correctedHigh = agCorr !== null && agCorr >= 12;

    let deltaGap = null;
    let deltaRatio = null;
    let deltaInterpretation = null;

    if (uncorrectedHigh || correctedHigh) {
      const agUsed = correctedHigh ? agCorr : ag;
      deltaGap = Number((agUsed - 12).toFixed(2));

      if (Math.abs(24 - hco3) > 1e-9) {
        deltaRatio = Number((deltaGap / (24 - hco3)).toFixed(2));

        if (deltaRatio < 0.4) {
          deltaInterpretation =
            "ΔRatio < 0.4 → Mixed disorder: HAGMA + normal AG metabolic acidosis.";
        } else if (deltaRatio > 2) {
          deltaInterpretation =
            "ΔRatio > 2 → Mixed disorder: HAGMA + metabolic alkalosis.";
        } else {
          deltaInterpretation =
            "ΔRatio 0.4–2 → Primary high anion gap metabolic acidosis.";
        }
      } else {
        deltaInterpretation =
          "Cannot compute ΔRatio: (24 − HCO₃⁻) equals zero.";
      }
    }

    setResult({
      ag: agRounded,
      agCorr,
      albuminGdL,
      deltaGap,
      deltaRatio,
      deltaInterpretation,
    });
  }, [sodium, potassium, chloride, bicarbonate, albumin, albuminUnit]);

  /* ---------- Reset ---------- */
  const reset = () => {
    setSodium("");
    setPotassium("");
    setChloride("");
    setBicarbonate("");
    setAlbumin("");
    setAlbuminUnit("g/dL");
    setResult(null);
  };

  return (
    <div className="calc-container">
      <h2 className="calc-title">Anion Gap & Delta Gap / Delta Ratio</h2>

      <div className="calc-box">
        <label className="calc-label">Sodium (Na⁺, mmol/L):</label>
        <input value={sodium} onChange={(e) => setSodium(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Potassium (K⁺, mmol/L):</label>
        <input value={potassium} onChange={(e) => setPotassium(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Chloride (Cl⁻, mmol/L):</label>
        <input value={chloride} onChange={(e) => setChloride(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Bicarbonate (HCO₃⁻, mmol/L):</label>
        <input value={bicarbonate} onChange={(e) => setBicarbonate(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Albumin (optional):</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={albumin}
            onChange={(e) => setAlbumin(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={albuminUnit}
            onChange={(e) => setAlbuminUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="g/dL">g/dL</option>
            <option value="g/L">g/L</option>
            <option value="g%">g%</option>
            <option value="mg/mL">mg/mL</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset</button>

      {/* 🔒 NOTHING shows until required fields are filled */}
      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>
            <strong>Anion Gap:</strong> {result.ag} mmol/L
          </p>

          {result.agCorr !== null && (
            <div style={{ marginTop: 8 }}>
              <p>Albumin (g/dL): {result.albuminGdL.toFixed(2)}</p>
              <p>
                <strong>Corrected AG:</strong> {result.agCorr} mmol/L
              </p>
            </div>
          )}

          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8 }}>
            <p><strong>Delta Gap / Ratio</strong></p>

            {result.deltaGap === null ? (
              <p style={{ fontSize: '0.9rem' }}>ΔRatio not applicable (AG &lt; 12 mmol/L)</p>
            ) : result.deltaRatio === null ? (
              <p style={{ fontSize: '0.9rem' }}>ΔGap: {result.deltaGap} — cannot compute ΔRatio</p>
            ) : (
              <div style={{ fontSize: '0.95rem' }}>
                <p>ΔGap: {result.deltaGap}</p>
                <p>ΔRatio: {result.deltaRatio}</p>
                <p style={{ fontStyle: 'italic', marginTop: 4 }}>{result.deltaInterpretation}</p>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', marginTop: 16, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 8, borderRadius: 4 }}>
            <strong>Formulas</strong>
            <br />
            AG = (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)
            <br />
            Corrected AG = AG + 2.5 × (4 − albumin[g/dL])
            <br />
            ΔRatio = (AG − 12) ÷ (24 − HCO₃⁻)
          </div>
        </div>
      )}
    </div>
  );
}
