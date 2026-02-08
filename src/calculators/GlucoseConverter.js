import { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function GlucoseConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("mg"); // mg/dL or mmol/L
  const [type, setType] = useState("random"); // fasting or random
  const [result, setResult] = useState(null);

  const factor = 18.0182; // 1 mmol/L = 18.0182 mg/dL

  const roundTo1Decimal = (num) => Math.round(num * 10) / 10;

  // 🔄 Auto-calculation
  useEffect(() => {
    if (!value || !unit || !type) {
      setResult(null);
      return;
    }

    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) {
      setResult({ error: "Please enter a valid glucose level." });
      return;
    }

    let convertedValue, displayUnit, category, categoryColor;

    // Conversion
    if (unit === "mg") {
      convertedValue = roundTo1Decimal(val / factor);
      displayUnit = "mmol/L";
    } else {
      convertedValue = roundTo1Decimal(val * factor);
      displayUnit = "mg/dL";
    }

    // Determine category
    if (displayUnit === "mg/dL") {
      if (type === "fasting") {
        if (convertedValue < 70) { category = "Hypoglycemia"; categoryColor = "#ef4444"; }
        else if (convertedValue <= 100) { category = "Normal"; categoryColor = "#16a34a"; }
        else if (convertedValue < 126) { category = "Prediabetes"; categoryColor = "#ea580c"; }
        else { category = "Diabetes"; categoryColor = "#dc2626"; }
      } else {
        if (convertedValue < 70) { category = "Hypoglycemia"; categoryColor = "#ef4444"; }
        else if (convertedValue < 140) { category = "Normal"; categoryColor = "#16a34a"; }
        else if (convertedValue < 200) { category = "Prediabetes"; categoryColor = "#ea580c"; }
        else { category = "Diabetes"; categoryColor = "#dc2626"; }
      }
    } else {
      // mmol/L ranges
      if (type === "fasting") {
        if (convertedValue < 3.9) { category = "Hypoglycemia"; categoryColor = "#ef4444"; }
        else if (convertedValue <= 5.6) { category = "Normal"; categoryColor = "#16a34a"; }
        else if (convertedValue < 7.0) { category = "Prediabetes"; categoryColor = "#ea580c"; }
        else { category = "Diabetes"; categoryColor = "#dc2626"; }
      } else {
        if (convertedValue < 3.9) { category = "Hypoglycemia"; categoryColor = "#ef4444"; }
        else if (convertedValue < 7.8) { category = "Normal"; categoryColor = "#16a34a"; }
        else if (convertedValue < 11.1) { category = "Prediabetes"; categoryColor = "#ea580c"; }
        else { category = "Diabetes"; categoryColor = "#dc2626"; }
      }
    }

    // Reference ranges based on display unit
    const ranges =
      displayUnit === "mg/dL"
        ? type === "fasting"
          ? { Hypoglycemia: "<70", Normal: "70–100", Prediabetes: "101–125", Diabetes: "≥126" }
          : { Hypoglycemia: "<70", Normal: "70–139", Prediabetes: "140–199", Diabetes: "≥200" }
        : type === "fasting"
          ? { Hypoglycemia: "<3.9", Normal: "3.9–5.6", Prediabetes: "5.7–6.9", Diabetes: "≥7.0" }
          : { Hypoglycemia: "<3.9", Normal: "3.9–7.7", Prediabetes: "7.8–11.0", Diabetes: "≥11.1" };

    setResult({
      convertedValue,
      displayUnit,
      category,
      categoryColor,
      typeLabel: type === "fasting" ? "Fasting" : "Random",
      ranges,
    });
  }, [value, unit, type]);

  // 🔄 Reset button
  const handleReset = () => {
    setValue("");
    setUnit("mg");
    setType("random");
    setResult(null);
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Glucose Value:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mg">mg/dL</option>
            <option value="mmol">mmol/L</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="calc-select">
          <option value="fasting">Fasting</option>
          <option value="random">Random</option>
        </select>
      </div>

      <button onClick={handleReset} className="calc-btn-reset">Reset</button>

      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          {result.error ? (
            <p style={{ color: "#ef4444" }}>{result.error}</p>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem' }}>Conversion Formula: 1 mmol/L = 18.0182 mg/dL</p>
              <p style={{ marginTop: 8 }}>
                Converted Value: {result.convertedValue} {result.displayUnit}{" "}
                <strong style={{ color: result.categoryColor }}>({result.category})</strong>
              </p>
              <div style={{ marginTop: 12, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 8, borderRadius: 4 }}>
                <p className="calc-label">Reference Ranges ({result.typeLabel}):</p>
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: '4px 0 0' }}>
                  {Object.entries(result.ranges).map(([key, val]) => (
                    <li
                      key={key}
                      style={{ color: key === result.category ? result.categoryColor : "#0369a1", fontWeight: key === result.category ? 'bold' : 'normal' }}
                    >
                      {key}: {val} {result.displayUnit}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
