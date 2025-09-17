import { useState } from "react";

export default function AnionGapCalculator() {
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const naVal = parseNum(na);
    const clVal = parseNum(cl);
    const hco3Val = parseNum(hco3);

    if (naVal === null) {
      setError("Enter valid Sodium (Na) value.");
      return;
    }
    if (clVal === null) {
      setError("Enter valid Chloride (Cl) value.");
      return;
    }
    if (hco3Val === null) {
      setError("Enter valid Bicarbonate (HCO₃⁻) value.");
      return;
    }

    const ag = naVal - (clVal + hco3Val);
    const rounded = Number(ag.toFixed(1));

    setResult({
      ag: rounded,
    });
  }

  function handleReset() {
    setNa("");
    setCl("");
    setHco3("");
    setError("");
    setResult(null);
  }

  return (
    <div>
      <h2>Anion Gap Calculator</h2>

      <form onSubmit={handleCalculate}>
        <div>
          <label>
            Serum Sodium (Na, mmol/L)
            <br />
            <input
              inputMode="decimal"
              value={na}
              onChange={(e) => setNa(e.target.value)}
              placeholder="e.g., 140"
            />
          </label>
        </div>
        <p></p>

        <div>
          <label>
            Serum Chloride (Cl, mmol/L)
            <br />
            <input
              inputMode="decimal"
              value={cl}
              onChange={(e) => setCl(e.target.value)}
              placeholder="e.g., 100"
            />
          </label>
        </div>
        <p></p>

        <div>
          <label>
            Serum Bicarbonate (HCO₃⁻, mmol/L)
            <br />
            <input
              inputMode="decimal"
              value={hco3}
              onChange={(e) => setHco3(e.target.value)}
              placeholder="e.g., 24"
            />
          </label>
        </div>
        <p></p>

        <div>
          <button type="submit">Calculate</button>{" "}
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <p></p>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div>
          <p>
            <strong>Anion Gap:</strong> {result.ag} mmol/L
          </p>
          <p>
            <em>Formula: AG = Na − (Cl + HCO₃⁻)</em>
          </p>
          <p style={{ fontSize: "0.95em" }}>
            Normal anion gap ≈ 8–12 mmol/L (some labs use up to ~16). Elevated gap suggests unmeasured anions (lactate, ketones, toxins).
          </p>
        </div>
      )}
    </div>
  );
}
