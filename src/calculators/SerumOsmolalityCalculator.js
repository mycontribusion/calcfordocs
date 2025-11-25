import { useState } from "react";

export default function SerumOsmolalityCalculator() {
  const [na, setNa] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mmol/L");
  const [urea, setUrea] = useState("");
  const [ureaUnit, setUreaUnit] = useState("mmol/L");
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

  function interpretOsm(osm) {
    if (osm < 275) {
      return "Low osmolality (<275 mOsm/kg): suggests excess water (SIADH, polydipsia, adrenal insufficiency, severe hypothyroidism).";
    } else if (osm <= 295) {
      return "Normal osmolality (275–295 mOsm/kg).";
    } else {
      return "High osmolality (>295 mOsm/kg): suggests dehydration, hypernatremia, hyperglycemia, renal failure, mannitol, or toxic alcohols.";
    }
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
      interpretation: interpretOsm(rounded),
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
    <div>
      <h2>Serum Osmolality Calculator</h2>

      <form onSubmit={handleCalculate}>
        <label>Serum Sodium (mmol/L)</label>
        <input
          inputMode="decimal"
          value={na}
          onChange={(e) => setNa(e.target.value)}
          placeholder="e.g., 140"
        />
        <p></p>

        <label>Serum Glucose</label>
        <div>
          <input
            inputMode="decimal"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="e.g., 5.5"
          />
          <select
            value={glucoseUnit}
            onChange={(e) => setGlucoseUnit(e.target.value)}
          >
            <option value="mmol/L">mmol/L</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>
        <p></p>

        <label>Serum Urea</label>
        <div>
          <input
            inputMode="decimal"
            value={urea}
            onChange={(e) => setUrea(e.target.value)}
            placeholder="e.g., 5.0"
          />
          <select
            value={ureaUnit}
            onChange={(e) => setUreaUnit(e.target.value)}
          >
            <option value="mmol/L">mmol/L</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>
        <p></p>

        <button type="submit">Calculate</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>
      <p></p>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
  <div>
    <p>
      <strong>Calculated Osmolality:</strong> {result.osmolality} mOsm/kg
    </p>

    <p>
      <strong>Interpretation:</strong> {result.interpretation}
    </p>

    <div style={{ 
      marginTop: "15px", 
      padding: "10px", 
      background: "#f8f8f8", 
      borderRadius: "6px", 
      fontSize: "0.9rem" 
    }}>
      <strong>Formula Used:</strong>
      <br />
      Calculated Osmolality = <br />
      <code>2 × [Na⁺] + Glucose (mmol/L) + Urea (mmol/L)</code>
      <br /><br />
    </div>
  </div>
)}

    </div>
  );
}
