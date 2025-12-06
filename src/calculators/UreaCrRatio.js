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
  const toUmolPerL_fromCreat = (val, unit) =>
    unit === "µmol/L" ? val : unit === "mmol/L" ? val * 1000 : val * 88.4;
  const toMgPerDl_fromCreat = (val, unit) =>
    unit === "µmol/L"
      ? val / 88.4
      : unit === "mmol/L"
      ? (val * 1000) / 88.4
      : val;

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
      const display =
        raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;

      let interp =
        raw > 20
          ? "High BUN/Cr — pre-renal azotemia or upper GI bleeding."
          : raw < 10
          ? "Low BUN/Cr — intrinsic renal disease or severe liver disease."
          : "Normal BUN/Cr ratio.";

      setRatioStr(display);
      setInterpretation(interp);
      setConverted({ bun_mgdl: fmt(bun_mgdl, 2), creat_mgdl: fmt(cr_mgdl, 3) });
    } else {
      const urea_mmolL = toMmoll_fromUrea(aVal, analyteUnit);
      const cr_umolL = toUmolPerL_fromCreat(cVal, creatinineUnit);
      const raw = (urea_mmolL / cr_umolL) * 1000;
      const display =
        raw >= 1 ? `${fmt(raw, 1)} : 1` : `1 : ${fmt(1 / raw, 1)}`;

      let interp =
        raw > 100
          ? "High Urea/Cr — pre-renal azotemia or upper GI bleeding."
          : raw < 40
          ? "Low Urea/Cr — intrinsic renal disease or severe liver disease."
          : "Normal Urea/Cr ratio.";

      setRatioStr(display);
      setInterpretation(interp);
      setConverted({
        urea_mmolL: fmt(urea_mmolL, 3),
        creat_umolL: fmt(cr_umolL, 1),
      });
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
    <div>
      <h2>Urea / BUN – Creatinine Ratio</h2>

      <label >Type: </label>
      <select
        value={type}
        onChange={handleTypeChange}

      >
        <option value="urea">Urea (SI)</option>
        <option value="bun">BUN (Conventional)</option>
      </select><p></p>

      <label>
        {type === "urea" ? "Urea:" : "BUN:"}
      </label><br />
      <input
        type="number"
        value={analyteValue}
        onChange={(e) => setAnalyteValue(e.target.value)}

      />
      <select
        value={analyteUnit}
        onChange={(e) => setAnalyteUnit(e.target.value)}
      >
        <option value="mmol/L">mmol/L</option>
        <option value="mg/dL">mg/dL</option>
      </select><p></p>

      <label >Creatinine:</label><br />
      <input
        type="number"
        value={creatinineValue}
        onChange={(e) => setCreatinineValue(e.target.value)}

      />
      <select
        value={creatinineUnit}
        onChange={(e) => setCreatinineUnit(e.target.value)}
      >
        <option value="µmol/L">µmol/L</option>
        <option value="mmol/L">mmol/L</option>
        <option value="mg/dL">mg/dL</option>
      </select>

      <button
        onClick={calculate}
        style={{ display: "block", marginTop: 15 }}
      >
        Calculate
      </button>
      <button
        onClick={reset}
        style={{ display: "block", marginTop: 10 }}
      >
        Reset
      </button>

      {note && (
        <p style={{ color: "brown", marginTop: 10 }}>
          <strong>{note}</strong>
        </p>
      )}

      {converted && (
        <div style={{ marginTop: 10 }}>
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
        <div style={{ marginTop: 10 }}>
          <div><strong>Ratio:</strong> {ratioStr} ({interpretation})</div>
          <div><p><strong>Normal Ranges:</strong></p>
            <ul>
              <li>BUNCr Ratio- 12:1 - 20:1</li>
              <li>UrCr ratio- 40:1 - 100:1</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
