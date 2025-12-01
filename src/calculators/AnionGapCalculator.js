import { useState } from "react";

export default function AnionGapCalculator() {
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");
  const [alb, setAlb] = useState("");
  const [albUnit, setAlbUnit] = useState("g/L"); // default unit
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // Convert albumin to g/dL
  function convertAlbuminToGdL(value, unit) {
    if (value === null) return null;

    switch (unit) {
      case "g/dL":
      case "g%":
        return value; // already g/dL
      case "g/L":
        return value / 10;
      case "mg/mL":
        return value / 100;
      default:
        return value;
    }
  }

  // Interpretation
  function interpretAG(value) {
    if (value < 8) return "Low Anion Gap";
    if (value <= 12) return "Normal Anion Gap";
    return "High (Elevated Anion Gap)";
  }

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const naVal = parseNum(na);
    const clVal = parseNum(cl);
    const hco3Val = parseNum(hco3);
    const albVal = alb === "" ? null : parseNum(alb);

    if (naVal === null) return setError("Enter valid Sodium (Na).");
    if (clVal === null) return setError("Enter valid Chloride (Cl).");
    if (hco3Val === null) return setError("Enter valid Bicarbonate (HCO₃⁻).");
    if (alb !== "" && albVal === null)
      return setError("Enter valid Albumin value or leave empty.");

    const ag = naVal - (clVal + hco3Val);
    const roundedAG = Number(ag.toFixed(1));

    let corrected = null;
    let correctedInterp = null;

    if (albVal !== null) {
      const albGdL = convertAlbuminToGdL(albVal, albUnit);
      corrected = ag + 2.5 * (4 - albGdL);
      corrected = Number(corrected.toFixed(1));
      correctedInterp = interpretAG(corrected);
    }

    setResult({
      ag: roundedAG,
      agInterp: interpretAG(roundedAG),
      corrected,
      correctedInterp,
    });
  }

  function handleReset() {
    setNa("");
    setCl("");
    setHco3("");
    setAlb("");
    setAlbUnit("g/dL");
    setError("");
    setResult(null);
  }

  return (
    <div>
      <h2>Anion Gap Calculator</h2>

      <form onSubmit={handleCalculate}>
        <div>
          <label>
            Serum Sodium (Na, mmol/L):
            <br />
            <input
              inputMode="decimal"
              value={na}
              onChange={(e) => setNa(e.target.value)}
              placeholder="e.g., 140"
            />
          </label>
        </div>
        <p />

        <div>
          <label>
            Serum Chloride (Cl, mmol/L):
            <br />
            <input
              inputMode="decimal"
              value={cl}
              onChange={(e) => setCl(e.target.value)}
              placeholder="e.g., 100"
            />
          </label>
        </div>
        <p />

        <div>
          <label>
            Serum Bicarbonate (HCO₃⁻, mmol/L):
            <br />
            <input
              inputMode="decimal"
              value={hco3}
              onChange={(e) => setHco3(e.target.value)}
              placeholder="e.g., 24"
            />
          </label>
        </div>
        <p />

        <div>
          <label>
            Albumin (optional):
            <br />
            <input
              inputMode="decimal"
              value={alb}
              onChange={(e) => setAlb(e.target.value)}
              placeholder="e.g., 40 or 3.5"
              style={{ width: "120px", marginRight: "8px" }}
            />
            <select
              value={albUnit}
              onChange={(e) => setAlbUnit(e.target.value)}
            >
              <option value="g/dL">g/dL</option>
              <option value="g/L">g/L</option>
            </select>
          </label>
        </div>

        <p />

        <div>
          <button type="submit">Calculate</button>{" "}
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <p />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div>
          <p>
            <strong>Anion Gap:</strong> {result.ag} mmol/L <br />
            <em>{result.agInterp}</em>
            <br />
            {/* Formula added */}
            <span style={{ fontSize: "0.85em" }}>
              Formula: AG = Na − (Cl + HCO₃)
            </span>
          </p>

          {result.corrected !== null && (
            <p>
              <strong>Albumin-Corrected AG:</strong> {result.corrected} mmol/L
              <br />
              <em>{result.correctedInterp}</em>
              <br />
              {/* Formula added */}
              <span style={{ fontSize: "0.85em" }}>
                Formula: Corrected AG = AG + 2.5 × (4 − albumin in g/dL)
              </span>
            </p>
          )}

          <p style={{ fontSize: "0.9em" }}>
            Normal AG ≈ 8–12 mmol/L.  
            Low albumin can hide a high AG — corrected AG unmasks this.
          </p>
        </div>
      )}
    </div>
  );
}
