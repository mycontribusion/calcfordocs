import { useState } from "react";

export default function CURB65Calculator() {
  // --- States ---
  const [confusion, setConfusion] = useState(false);
  const [age65, setAge65] = useState(false);
  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");
  const [respRate, setRespRate] = useState("");
  const [nitrogenType, setNitrogenType] = useState("urea_mmol");
  const [value, setValue] = useState("");

  // --- BUN conversion ---
  const bunMg = (() => {
    if (!value) return 0;
    const v = Number(value);
    switch (nitrogenType) {
      case "urea_mmol":
      case "bun_mmol":
        return v * 2.8;
      case "urea_mg":
      case "bun_mg":
        return v;
      default:
        return 0;
    }
  })();

  // --- CURB-65 Score ---
  const score =
    (confusion ? 1 : 0) +
    (bunMg >= 20 ? 1 : 0) +
    (respRate && Number(respRate) >= 30 ? 1 : 0) +
    (sbp && dbp && (Number(sbp) < 90 || Number(dbp) <= 60) ? 1 : 0) +
    (age65 ? 1 : 0);

  // --- Reset Function ---
  const resetCalculator = () => {
    setConfusion(false);
    setAge65(false);
    setSbp("");
    setDbp("");
    setRespRate("");
    setNitrogenType("urea_mg");
    setValue("");
  };

  const boxStyle = {
    border: "1px solid #bbb",
    borderRadius: 6,
    padding: 8,
    boxSizing: "border-box",
    overflow: "hidden",
  };

  const inputStyle = { width: "100%", padding: 6, boxSizing: "border-box" };
  const flexInputStyle = { flex: "1 1 0", padding: 6, boxSizing: "border-box", minWidth: 0 };

  return (
    <div style={{ maxWidth: 360, margin: "1rem auto", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ marginBottom: 6 }}>CURB-65 Calculator</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          boxSizing: "border-box",
        }}
      >
        {/* C — Confusion */}
        <div style={boxStyle}>
          <label style={{ display: "block" }}>
            <input type="checkbox" checked={confusion} onChange={e => setConfusion(e.target.checked)} /> Confusion
          </label>
        </div>

        {/* U — Urea / BUN */}
        <div style={boxStyle}>
          <select value={nitrogenType} onChange={e => setNitrogenType(e.target.value)} style={{ ...inputStyle, marginBottom: 4 }}>
            <option value="urea_mmol">Urea mmol/L</option>
            <option value="urea_mg">Urea mg/dL</option>
            <option value="bun_mmol">BUN mmol/L</option>
            <option value="bun_mg">BUN mg/dL</option>
          </select>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="≥ 20 mg/dL" style={inputStyle} />
        </div>

        {/* R — Respiratory Rate */}
        <div style={boxStyle}>
          <input type="number" value={respRate} onChange={e => setRespRate(e.target.value)} placeholder="RR ≥ 30 /min" style={inputStyle} />
        </div>

        {/* B — Blood Pressure */}
        <div style={boxStyle}>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <input type="number" value={sbp} onChange={e => setSbp(e.target.value)} placeholder="SBP < 90" style={flexInputStyle} />
            <input type="number" value={dbp} onChange={e => setDbp(e.target.value)} placeholder="DBP ≤ 60" style={flexInputStyle} />
          </div>
        </div>

        {/* 65 — Age */}
        <div style={{ ...boxStyle, gridColumn: "1 / -1" }}>
          <label style={{ display: "block" }}>
            <input type="checkbox" checked={age65} onChange={e => setAge65(e.target.checked)} /> Age ≥ 65
          </label>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetCalculator}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          borderRadius: 4,
          border: "1px solid #888",
          background: "#f5f5f5",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        Reset
      </button><p></p>

      <div style={{ fontWeight: "bold", marginBottom: 8 }}>Score: {score} / 5</div>


      <div style={{ fontSize: 12, marginTop: 8, color: "#555" }}>
        {score <= 1
          ? "0–1: Mild CAP — consider outpatient care"
          : "≥2: Severe CAP — recommend hospitalization"}
      </div>
    </div>
  );
}
