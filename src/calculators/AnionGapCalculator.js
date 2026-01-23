import { useState, useEffect } from "react";

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
    <div>
      <h2>Anion Gap Calculator</h2>

      <div>
        <label>Serum Sodium (Na, mmol/L)</label><br />
        <input value={na} onChange={(e) => setNa(e.target.value)} />
      </div>
      <p />

      <div>
        <label>Serum Potassium (K⁺, optional)</label><br />
        <input value={k} onChange={(e) => setK(e.target.value)} />
      </div>
      <p />

      <div>
        <label>Serum Chloride (Cl, mmol/L)</label><br />
        <input value={cl} onChange={(e) => setCl(e.target.value)} />
      </div>
      <p />

      <div>
        <label>Serum Bicarbonate (HCO₃⁻, mmol/L)</label><br />
        <input value={hco3} onChange={(e) => setHco3(e.target.value)} />
      </div>
      <p />

      <div>
        <label>Albumin (optional)</label><br />
        <input
          value={alb}
          onChange={(e) => setAlb(e.target.value)}
          style={{ width: "120px", marginRight: "8px" }}
        />
        <select value={albUnit} onChange={(e) => setAlbUnit(e.target.value)}>
          <option value="g/dL">g/dL</option>
          <option value="g/L">g/L</option>
        </select>
      </div>
      <p />

      <button onClick={handleReset}>Reset</button><p></p>

      {/* RESULTS — NOTHING SHOWS UNTIL REQUIRED FIELDS ARE FILLED */}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Anion Gap:</strong> {result.ag} mmol/L<br />
            <em>{result.agInterp}</em>
          </p>

          <p style={{ fontSize: "0.85em" }}>
            Formula: {result.usedK
              ? "AG = Na + K − (Cl + HCO₃)"
              : "AG = Na − (Cl + HCO₃)"}
          </p>

          {result.corrected !== null && (
            <p>
              <strong>Albumin-Corrected AG:</strong> {result.corrected} mmol/L<br />
              <em>{result.correctedInterp}</em>
              <br />
              <span style={{ fontSize: "0.85em" }}>
                Corrected AG = AG + 2.5 × (4 − albumin in g/dL)
              </span>
            </p>
          )}

          <p style={{ fontSize: "0.9em" }}>
            Normal AG:{" "}
            {result.usedK
              ? "12–16 mmol/L (with K⁺)"
              : "8–12 mmol/L (without K⁺)"}.
          </p>
        </div>
      )}
    </div>
  );
}
