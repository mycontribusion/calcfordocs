import { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function AnionGapCalculator() {
  const [na, setNa] = useState("");
  const [k, setK] = useState(""); // optional
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");
  const [alb, setAlb] = useState(""); // optional
  const [albUnit, setAlbUnit] = useState("g/dL");

  const [result, setResult] = useState(null);

  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // Convert albumin to g/dL
  function albuminToGdL(value, unit) {
    if (value === null) return null;
    return unit === "g/L" ? value / 10 : value;
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
    const naVal = parseNum(na);
    const clVal = parseNum(cl);
    const hco3Val = parseNum(hco3);

    // required fields must be filled
    if (naVal === null || clVal === null || hco3Val === null) {
      setResult(null);
      return;
    }

    const kVal = parseNum(k);
    const albVal = parseNum(alb);

    const usedK = kVal !== null;

    const ag =
      usedK
        ? naVal + kVal - (clVal + hco3Val)
        : naVal - (clVal + hco3Val);

    const roundedAG = Number(ag.toFixed(1));

    let corrected = null;
    let correctedInterp = null;

    if (albVal !== null) {
      const albGdL = albuminToGdL(albVal, albUnit);
      corrected = ag + 2.5 * (4 - albGdL);
      corrected = Number(corrected.toFixed(1));
      correctedInterp = interpretAG(corrected, usedK);
    }

    setResult({
      ag: roundedAG,
      agInterp: interpretAG(roundedAG, usedK),
      corrected,
      correctedInterp,
      usedK,
    });
  }, [na, k, cl, hco3, alb, albUnit]);

  function handleReset() {
    setNa("");
    setK("");
    setCl("");
    setHco3("");
    setAlb("");
    setAlbUnit("g/dL");
    setResult(null);
  }

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Serum Sodium (Na, mmol/L)</label>
        <input value={na} onChange={(e) => setNa(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Potassium (K⁺, optional)</label>
        <input value={k} onChange={(e) => setK(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Chloride (Cl, mmol/L)</label>
        <input value={cl} onChange={(e) => setCl(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Bicarbonate (HCO₃⁻, mmol/L)</label>
        <input value={hco3} onChange={(e) => setHco3(e.target.value)} className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Albumin (optional)</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={alb}
            onChange={(e) => setAlb(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={albUnit}
            onChange={(e) => setAlbUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="g/dL">g/dL</option>
            <option value="g/L">g/L</option>
          </select>
        </div>
      </div>

      <button onClick={handleReset} className="calc-btn-reset">Reset</button>

      {result && (
        <div className="calc-result" style={{ marginTop: "1rem" }}>
          <p>
            <strong>Anion Gap:</strong> {result.ag} mmol/L<br />
            <em style={{ fontWeight: "normal" }}>{result.agInterp}</em>
          </p>

          <p style={{ fontSize: "0.85em", marginTop: 4 }}>
            Formula: {result.usedK
              ? "AG = Na + K − (Cl + HCO₃)"
              : "AG = Na − (Cl + HCO₃)"}
          </p>

          {result.corrected !== null && (
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8 }}>
              <p>
                <strong>Albumin-Corrected AG:</strong> {result.corrected} mmol/L<br />
                <em style={{ fontWeight: "normal" }}>{result.correctedInterp}</em>
              </p>
              <p style={{ fontSize: "0.85em", marginTop: 4 }}>
                Corrected AG = AG + 2.5 × (4 − albumin)
              </p>
            </div>
          )}

          <p style={{ fontSize: "0.9em", marginTop: 12 }}>
            <strong>Normal AG:</strong>{" "}
            {result.usedK
              ? "12–16 mmol/L (with K⁺)"
              : "8–12 mmol/L (without K⁺)"}
          </p>
        </div>
      )}
    </div>
  );
}
