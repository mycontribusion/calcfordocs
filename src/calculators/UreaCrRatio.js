import React, { useState } from "react";

/**
 * Urea / BUN - Creatinine Ratio calculator
 *
 * Rules:
 * - If type === "bun":
 *    - convert bun (any unit) -> mg/dL
 *    - convert creatinine (any unit) -> mg/dL
 *    - ratio = bun_mgdl / cr_mgdl
 *    - interpretation thresholds: >20 pre-renal, 10-20 normal, <10 intrinsic
 *
 * - If type === "urea":
 *    - convert urea (any unit) -> mmol/L
 *    - convert creatinine (any unit) -> µmol/L
 *    - ratio = (urea_mmolL / cr_umolL) * 1000   // yields an integer-like scale (SI)
 *    - interpretation thresholds (SI): >100 pre-renal, 40-100 normal, <40 intrinsic
 *
 * All displayed ratios are shown as "X : 1" or "1 : X" (X > 1), one decimal place.
 */

export default function UreaBunCrRatio() {
  const [type, setType] = useState("urea"); // "urea" or "bun"
  const [analyteValue, setAnalyteValue] = useState("");
  const [analyteUnit, setAnalyteUnit] = useState("mmol/L"); // for urea/bun: mmol/L or mg/dL
  const [creatinineValue, setCreatinineValue] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("µmol/L"); // µmol/L, mmol/L, mg/dL

  const [ratioStr, setRatioStr] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [converted, setConverted] = useState(null);
  const [note, setNote] = useState("");

  // Conversion helpers (accurate constants)
  // Urea: 1 mmol/L = 6.0 mg/dL  (molecular weight 60 -> 1 mmol/L = 60 mg/L = 6 mg/dL)
  // BUN: 1 mmol/L (urea basis) -> BUN mg/dL approx 2.8 (derived)
  // Creatinine: 1 µmol/L = 0.011312 mg/dL  (1 mg/dL = 88.4 µmol/L)
  const toMgPerDl_fromUrea = (val, unit) => {
    // returns urea in mg/dL
    if (unit === "mmol/L") return val * 6.0;
    if (unit === "mg/dL") return val;
    return NaN;
  };
  const toMgPerDl_fromBun = (val, unit) => {
    // returns BUN in mg/dL
    if (unit === "mmol/L") return val * 2.8;
    if (unit === "mg/dL") return val;
    return NaN;
  };
  const toMmoll_fromUrea = (val, unit) => {
    // returns urea in mmol/L
    if (unit === "mmol/L") return val;
    if (unit === "mg/dL") return val / 6.0;
    return NaN;
  };
  const toUmolPerL_fromCreat = (val, unit) => {
    // returns creatinine in µmol/L
    if (unit === "µmol/L") return val;
    if (unit === "mmol/L") return val * 1000;
    if (unit === "mg/dL") return val * 88.4;
    return NaN;
  };
  const toMgPerDl_fromCreat = (val, unit) => {
    // returns creatinine in mg/dL
    if (unit === "µmol/L") return val / 88.4;
    if (unit === "mmol/L") return (val * 1000) / 88.4; // = val * (1000/88.4) ≈ val * 11.312
    if (unit === "mg/dL") return val;
    return NaN;
  };

  const fmt = (n, dp = 1) => {
    if (!Number.isFinite(n)) return "—";
    return Number(n).toFixed(dp);
  };

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
      // Convert BUN -> mg/dL and creat -> mg/dL
      const bun_mgdl = toMgPerDl_fromBun(aVal, analyteUnit);
      const cr_mgdl = toMgPerDl_fromCreat(cVal, creatinineUnit);

      if (!Number.isFinite(bun_mgdl) || !Number.isFinite(cr_mgdl) || cr_mgdl === 0) {
        setNote("Conversion to mg/dL failed. Check units.");
        return;
      }

      const raw = bun_mgdl / cr_mgdl; // BUN/Cr (mass basis)
      const display =
        raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;

      // Interpretation thresholds for BUN/Cr (mass basis)
      let interp = "";
      if (raw > 20) interp = "High BUN/Cr — suggests pre-renal azotemia (e.g., dehydration, GI bleed, CHF).";
      else if (raw < 10) interp = "Low BUN/Cr — suggests intrinsic renal disease (e.g., ATN, GN, liver disease).";
      else interp = "Normal BUN/Cr — suggests normal or post-renal function.";

      setRatioStr(display);
      setInterpretation(interp);
      setConverted({
        bun_mgdl: fmt(bun_mgdl, 2),
        creat_mgdl: fmt(cr_mgdl, 3),
      });

      // Plausibility notes
      if (analyteUnit === "mmol/L" && aVal > 100) {
        setNote("Unusually high BUN in mmol/L — verify unit/entry.");
      }
      if (creatinineUnit === "mmol/L" && cVal > 50) {
        setNote((prev) => prev ? prev + " Creatinine in mmol/L high — verify." : "Creatinine in mmol/L high — verify.");
      }
    } else {
      // type === "urea"
      // convert urea -> mmol/L and creat -> µmol/L
      const urea_mmolL = toMmoll_fromUrea(aVal, analyteUnit);
      const cr_umolL = toUmolPerL_fromCreat(cVal, creatinineUnit);

      if (!Number.isFinite(urea_mmolL) || !Number.isFinite(cr_umolL) || cr_umolL === 0) {
        setNote("Conversion to mmol/L or µmol/L failed. Check units.");
        return;
      }

      // UCR (SI form): (urea mmol/L) / (cr mmol/L) but since creat is in µmol/L,
      // use (urea_mmolL / cr_umolL) * 1000  => yields similar scale as previously discussed.
      const raw = (urea_mmolL / cr_umolL) * 1000;
      const display = raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;

      // Interpretation thresholds for Urea/Cr (SI scaled)
      let interp = "";
      if (raw > 100) interp = "High Urea/Cr (SI) — suggests pre-renal azotemia.";
      else if (raw < 40) interp = "Low Urea/Cr (SI) — suggests intrinsic renal disease.";
      else interp = "Normal Urea/Cr (SI).";

      setRatioStr(display);
      setInterpretation(interp);
      setConverted({
        urea_mmolL: fmt(urea_mmolL, 3),
        creat_umolL: fmt(cr_umolL, 1),
      });

      // Plausibility notes
      if (analyteUnit === "mmol/L" && aVal > 200) {
        setNote("Unusually high Urea in mmol/L — verify unit/entry.");
      }
      if (creatinineUnit === "µmol/L" && cVal > 2000) {
        setNote((prev) => prev ? prev + " Creatinine in µmol/L unusually high." : "Creatinine in µmol/L unusually high.");
      }
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Urea / BUN – Creatinine Ratio</h2>

      <div style={styles.row}>
        <label style={styles.label}>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={styles.select}>
          <option value="urea">Urea (SI)</option>
          <option value="bun">BUN (conventional)</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>{type === "urea" ? "Urea" : "BUN"}</label>
        <input
          type="number"
          value={analyteValue}
          onChange={(e) => setAnalyteValue(e.target.value)}
          style={styles.input}
        />
        <select value={analyteUnit} onChange={(e) => setAnalyteUnit(e.target.value)} style={styles.select}>
          <option value="mmol/L">mmol/L</option>
          <option value="mg/dL">mg/dL</option>
        </select>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Creatinine</label>
        <input
          type="number"
          value={creatinineValue}
          onChange={(e) => setCreatinineValue(e.target.value)}
          style={styles.input}
        />
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
          {type === "bun" ? (
            <>
              <div><strong>BUN (mg/dL):</strong> {converted.bun_mgdl}</div>
              <div><strong>Creatinine (mg/dL):</strong> {converted.creat_mgdl}</div>
            </>
          ) : (
            <>
              <div><strong>Urea (mmol/L):</strong> {converted.urea_mmolL}</div>
              <div><strong>Creatinine (µmol/L):</strong> {converted.creat_umolL}</div>
            </>
          )}
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

// Inline styles
const styles = {
  container: { maxWidth: 560, margin: "20px auto", padding: 18, border: "1px solid #ddd", borderRadius: 8, fontFamily: "Arial, sans-serif", background: "#fff" },
  title: { textAlign: "center", marginBottom: 12 },
  row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  label: { width: 120, fontSize: 14 },
  input: { flex: 1, padding: 6, borderRadius: 4, border: "1px solid #ccc" },
  select: { padding: 6, borderRadius: 4, border: "1px solid #ccc" },
  buttons: { display: "flex", gap: 10, marginTop: 10 },
  calcBtn: { padding: "8px 12px", background: "#0b7285", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  resetBtn: { padding: "8px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  result: { marginTop: 14, padding: 10, borderRadius: 6, background: "#fbfbfb", border: "1px solid #eee" },
  converted: { marginTop: 12, fontSize: 14 },
  note: { marginTop: 12, background: "#fff8e6", padding: 10, borderRadius: 6, color: "#b45d00" },
};

