import React, { useState } from "react";

export default function UreaBunCrRatio() {
  const [type, setType] = useState("urea");
  const [analyteValue, setAnalyteValue] = useState("");
  const [analyteUnit, setAnalyteUnit] = useState("mmol/L");
  const [creatinineValue, setCreatinineValue] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("µmol/L");
  const [ratioStr, setRatioStr] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [converted, setConverted] = useState(null);
  const [note, setNote] = useState("");

  // Conversion helpers
  const toMgPerDl_fromBun = (val, unit) => (unit === "mmol/L" ? val * 2.8 : val);
  const toMmoll_fromUrea = (val, unit) => (unit === "mmol/L" ? val : val / 6.0);
  const toUmolPerL_fromCreat = (val, unit) => (unit === "µmol/L" ? val : unit === "mmol/L" ? val * 1000 : val * 88.4);
  const toMgPerDl_fromCreat = (val, unit) => (unit === "µmol/L" ? val / 88.4 : unit === "mmol/L" ? (val * 1000) / 88.4 : val);

  const fmt = (n, dp = 1) => (Number.isFinite(n) ? Number(n).toFixed(dp) : "—");

  const calculate = () => {
    setNote("");
    setRatioStr("");
    setInterpretation("");
    setConverted(null);

    const aVal = parseFloat(analyteValue);
    const cVal = parseFloat(creatinineValue);

    if (!Number.isFinite(aVal) || !Number.isFinite(cVal) || cVal === 0) {
      setNote("Please enter valid numeric values (creatinine must be non-zero).");
      return;
    }

    if (type === "bun") {
      const bun_mgdl = toMgPerDl_fromBun(aVal, analyteUnit);
      const cr_mgdl = toMgPerDl_fromCreat(cVal, creatinineUnit);
      const raw = bun_mgdl / cr_mgdl;
      const display = raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;
      let interp = raw > 20 ? "High BUN/Cr — pre-renal azotemia / upper GI bleeding." :
                   raw < 10 ? "Low BUN/Cr — intrinsic renal disease / severe liver dx." : 
                   "Normal BUN/Cr - normal / post-renal.";
      setRatioStr(display);
      setInterpretation(interp);
      setConverted({ bun_mgdl: fmt(bun_mgdl, 2), creat_mgdl: fmt(cr_mgdl, 3) });
    } else {
      const urea_mmolL = toMmoll_fromUrea(aVal, analyteUnit);
      const cr_umolL = toUmolPerL_fromCreat(cVal, creatinineUnit);
      const raw = (urea_mmolL / cr_umolL) * 1000;
      const display = raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;
      let interp = raw > 100 ? "High Urea/Cr (SI) — pre-renal azotemia / upper GI bleeding." :
                   raw < 40 ? "Low Urea/Cr (SI) — intrinsic renal disease / severe liver dx." : 
                   "Normal Urea/Cr (SI) - normal / post-renal.";
      setRatioStr(display);
      setInterpretation(interp);
      setConverted({ urea_mmolL: fmt(urea_mmolL, 3), creat_umolL: fmt(cr_umolL, 1) });
    }
  };

  const reset = () => {
    setType("urea");
    setAnalyteValue("");
    setAnalyteUnit("mmol/L");
    setCreatinineValue("");
    setCreatinineUnit("µmol/L");
    setRatioStr("");
    setInterpretation("");
    setConverted(null);
    setNote("");
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    // Default units based on type
    if (newType === "urea") {
      setAnalyteUnit("mmol/L");
      setCreatinineUnit("µmol/L");
    } else {
      setAnalyteUnit("mg/dL");
      setCreatinineUnit("mg/dL");
    }

    setAnalyteValue("");
    setCreatinineValue("");
    setRatioStr("");
    setInterpretation("");
    setConverted(null);
    setNote("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Urea / BUN – Creatinine Ratio</h2>

      <div style={styles.row}>
        <label style={styles.label}>Type</label>
        <select value={type} onChange={handleTypeChange} style={styles.select}>
          <option value="urea">Urea (SI)</option>
          <option value="bun">BUN (conventional)</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>{type === "urea" ? "Urea" : "BUN"}</label>
        <input type="number" value={analyteValue} onChange={(e) => setAnalyteValue(e.target.value)} style={styles.input} />
        <select value={analyteUnit} onChange={(e) => setAnalyteUnit(e.target.value)} style={styles.select}>
          <option value="mmol/L">mmol/L</option>
          <option value="mg/dL">mg/dL</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Creatinine</label>
        <input type="number" value={creatinineValue} onChange={(e) => setCreatinineValue(e.target.value)} style={styles.input} />
        <select value={creatinineUnit} onChange={(e) => setCreatinineUnit(e.target.value)} style={styles.select}>
          <option value="µmol/L">µmol/L</option>
          <option value="mmol/L">mmol/L</option>
          <option value="mg/dL">mg/dL</option>
        </select>
      </div>

      <div style={styles.buttons}>
        <button onClick={calculate} style={styles.calcBtn}>Calculate</button>
        <button onClick={reset} style={styles.resetBtn}>Reset</button>
      </div>

      {note && <div style={styles.note}>{note}</div>}

      {converted && (
        <div style={styles.converted}>
          {type === "bun" ? <>
            <div><strong>BUN (mg/dL):</strong> {converted.bun_mgdl}</div>
            <div><strong>Creatinine (mg/dL):</strong> {converted.creat_mgdl}</div>
          </> : <>
            <div><strong>Urea (mmol/L):</strong> {converted.urea_mmolL}</div>
            <div><strong>Creatinine (µmol/L):</strong> {converted.creat_umolL}</div>
          </>}
        </div>
      )}

      {ratioStr && (
        <div style={styles.result}>
          <div><strong>Ratio:</strong> {ratioStr}</div>
          <div><strong>Interpretation:</strong> {interpretation}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: "95%", maxWidth: 400, margin: "20px auto", padding: 15, border: "1px solid #ccc", borderRadius: 10, background: "#f9f9f9", fontFamily: "Arial, sans-serif", boxSizing: "border-box" },
  title: { textAlign: "center", marginBottom: 15, fontSize: "1.2rem" },
  row: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, alignItems: "center" },
  label: { flex: "1 1 100px", fontSize: 14 },
  input: { flex: "2 1 80px", minWidth: 70, padding: 5, borderRadius: 5, border: "1px solid #ccc", boxSizing: "border-box" },
  select: { flex: "2 1 100px", minWidth: 90, padding: 5, borderRadius: 5, border: "1px solid #ccc" },
  buttons: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },
  calcBtn: { flex: "1", padding: "8px 12px", background: "#007BFF", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  resetBtn: { flex: "1", padding: "8px 12px", background: "#dc3545", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  result: { marginTop: 15, background: "#fff", padding: 10, borderRadius: 6, wordWrap: "break-word", overflowWrap: "break-word" },
  converted: { marginTop: 12, fontSize: 14 },
  note: { marginTop: 12, background: "#fff8e6", padding: 10, borderRadius: 6, color: "#b45d00" },
};
