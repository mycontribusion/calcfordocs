// src/calculators/MapCalculator.js
import { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function MapCalculator() {
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [mapResult, setMapResult] = useState("");
  const [ppResult, setPpResult] = useState("");
  const [formula, setFormula] = useState("");

  // Auto-calculate MAP and Pulse Pressure
  useEffect(() => {
    const sbpVal = parseFloat(sbp);
    const dbpVal = parseFloat(dbp);

    if (
      isNaN(sbpVal) ||
      isNaN(dbpVal) ||
      sbpVal <= 0 ||
      dbpVal <= 0 ||
      sbpVal < dbpVal
    ) {
      setMapResult("");
      setPpResult("");
      setFormula("");
      return;
    }

    // MAP calculation
    const map = dbpVal + (sbpVal - dbpVal) / 3;
    let mapCategory = "";
    if (map < 70) mapCategory = "Low MAP — May indicate poor perfusion";
    else if (map <= 100) mapCategory = "Normal MAP";
    else mapCategory = "High MAP — May indicate hypertension risk";

    // Pulse Pressure calculation
    const pp = sbpVal - dbpVal;
    let ppNote = pp >= 60 ? "⚠️ Wide pulse pressure (≥60 mmHg)" : "Normal pulse pressure";

    setFormula("MAP = DBP + (SBP − DBP) / 3");
    setMapResult(`Mean Arterial Pressure (MAP): ${map.toFixed(2)} mmHg — ${mapCategory}`);
    setPpResult(`Pulse Pressure (PP): ${pp.toFixed(2)} mmHg — ${ppNote}`);
  }, [sbp, dbp]);

  const reset = () => {
    setSbp("");
    setDbp("");
    setMapResult("");
    setPpResult("");
    setFormula("");
  };

  return (
    <div className="calc-container">
      <h2 className="calc-title">MAP & Pulse Pressure Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">Systolic BP (mmHg)</label>
        <input
          type="number"
          value={sbp}
          onChange={(e) => setSbp(e.target.value)}
          placeholder="e.g., 120"
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Diastolic BP (mmHg)</label>
        <input
          type="number"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          placeholder="e.g., 80"
          className="calc-input"
        />
      </div>

      <button
        onClick={reset}
        className="calc-btn-reset"
      >
        Reset
      </button>

      {(mapResult || ppResult) && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          {mapResult && <p style={{ fontWeight: "bold", marginBottom: 8 }}>{mapResult}</p>}
          {ppResult && <p style={{ fontWeight: "bold" }}>{ppResult}</p>}
          {formula && <p style={{ marginTop: "1rem", fontStyle: "italic", fontSize: '0.9rem', color: '#555', fontWeight: 'normal' }}>Formula used: {formula}</p>}
        </div>
      )}
    </div>
  );
}
