// src/calculators/ShockIndex.js
import { useState, useEffect } from "react";
import "./CalculatorShared.css";

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
    <div className="calc-container">

      {/* Heart Rate */}
      <div className="calc-box">
        <label className="calc-label">Heart Rate (bpm):</label>
        <input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="e.g., 80"
          className="calc-input"
        />
      </div>

      {/* Systolic BP */}
      <div className="calc-box">
        <label className="calc-label">Systolic BP (mmHg):</label>
        <input
          type="number"
          value={systolicBP}
          onChange={(e) => setSystolicBP(e.target.value)}
          placeholder="e.g., 120"
          className="calc-input"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="calc-btn-reset"
      >
        Reset
      </button>

      {/* Result */}
      {result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
