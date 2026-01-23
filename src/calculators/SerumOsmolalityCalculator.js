import { useState, useEffect } from "react";

/* ===================== HELPERS ===================== */

function parseRequired(v) {
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function glucoseToMmol(value, unit) {
  const n = parseRequired(value);
  if (n === null) return null;
  return unit === "mg/dL" ? n / 18 : n;
}

function ureaToMmol(value, unit) {
  const n = parseRequired(value);
  if (n === null) return null;
  return unit === "mg/dL" ? n / 2.8 : n;
}

function interpretOsm(osm) {
  if (osm < 275)
    return "Low osmolality (<275 mOsm/kg): suggests excess water (SIADH, polydipsia, adrenal insufficiency, severe hypothyroidism).";
  if (osm <= 295)
    return "Normal osmolality (275–295 mOsm/kg).";
  return "High osmolality (>295 mOsm/kg): suggests dehydration, hypernatremia, hyperglycemia, renal failure, mannitol, or toxic alcohols.";
}

/* ===================== COMPONENT ===================== */

export default function SerumOsmolalityCalculator() {
  const [na, setNa] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mmol/L");
  const [urea, setUrea] = useState("");
  const [ureaUnit, setUreaUnit] = useState("mmol/L");
  const [measured, setMeasured] = useState("");
  const [result, setResult] = useState(null);

  /* 🔄 AUTO CALCULATION */
  useEffect(() => {
    const naVal = parseRequired(na);
    const gluVal = glucoseToMmol(glucose, glucoseUnit);
    const ureaVal = ureaToMmol(urea, ureaUnit);

    // ❌ Do NOTHING until required fields exist
    if (naVal === null || gluVal === null || ureaVal === null) {
      setResult(null);
      return;
    }

    const osm = 2 * naVal + gluVal + ureaVal;
    const rounded = Number(osm.toFixed(1));

    const measVal = measured === "" ? null : Number(measured);
    const gap =
      measVal !== null ? Number((measVal - osm).toFixed(1)) : null;

    setResult({
      osmolality: rounded,
      gap,
      interpretation: interpretOsm(rounded),
    });
  }, [na, glucose, glucoseUnit, urea, ureaUnit, measured]);

  const handleReset = () => {
    setNa("");
    setGlucose("");
    setGlucoseUnit("mmol/L");
    setUrea("");
    setUreaUnit("mmol/L");
    setMeasured("");
    setResult(null);
  };

  return (
    <div>
      <h2>Serum Osmolality Calculator</h2>

      <label>Serum Sodium (mmol/L):</label><br />
      <input value={na} onChange={(e) => setNa(e.target.value)} placeholder="e.g., 140" />
      <p />

      <label>Serum Glucose:</label><br />
      <input value={glucose} onChange={(e) => setGlucose(e.target.value)} placeholder="e.g., 5.5" />
      <select value={glucoseUnit} onChange={(e) => setGlucoseUnit(e.target.value)}>
        <option value="mmol/L">mmol/L</option>
        <option value="mg/dL">mg/dL</option>
      </select>
      <p />

      <label>Serum Urea:</label><br />
      <input value={urea} onChange={(e) => setUrea(e.target.value)} placeholder="e.g., 5.0" />
      <select value={ureaUnit} onChange={(e) => setUreaUnit(e.target.value)}>
        <option value="mmol/L">mmol/L</option>
        <option value="mg/dL">mg/dL</option>
      </select>
      <p />

      <label>Measured Osmolality (optional):</label><br />
      <input value={measured} onChange={(e) => setMeasured(e.target.value)} placeholder="e.g., 290" />
      <p />

      <button onClick={handleReset}>Reset</button>

      {/* ✅ NOTHING renders until ALL required inputs are filled */}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Calculated Osmolality:</strong> {result.osmolality} mOsm/kg</p>

          {result.gap !== null && (
            <p><strong>Osmolal Gap:</strong> {result.gap} mOsm/kg</p>
          )}

          <p><strong>Interpretation:</strong> {result.interpretation}</p>

          <div style={{ marginTop: "10px", padding: "10px", borderRadius: "6px" }}>
            <strong>Formula:</strong><br />
            <code>2 × [Na⁺] + Glucose (mmol/L) + Urea (mmol/L)</code>
          </div>
        </div>
      )}
    </div>
  );
}
