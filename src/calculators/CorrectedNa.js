import React, { useState, useEffect, useCallback } from "react";

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
      color = "orange";
    } else if (roundedNa > NORMAL_HIGH) {
      status = "Hypernatremia";
      color = "red";
    } else {
      status = "Within normal range";
      color = "green";
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
    <div
      style={{
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
      }}
    >
      <h2>Corrected Sodium Calculator</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Measured Sodium (mmol/L):</label>
        <input
          type="number"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          placeholder="e.g., 135"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Blood Glucose:</label>
        <input
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          placeholder="e.g., 300"
          style={{ width: "70%", padding: "0.25rem", marginRight: "0.5rem" }}
        />
        <select
          value={glucoseUnit}
          onChange={(e) => setGlucoseUnit(e.target.value)}
          style={{ padding: "0.25rem" }}
        >
          <option value="mg">mg/dL</option>
          <option value="mmol">mmol/L</option>
        </select>
      </div>

      <button onClick={reset} style={{ padding: "0.5rem 1rem" }}>
        Reset
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          <p style={{ fontWeight: "bold" }}>{result}</p>

          {interpretation && (
            <>
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
            </>
          )}
        </div>
      )}

      {/* Formula note */}
      {result && (
        <div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
          <strong>Formula:</strong> Corrected Na = Measured Na + 1.6 ×
          ((Glucose [mg/dL] − 100) ÷ 100)
          <br />
          <em>
            If glucose is in mmol/L, convert to mg/dL first: Glucose × 18.0182
          </em>
        </div>
      )}

      {/* Note */}
      {!result && note && (
        <p style={{ color: "brown", marginTop: "0.5rem" }}>
          <strong>{note}</strong>
        </p>
      )}
    </div>
  );
}
