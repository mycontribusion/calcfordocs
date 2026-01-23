// src/calculators/MapCalculator.js
import { useState, useEffect } from "react";

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
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h2>MAP & Pulse Pressure Calculator</h2>

      <div style={{ marginTop: "0.5rem" }}>
        <label>Systolic BP (mmHg)</label><br />
        <input
          type="number"
          value={sbp}
          onChange={(e) => setSbp(e.target.value)}
          placeholder="e.g., 120"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label>Diastolic BP (mmHg)</label><br />
        <input
          type="number"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          placeholder="e.g., 80"
          style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}
        />
      </div>

      <button
        onClick={reset}
        style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Reset
      </button>

      {formula && <p style={{ marginTop: "1rem", fontStyle: "italic" }}>Formula used: {formula}</p>}
      {mapResult && <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{mapResult}</p>}
      {ppResult && <p style={{ marginTop: "0.25rem", fontWeight: "bold" }}>{ppResult}</p>}
    </div>
  );
}
