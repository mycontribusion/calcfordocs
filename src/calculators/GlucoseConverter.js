import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  glucose: "",
  glucoseUnit: "mg/dL", // Standardized: was "mg"
  type: "random", // fasting or random
  result: null,
};

export default function GlucoseConverter() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);
  const factor = 18.0182; // 1 mmol/L = 18.0182 mg/dL
  const roundTo1Decimal = (num) => Math.round(num * 10) / 10;

  useEffect(() => {
    const { glucose, glucoseUnit, type } = values;
    if (!glucose || !glucoseUnit || !type) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const val = parseFloat(glucose);
    if (isNaN(val) || val <= 0) {
      updateFields({ result: { error: "Please enter a valid glucose level." } });
      return;
    }

    let convertedValue, displayUnit, category, categoryColor;

    if (glucoseUnit === "mg/dL") {
      convertedValue = roundTo1Decimal(val / factor);
      displayUnit = "mmol/L";
    } else {
      convertedValue = roundTo1Decimal(val * factor);
      displayUnit = "mg/dL";
    }

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

    const ranges =
      displayUnit === "mg/dL"
        ? type === "fasting"
          ? { Hypoglycemia: "<70", Normal: "70–100", Prediabetes: "101–125", Diabetes: "≥126" }
          : { Hypoglycemia: "<70", Normal: "70–139", Prediabetes: "140–199", Diabetes: "≥200" }
        : type === "fasting"
          ? { Hypoglycemia: "<3.9", Normal: "3.9–5.6", Prediabetes: "5.7–6.9", Diabetes: "≥7.0" }
          : { Hypoglycemia: "<3.9", Normal: "3.9–7.7", Prediabetes: "7.8–11.0", Diabetes: "≥11.1" };

    updateFields({
      result: {
        convertedValue: convertedValue.toFixed(1),
        displayUnit,
        category,
        categoryColor,
        typeLabel: type === "fasting" ? "Fasting" : "Random",
        ranges,
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.glucose, values.glucoseUnit, values.type]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Glucose Value:</label>
        <SyncSuggestion field="glucose" suggestion={suggestions.glucose} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.glucose}
            onChange={(e) => setField("glucose", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.glucoseUnit} onChange={(e) => setField("glucoseUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Type:</label>
        <select value={values.type} onChange={(e) => setField("type", e.target.value)} className="calc-select">
          <option value="fasting">Fasting</option>
          <option value="random">Random</option>
        </select>
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          {values.result.error ? (
            <p style={{ color: "#ef4444" }}>{values.result.error}</p>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem' }}>Conversion Formula: 1 mmol/L = 18.0182 mg/dL</p>
              <p style={{ marginTop: 8 }}>
                Converted Value: {values.result.convertedValue} {values.result.displayUnit}{" "}
                <strong style={{ color: values.result.categoryColor }}>({values.result.category})</strong>
              </p>
              <div style={{ marginTop: 12, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 8, borderRadius: 4 }}>
                <p className="calc-label">Reference Ranges ({values.result.typeLabel}):</p>
                <ul style={{ listStyle: "none", paddingLeft: 0, margin: '4px 0 0' }}>
                  {Object.entries(values.result.ranges).map(([key, val]) => (
                    <li
                      key={key}
                      style={{ color: key === values.result.category ? values.result.categoryColor : "#0369a1", fontWeight: key === values.result.category ? 'bold' : 'normal' }}
                    >
                      {key}: {val} {values.result.displayUnit}
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
