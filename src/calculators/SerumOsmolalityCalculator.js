import { useState } from "react";

export default function SerumOsmolalityCalculator() {
  const [na, setNa] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mmol/L");
  const [urea, setUrea] = useState("");
  const [ureaUnit, setUreaUnit] = useState("mmol/L");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function glucoseToMmol(val, unit) {
    const n = parseNum(val);
    if (n === null) return null;
    return unit === "mg/dL" ? n / 18 : n;
  }

  function ureaToMmol(val, unit) {
    const n = parseNum(val);
    if (n === null) return null;
    return unit === "mg/dL" ? n / 2.8 : n;
  }

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const naVal = parseNum(na);
    if (naVal === null) {
      setError("Please enter a valid Serum Sodium (Na) value.");
      return;
    }

    const gluVal = glucoseToMmol(glucose, glucoseUnit) ?? 0;
    const ureaVal = ureaToMmol(urea, ureaUnit) ?? 0;

    const osmolality = 2 * naVal + gluVal + ureaVal;
    const rounded = Number(osmolality.toFixed(1));

    setResult({
      osmolality: rounded,
      gluText:
        glucose !== ""
          ? `Glucose converted: ${glucose} ${glucoseUnit} → ${gluVal.toFixed(2)} mmol/L`
          : "Glucose not provided (treated as 0 mmol/L).",
      ureaText:
        urea !== ""
          ? `Urea converted: ${urea} ${ureaUnit} → ${ureaVal.toFixed(2)} mmol/L`
          : "Urea not provided (treated as 0 mmol/L).",
    });
  }

  function handleReset() {
    setNa("");
    setGlucose("");
    setGlucoseUnit("mmol/L");
    setUrea("");
    setUreaUnit("mmol/L");
    setError("");
    setResult(null);
  }

  return (
    <div>
      <h2>Serum Osmolality Calculator</h2>

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
            Serum Glucose
            <br />
            <input
              inputMode="decimal"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="e.g., 5.5"
            />
            <br />
            <select
              value={glucoseUnit}
              onChange={(e) => setGlucoseUnit(e.target.value)}
            >
              <option value="mmol/L">mmol/L</option>
              <option value="mg/dL">mg/dL</option>
            </select>
          </label>
        </div>
        <p></p>

        <div>
          <label>
            Serum Urea (BUN)
            <br />
            <input
              inputMode="decimal"
              value={urea}
              onChange={(e) => setUrea(e.target.value)}
              placeholder="e.g., 5.0"
            />
            <br />
            <select value={ureaUnit} onChange={(e) => setUreaUnit(e.target.value)}>
              <option value="mmol/L">mmol/L</option>
              <option value="mg/dL">mg/dL</option>
            </select>
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
            <strong>Calculated Osmolality:</strong> {result.osmolality} mOsm/kg
          </p>

          <p>
            <em>Formula: Osm = 2 × Na + Glucose + Urea (all in mmol/L)</em>
          </p>
        </div>
      )}
    </div>
  );
}
