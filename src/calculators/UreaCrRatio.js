import React, { useState } from "react";

const UCRCalculator = () => {
  const [type, setType] = useState("urea");
  const [urea, setUrea] = useState("");
  const [ureaUnit, setUreaUnit] = useState("mmol/L");
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("µmol/L");
  const [ratio, setRatio] = useState("");
  const [interpretation, setInterpretation] = useState("");

  // Conversion factors to mg/dL
  const ureaFactors = {
    "mmol/L": 2.801,
    "mg/dL": 1,
  };

  const bunFactors = {
    "mmol/L": 2.801 * (28 / 60), // converts mmol/L to BUN mg/dL approx
    "mg/dL": 1,
  };

  const creatinineFactors = {
    "µmol/L": 0.0113,
    "mmol/L": 11.3,
    "mg/dL": 1,
  };

  const calculateUCR = () => {
    let ureaMgDl = 0;
    let crMgDl = 0;

    // Convert Urea/BUN to mg/dL
    if (type === "urea") {
      ureaMgDl = parseFloat(urea) * ureaFactors[ureaUnit];
    } else {
      ureaMgDl = parseFloat(urea) * bunFactors[ureaUnit];
    }

    // Convert Creatinine to mg/dL
    crMgDl = parseFloat(creatinine) * creatinineFactors[creatinineUnit];

    if (!ureaMgDl || !crMgDl) {
      setRatio("");
      setInterpretation("Please enter valid numbers.");
      return;
    }

    const ucrValue = ureaMgDl / crMgDl;
    const rounded = (ucrValue * 1).toFixed(2); // maintain numeric accuracy
    const displayRatio = `${Math.round(ucrValue)}:1`;

    // Interpretation
    let interp = "";
    if (ucrValue > 20) {
      interp = "High UCR — suggests pre-renal azotemia (e.g., dehydration, GI bleed, CHF).";
    } else if (ucrValue < 10) {
      interp = "Low UCR — suggests intrinsic renal disease (e.g., ATN, GN, liver disease).";
    } else {
      interp = "Normal UCR — suggests normal or post-renal function.";
    }

    setRatio(displayRatio);
    setInterpretation(interp);
  };

  const resetForm = () => {
    setType("urea");
    setUrea("");
    setUreaUnit("mmol/L");
    setCreatinine("");
    setCreatinineUnit("µmol/L");
    setRatio("");
    setInterpretation("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Urea-Creatinine Ratio</h2>

      <div style={styles.section}>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="urea">Urea</option>
          <option value="bun">BUN</option>
        </select>
      </div>

      <div style={styles.section}>
        <label>{type === "urea" ? "Urea" : "BUN"}:</label>
        <input
          type="number"
          value={urea}
          onChange={(e) => setUrea(e.target.value)}
          placeholder="Enter value"
          style={styles.input}
        />
        <select value={ureaUnit} onChange={(e) => setUreaUnit(e.target.value)} style={styles.select}>
          <option value="mmol/L">mmol/L</option>
          <option value="mg/dL">mg/dL</option>
        </select>
      </div>

      <div style={styles.section}>
        <label>Creatinine:</label>
        <input
          type="number"
          value={creatinine}
          onChange={(e) => setCreatinine(e.target.value)}
          placeholder="Enter value"
          style={styles.input}
        />
        <select
          value={creatinineUnit}
          onChange={(e) => setCreatinineUnit(e.target.value)}
          style={styles.select}
        >
          <option value="µmol/L">µmol/L</option>
          <option value="mmol/L">mmol/L</option>
          <option value="mg/dL">mg/dL</option>
        </select>
      </div>

      <div style={styles.buttons}>
        <button onClick={calculateUCR} style={styles.calculateBtn}>Calculate</button>
        <button onClick={resetForm} style={styles.resetBtn}>Reset</button>
      </div>

      {ratio && (
        <div style={styles.result}>
          <p><strong>UCR:</strong> {ratio}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
};

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
  input: { width: "100px", marginRight: "10px" },
  select: { padding: "4px", borderRadius: "5px" },
  buttons: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  calculateBtn: {
    padding: "8px 15px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  resetBtn: {
    padding: "8px 15px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  result: { marginTop: "20px", background: "#fff", padding: "10px", borderRadius: "8px" },
};

export default UCRCalculator;
