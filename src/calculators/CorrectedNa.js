import React, { useState, useEffect, useCallback } from "react";
import "./CalculatorShared.css";

export default function CorrectedSodium() {
  const [sodium, setSodium] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mmol"); // mg/dL or mmol/L
  const [result, setResult] = useState("");
  const [note, setNote] = useState("");
  const [interpretation, setInterpretation] = useState(null);

  const NORMAL_LOW = 135;
  const NORMAL_HIGH = 145;

  const calculateCorrectedNa = useCallback(() => {
    const na = parseFloat(sodium);
    let glu = parseFloat(glucose);

    if (isNaN(na) || isNaN(glu)) {
      setResult("");
      setInterpretation(null);
      setNote("Please enter valid numerical values for both sodium and glucose.");
      return;
    }

    setNote("");

    // Convert glucose to mg/dL if input is in mmol/L
    if (glucoseUnit === "mmol") {
      glu = glu * 18.0182;
    }

    // Corrected Sodium formula
    const correctedNa = na + 1.6 * ((glu - 100) / 100);
    const roundedNa = parseFloat(correctedNa.toFixed(2));

    setResult(`Corrected Sodium: ${roundedNa} mmol/L`);

    // Interpretation
    let status = "";
    let color = "";

    if (roundedNa < NORMAL_LOW) {
      status = "Hyponatremia";
      color = "#d97706"; // orange-600
    } else if (roundedNa > NORMAL_HIGH) {
      status = "Hypernatremia";
      color = "#dc2626"; // red-600
    } else {
      status = "Within normal range";
      color = "#16a34a"; // green-600
    }

    setInterpretation({
      value: roundedNa,
      status,
      color,
      normalRange: `${NORMAL_LOW}–${NORMAL_HIGH} mmol/L`,
    });
  }, [sodium, glucose, glucoseUnit]);

  useEffect(() => {
    if (sodium !== "" && glucose !== "") {
      calculateCorrectedNa();
    } else {
      setResult("");
      setInterpretation(null);
      setNote("");
    }
  }, [sodium, glucose, glucoseUnit, calculateCorrectedNa]);

  const reset = () => {
    setSodium("");
    setGlucose("");
    setGlucoseUnit("mg");
    setResult("");
    setInterpretation(null);
    setNote("");
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Measured Sodium (mmol/L):</label>
        <input
          type="number"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          placeholder="e.g., 135"
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Blood Glucose:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="e.g., 300"
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={glucoseUnit}
            onChange={(e) => setGlucoseUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="mg">mg/dL</option>
            <option value="mmol">mmol/L</option>
          </select>
        </div>
      </div>

      <button onClick={reset} className="calc-btn-reset">
        Reset
      </button>

      {/* Result */}
      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p style={{ fontWeight: "bold", fontSize: '1.1rem' }}>{result}</p>

          {interpretation && (
            <div style={{ marginTop: 8 }}>
              <p>
                Status:{" "}
                <strong style={{ color: interpretation.color }}>
                  {interpretation.status}
                </strong>
              </p>
              <p>
                Normal range:{" "}
                <strong>{interpretation.normalRange}</strong>
              </p>
            </div>
          )}

          {/* Formula note */}
          <div style={{ fontSize: "0.85rem", marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8 }}>
            <strong>Formula:</strong> Corrected Na = Measured Na + 1.6 ×
            ((Glucose [mg/dL] − 100) ÷ 100)
            <br />
            <em style={{ opacity: 0.8 }}>
              If glucose is in mmol/L, convert to mg/dL first: Glucose × 18.0182
            </em>
          </div>
        </div>
      )}

      {/* Note */}
      {!result && note && (
        <p style={{ color: "#b91c1c", marginTop: 16, background: '#fee2e2', padding: 8, borderRadius: 4 }}>
          <strong>{note}</strong>
        </p>
      )}
    </div>
  );
}
