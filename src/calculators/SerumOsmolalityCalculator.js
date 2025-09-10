import { useState } from "react";
//import "./SerumOsmolalityCalculator.css";

export default function SerumOsmolalityCalculator() {
  const [na, setNa] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mmol/L"); // default mmol/L
  const [urea, setUrea] = useState("");
  const [ureaUnit, setUreaUnit] = useState("mmol/L"); // default mmol/L
  const [measured, setMeasured] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function parsePositiveNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }

  // convert glucose to mmol/L
  function glucoseToMmol(value, unit) {
    const n = parsePositiveNumber(value);
    if (n === null) return null;
    return unit === "mg/dL" ? n / 18 : n;
  }

  // convert urea to mmol/L
  function ureaToMmol(value, unit) {
    const n = parsePositiveNumber(value);
    if (n === null) return null;
    return unit === "mg/dL" ? n / 2.8 : n;
  }

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const naVal = parsePositiveNumber(na);
    const gluVal = glucoseToMmol(glucose, glucoseUnit);
    const ureaVal = ureaToMmol(urea, ureaUnit);
    const measVal = parsePositiveNumber(measured);

    if (naVal === null) {
      setError("Enter valid sodium value.");
      return;
    }
    if (gluVal === null) {
      setError("Enter valid glucose value.");
      return;
    }
    if (ureaVal === null) {
      setError("Enter valid urea (BUN) value.");
      return;
    }

    const osmolality = 2 * naVal + gluVal + ureaVal;
    const rounded = Number(osmolality.toFixed(1));

    let gap = null;
    if (measVal !== null) {
      gap = Number((measVal - osmolality).toFixed(1));
    }

    setResult({
      osmolality: rounded,
      gap,
    });
  }

  function handleReset() {
    setNa("");
    setGlucose("");
    setGlucoseUnit("mmol/L");
    setUrea("");
    setUreaUnit("mmol/L");
    setMeasured("");
    setResult(null);
    setError("");
  }

  return (
    <div className="osm-card">
      <h2 className="osm-title">Serum Osmolality Calculator</h2>

      <form className="osm-form" onSubmit={handleCalculate}>
        <label className="label">Serum Sodium (mmol/L)</label>
        <input
          className="input-field"
          inputMode="decimal"
          value={na}
          onChange={(e) => setNa(e.target.value)}
          placeholder="e.g., 140"
        />

        <label className="label">Serum Glucose</label>
        <div className="row">
          <input
            className="input-field"
            inputMode="decimal"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="e.g., 5.5"
          />
          <select
            className="select-field"
            value={glucoseUnit}
            onChange={(e) => setGlucoseUnit(e.target.value)}
          >
            <option value="mmol/L">mmol/L (default)</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>

        <label className="label">Serum Urea (BUN)</label>
        <div className="row">
          <input
            className="input-field"
            inputMode="decimal"
            value={urea}
            onChange={(e) => setUrea(e.target.value)}
            placeholder="e.g., 5.0"
          />
          <select
            className="select-field"
            value={ureaUnit}
            onChange={(e) => setUreaUnit(e.target.value)}
          >
            <option value="mmol/L">mmol/L (default)</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>

        <label className="label">Measured Osmolality (optional, mOsm/kg)</label>
        <input
          className="input-field"
          inputMode="decimal"
          value={measured}
          onChange={(e) => setMeasured(e.target.value)}
          placeholder="e.g., 290"
        />

        <div className="actions">
          <button type="submit" className="button">Calculate</button>
          <button type="button" className="button secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {error && <div className="result-box danger">{error}</div>}

      {result && (
        <div className="result-box success">
          <div><strong>Calculated Osmolality:</strong> {result.osmolality} mOsm/kg</div>
          {result.gap !== null && (
            <div style={{marginTop:6}}>
              <strong>Osmolal Gap:</strong> {result.gap} mOsm/kg
              <div style={{fontSize:13, marginTop:4}}>
                Normal osmolal gap ≈ -10 to +10. Larger gap suggests unmeasured osmoles (e.g. ethanol, methanol, ethylene glycol).
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
