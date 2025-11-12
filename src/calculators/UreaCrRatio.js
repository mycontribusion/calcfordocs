import React, { useState } from "react";

export default function UreaCrRatio() {
  const [urea, setUrea] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [ureaType, setUreaType] = useState("urea"); // urea or bun
  const [ureaUnit, setUreaUnit] = useState("mmol"); // mmol or mg
  const [crUnit, setCrUnit] = useState("umol"); // µmol/L default
  const [ratioStr, setRatioStr] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [note, setNote] = useState("");

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  };

  const convertToMgdl = (urea, creatinine, ureaUnit, crUnit) => {
    let u_mgdl = urea;
    let c_mgdl = creatinine;

    // Convert urea to mg/dL
    if (ureaUnit === "mmol") u_mgdl = urea * 2.8; // mmol/L → mg/dL
    // if already mg/dL, unchanged

    // Convert creatinine to mg/dL
    if (crUnit === "umol") c_mgdl = creatinine / 88.4; // µmol/L → mg/dL
    else if (crUnit === "mmol") c_mgdl = creatinine * 100; // mmol/L → mg/dL
    // if mg/dL, unchanged

    return { u_mgdl, c_mgdl };
  };

  const calculateUCR = () => {
    setRatioStr("");
    setInterpretation("");
    setNote("");

    const u = toNum(urea);
    const c = toNum(creatinine);

    if (u === null || c === null || c === 0) {
      setNote("Please enter valid numeric values (creatinine must be non-zero).");
      return;
    }

    const { u_mgdl, c_mgdl } = convertToMgdl(u, c, ureaUnit, crUnit);

    // Compute ratio
    let ratio;
    let ratioDisplay;

    if (u_mgdl >= c_mgdl) {
      ratio = (u_mgdl / c_mgdl).toFixed(1);
      ratioDisplay = `${ratio} : 1`;
    } else {
      ratio = (c_mgdl / u_mgdl).toFixed(1);
      ratioDisplay = `1 : ${ratio}`;
    }

    // Interpretation (based on urea/creatinine ratio in mg/dL)
    const rawRatio = u_mgdl / c_mgdl;
    const interp = rawRatio > 20 ? "Pre-renal azotemia" : "Intrinsic renal disease";

    // Warn if unlikely input values
    if (crUnit === "mmol" && c > 50) {
      setNote("Creatinine in mmol/L > 50 is unusual — did you mean µmol/L?");
    } else if (crUnit === "umol" && c > 2000) {
      setNote("Creatinine in µmol/L > 2000 is unusually high.");
    }

    setRatioStr(ratioDisplay);
    setInterpretation(interp);
  };

  const resetAll = () => {
    setUrea("");
    setCreatinine("");
    setUreaType("urea");
    setUreaUnit("mmol");
    setCrUnit("umol");
    setRatioStr("");
    setInterpretation("");
    setNote("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Urea–Creatinine Ratio (UCR)</h2>

      <div style={styles.row}>
        <label style={styles.label}>Type:</label>
        <select value={ureaType} onChange={(e) => setUreaType(e.target.value)} style={styles.select}>
          <option value="urea">Urea</option>
          <option value="bun">BUN</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>
          {ureaType === "bun" ? "BUN" : "Urea"} ({ureaUnit === "mmol" ? "mmol/L" : "mg/dL"}):
        </label>
        <input type="number" value={urea} onChange={(e) => setUrea(e.target.value)} style={styles.input} />
        <select value={ureaUnit} onChange={(e) => setUreaUnit(e.target.value)} style={styles.select}>
          <option value="mmol">mmol/L</option>
          <option value="mg">mg/dL</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>
          Creatinine ({crUnit === "umol" ? "µmol/L" : crUnit === "mmol" ? "mmol/L" : "mg/dL"}):
        </label>
        <input type="number" value={creatinine} onChange={(e) => setCreatinine(e.target.value)} style={styles.input} />
        <select value={crUnit} onChange={(e) => setCrUnit(e.target.value)} style={styles.select}>
          <option value="umol">µmol/L</option>
          <option value="mmol">mmol/L</option>
          <option value="mg">mg/dL</option>
        </select>
      </div>

      <div style={styles.buttonRow}>
        <button onClick={calculateUCR} style={styles.button}>Calculate</button>
        <button onClick={resetAll} style={styles.reset}>Reset</button>
      </div>

      {note && <div style={styles.note}>{note}</div>}

      {ratioStr && (
        <div style={styles.resultBox}>
          <p><strong>UCR:</strong> {ratioStr}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "520px",
    margin: "20px auto",
    padding: "18px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
    background: "#fff",
  },
  title: { textAlign: "center", marginBottom: "12px" },
  row: { display: "flex", alignItems: "center", marginBottom: "10px" },
  label: { width: "160px", fontSize: "14px" },
  input: {
    flex: 1,
    padding: "6px",
    marginRight: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  select: { padding: "6px", border: "1px solid #ccc", borderRadius: "4px" },
  buttonRow: { display: "flex", justifyContent: "space-between", marginTop: "14px" },
  button: {
    flex: 1,
    padding: "8px",
    marginRight: "8px",
    background: "#0b7285",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  reset: {
    flex: 1,
    padding: "8px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "16px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "6px",
    background: "#fbfbfb",
  },
  note: {
    marginTop: "12px",
    color: "#b45d00",
    background: "#fff8e6",
    padding: "8px",
    borderRadius: "6px",
  },
};
