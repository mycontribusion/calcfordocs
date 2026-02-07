import { useState, useEffect } from "react";
import "./CalculatorShared.css";

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
    <div className="calc-container">
      <h2 className="calc-title">Serum Osmolality Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">Serum Sodium (mmol/L):</label>
        <input value={na} onChange={(e) => setNa(e.target.value)} placeholder="e.g., 140" className="calc-input" />
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Glucose:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={glucose} onChange={(e) => setGlucose(e.target.value)} placeholder="e.g., 5.5" className="calc-input" style={{ flex: 2 }} />
          <select value={glucoseUnit} onChange={(e) => setGlucoseUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mmol/L">mmol/L</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Urea:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={urea} onChange={(e) => setUrea(e.target.value)} placeholder="e.g., 5.0" className="calc-input" style={{ flex: 2 }} />
          <select value={ureaUnit} onChange={(e) => setUreaUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mmol/L">mmol/L</option>
            <option value="mg/dL">mg/dL</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Measured Osmolality (optional):</label>
        <input value={measured} onChange={(e) => setMeasured(e.target.value)} placeholder="e.g., 290" className="calc-input" />
      </div>

      <button onClick={handleReset} className="calc-btn-reset">Reset</button>

      {/* ✅ NOTHING renders until ALL required inputs are filled */}
      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Calculated Osmolality:</strong> {result.osmolality} mOsm/kg</p>

          {result.gap !== null && (
            <p><strong>Osmolal Gap:</strong> {result.gap} mOsm/kg</p>
          )}

          <p><strong>Interpretation:</strong> {result.interpretation}</p>

          <div style={{ marginTop: "10px", padding: "10px", borderRadius: "6px", background: '#f5f5f5', border: '1px solid #ddd', fontSize: '0.9rem', color: '#555', textAlign: 'center', fontWeight: 'normal' }}>
            <strong>Formula:</strong><br />
            <code>2 × [Na⁺] + Glucose (mmol/L) + Urea (mmol/L)</code>
          </div>
        </div>
      )}
    </div>
  );
}
