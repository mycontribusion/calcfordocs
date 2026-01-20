import { useState } from "react";

export default function CorrectedSodium() {
  const [sodium, setSodium] = useState("");
  const [glucose, setGlucose] = useState("");
  const [glucoseUnit, setGlucoseUnit] = useState("mg"); // mg/dL or mmol/L
  const [result, setResult] = useState("");

  function calculateCorrectedNa() {
    const na = parseFloat(sodium);
    let glu = parseFloat(glucose);

    if (isNaN(na) || isNaN(glu)) {
      setResult("Please enter valid numerical values for both sodium and glucose.");
      return;
    }

    // Convert glucose to mg/dL if input is in mmol/L
    if (glucoseUnit === "mmol") {
      glu = glu * 18.0182;
    }

    // Corrected Sodium formula (mg/dL glucose)
    // 1.6 mEq/L increase per 100 mg/dL glucose above 100
    const correctedNa = na + 1.6 * ((glu - 100) / 100);

    setResult(`Corrected Sodium: ${correctedNa.toFixed(2)} mEq/L`);
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h2>Corrected Sodium Calculator</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Measured Sodium (mmol/L):</label><br />
        <input
          type="number"
          value={sodium}
          onChange={(e) => setSodium(e.target.value)}
          placeholder="e.g., 135"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Blood Glucose:</label><br />
        <input
          type="number"
          value={glucose}
          onChange={(e) => setGlucose(e.target.value)}
          placeholder="e.g., 300"
          style={{ width: "70%", padding: "0.25rem", marginTop: "0.25rem", marginRight: "0.5rem" }}
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

      <button
        onClick={calculateCorrectedNa}
        style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", cursor: "pointer" }}
      >
        Calculate
      </button>

      {result && (
        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", fontWeight: "bold" }}>{result}</p>
      )}
    </div>
  );
}
