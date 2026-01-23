// src/calculators/ShockIndex.js
import { useState, useEffect } from "react";

export default function ShockIndex() {
  const [heartRate, setHeartRate] = useState("");
  const [systolicBP, setSystolicBP] = useState("");
  const [result, setResult] = useState("");

  // Auto-calculate Shock Index
  useEffect(() => {
    const hr = parseFloat(heartRate);
    const sbp = parseFloat(systolicBP);

    if (isNaN(hr) || hr <= 0 || isNaN(sbp) || sbp <= 0) {
      setResult("");
      return;
    }

    const si = hr / sbp;
    let interpretation = "";

    if (si < 0.5) interpretation = "Below normal – may indicate bradycardia or high BP";
    else if (si >= 0.5 && si <= 0.7) interpretation = "Normal Shock Index";
    else if (si > 0.7 && si < 1) interpretation = "Borderline – monitor patient closely";
    else interpretation = "High Shock Index – suggestive of shock or severe instability";

    setResult(`Shock Index: ${si.toFixed(2)} → ${interpretation}`);
  }, [heartRate, systolicBP]);

  const reset = () => {
    setHeartRate("");
    setSystolicBP("");
    setResult("");
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h2>Shock Index Calculator</h2>

      {/* Heart Rate */}
      <div style={{ marginTop: "0.5rem" }}>
        <label>Heart Rate (bpm):</label><br />
        <input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="e.g., 80"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      {/* Systolic BP */}
      <div style={{ marginTop: "0.5rem" }}>
        <label>Systolic BP (mmHg):</label><br />
        <input
          type="number"
          value={systolicBP}
          onChange={(e) => setSystolicBP(e.target.value)}
          placeholder="e.g., 120"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Reset
      </button>

      {/* Result */}
      {result && <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{result}</p>}
    </div>
  );
}
