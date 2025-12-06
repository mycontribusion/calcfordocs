import React, { useState } from "react";

function CorrectedCalcium() {
  const [calcium, setCalcium] = useState("");
  const [calciumUnit, setCalciumUnit] = useState("mmol/L");
  const [albumin, setAlbumin] = useState("");
  const [albuminUnit, setAlbuminUnit] = useState("g/L");
  const [result, setResult] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  const calculateCorrectedCalcium = () => {
    let ca = parseFloat(calcium);
    let alb = parseFloat(albumin);

    if (isNaN(ca) || isNaN(alb)) {
      setResult(null);
      setInterpretation("Please enter valid numbers for both calcium and albumin.");
      return;
    }

    // Convert calcium to mg/dL for calculation if needed
    if (calciumUnit === "mmol/L") {
      ca = ca * 4.0; // 1 mmol/L = 4 mg/dL
    }

    // Convert albumin to g/dL for calculation
    if (albuminUnit === "g/L") {
      alb = alb / 10; // 1 g/L = 0.1 g/dL
    }

    // Corrected calcium formula (mg/dL)
    let correctedCa = ca + 0.8 * (4 - alb);

    // Determine interpretation
    let interp = "";
    if (correctedCa < 8.5) interp = "Low (Hypocalcemia)";
    else if (correctedCa > 10.5) interp = "High (Hypercalcemia)";
    else interp = "Normal";

    // Convert back to user-selected calcium unit for display
    if (calciumUnit === "mmol/L") {
      correctedCa = correctedCa / 4.0; // mg/dL -> mmol/L
    }

    setResult(correctedCa.toFixed(2));
    setInterpretation(interp);
  };

  const reset = () => {
    setCalcium("");
    setCalciumUnit("mg/dL");
    setAlbumin("");
    setAlbuminUnit("g/dL");
    setResult(null);
    setInterpretation("");
  };

  return (
    <div >
      <h2 >Corrected Calcium Calculator</h2>

      <div >
        <label>Calcium:</label><br />
        <input
          type="number"
          value={calcium}
          onChange={(e) => setCalcium(e.target.value)}
          placeholder="Enter calcium"
          
        />
        <select
          value={calciumUnit}
          onChange={(e) => setCalciumUnit(e.target.value)}
          
        >
          <option value="mg/dL">mg/dL</option>
          <option value="mmol/L">mmol/L</option>
        </select>
      </div>

      <div >
        <p></p>
        <label>Albumin:</label><br />
        <input
          type="number"
          value={albumin}
          onChange={(e) => setAlbumin(e.target.value)}
          placeholder="Enter albumin"
         
        />
        <select
          value={albuminUnit}
          onChange={(e) => setAlbuminUnit(e.target.value)}
        
        >
          <option value="g/dL">g/dL</option>
          <option value="g/L">g/L</option>
        </select>
      </div>

      <div>
        <p></p>
        <button onClick={calculateCorrectedCalcium} >Calculate</button>
        <button onClick={reset} >Reset</button>
      </div>

      {result !== null && (
  <div>
    <p><strong>Corrected Calcium:</strong> {result} {calciumUnit}({interpretation})</p>

    <p>
      Corrected Ca (mg/dL) = Measured Ca + 0.8 × (4.0 − Albumin in g/dL)
    </p>

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

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: { textAlign: "center", marginBottom: "20px" },
  section: { marginBottom: "15px" },
  input: { width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #aaa" },
  select: { width: "100%", padding: "6px", borderRadius: "5px", border: "1px solid #aaa", marginTop: "5px" },
  buttons: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  calcBtn: { padding: "8px 15px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px" },
  resetBtn: { padding: "8px 15px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px" },
  result: { marginTop: "20px", background: "#fff", padding: "10px", borderRadius: "8px", textAlign: "center" },
};

export default CorrectedCalcium;
