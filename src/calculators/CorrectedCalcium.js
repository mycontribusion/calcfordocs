import React, { useState, useEffect } from "react";

function CorrectedCalcium() {
  const [calcium, setCalcium] = useState("");
  const [calciumUnit, setCalciumUnit] = useState("mmol/L");
  const [albumin, setAlbumin] = useState("");
  const [albuminUnit, setAlbuminUnit] = useState("g/L");

  const [result, setResult] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  // Helper to parse positive numbers
  const parseRequired = (v) => {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  // Auto-calc when calcium + albumin are filled
  useEffect(() => {
    const caVal = parseRequired(calcium);
    const albVal = parseRequired(albumin);

    if (caVal === null || albVal === null) {
      setResult(null);
      setInterpretation("");
      return;
    }

    let ca = caVal;
    let alb = albVal;

    // Convert calcium to mg/dL for calculation if needed
    if (calciumUnit === "mmol/L") ca = ca * 4.0;

    // Convert albumin to g/dL for calculation
    if (albuminUnit === "g/L") alb = alb / 10;

    // Corrected calcium formula (mg/dL)
    let correctedCa = ca + 0.8 * (4 - alb);

    // Interpretation
    let interp = "";
    if (correctedCa < 8.5) interp = "Low (Hypocalcemia)";
    else if (correctedCa > 10.5) interp = "High (Hypercalcemia)";
    else interp = "Normal";

    // Convert back to user's calcium unit for display
    if (calciumUnit === "mmol/L") correctedCa = correctedCa / 4.0;

    setResult(correctedCa.toFixed(2));
    setInterpretation(interp);
  }, [calcium, calciumUnit, albumin, albuminUnit]);

  const reset = () => {
    setCalcium("");
    setCalciumUnit("mg/dL");
    setAlbumin("");
    setAlbuminUnit("g/dL");
    setResult(null);
    setInterpretation("");
  };

  return (
    <div>
      <h2>Corrected Calcium Calculator</h2>

      <div>
        <label>Calcium:</label><br />
        <input
          type="number"
          value={calcium}
          onChange={(e) => setCalcium(e.target.value)}
          placeholder="Enter calcium"
        />
        <select value={calciumUnit} onChange={(e) => setCalciumUnit(e.target.value)}>
          <option value="mg/dL">mg/dL</option>
          <option value="mmol/L">mmol/L</option>
        </select>
      </div>

      <div>
        <p></p>
        <label>Albumin:</label><br />
        <input
          type="number"
          value={albumin}
          onChange={(e) => setAlbumin(e.target.value)}
          placeholder="Enter albumin"
        />
        <select value={albuminUnit} onChange={(e) => setAlbuminUnit(e.target.value)}>
          <option value="g/dL">g/dL</option>
          <option value="g/L">g/L</option>
        </select>
      </div>

      <div>
        <p></p>
        <button onClick={reset}>Reset</button>
      </div>

      {/* Show result only when both required inputs exist */}
      {result !== null && (
        <div>
          <p>
            <strong>Corrected Calcium:</strong> {result} {calciumUnit} ({interpretation})
          </p>

          <p>Corrected Ca (mg/dL) = Measured Ca + 0.8 × (4.0 − Albumin in g/dL)</p>

          <p><strong>Normal Ranges:</strong></p>
          <ul style={{ textAlign: "left" }}>
            <li>Total Calcium (mg/dL): 8.5 – 10.5</li>
            <li>Total Calcium (mmol/L): 2.12 – 2.62</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default CorrectedCalcium;
