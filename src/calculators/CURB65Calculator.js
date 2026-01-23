import { useState } from "react";

function CURB65Calculator() {
  const [confusion, setConfusion] = useState(false);
  const [nitrogenType, setNitrogenType] = useState("urea_mmol");
  const [value, setValue] = useState("");
  const [respRate, setRespRate] = useState("");
  const [lowBP, setLowBP] = useState(false);
  const [age65, setAge65] = useState(false);

  const bunMg = (() => {
    if (value === "") return 0;
    const v = Number(value);
    switch (nitrogenType) {
      case "urea_mmol": return v * 2.8;
      case "urea_mg": return v * 0.467;
      case "bun_mmol": return v * 2.8;
      case "bun_mg": return v;
      default: return 0;
    }
  })();

  const score =
    (confusion ? 1 : 0) +
    (bunMg >= 20 ? 1 : 0) +
    (respRate !== "" && Number(respRate) >= 30 ? 1 : 0) +
    (lowBP ? 1 : 0) +
    (age65 ? 1 : 0);

  return (
    <div className="calc-container" style={{ padding: "8px" }}>
      <strong>CURB-65</strong>

      {/* Checkboxes row 1 */}
      <div style={{ display: "flex", gap: "12px", fontSize: "13px" }}>
        <label>
          <input type="checkbox" checked={confusion}
            onChange={(e) => setConfusion(e.target.checked)} /> Confusion
        </label>

        <label>
          <input type="checkbox" checked={age65}
            onChange={(e) => setAge65(e.target.checked)} /> Age ≥65
        </label>
      </div>

      {/* Nitrogen */}
      <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Urea / BUN"
          style={{ flex: 1 }}
        />

        <select
          value={nitrogenType}
          onChange={(e) => setNitrogenType(e.target.value)}
          style={{ fontSize: "12px" }}
        >
          <option value="urea_mmol">Urea mmol/L</option>
          <option value="urea_mg">Urea mg/dL</option>
          <option value="bun_mmol">BUN mmol/L</option>
          <option value="bun_mg">BUN mg/dL</option>
        </select>
      </div>

      {/* RR + BP */}
      <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
        <input
          type="number"
          value={respRate}
          onChange={(e) => setRespRate(e.target.value)}
          placeholder="RR ≥30"
          style={{ flex: 1 }}
        />

        <label style={{ fontSize: "13px" }}>
          <input
            type="checkbox"
            checked={lowBP}
            onChange={(e) => setLowBP(e.target.checked)}
          /> Low BP
        </label>
      </div>

      <div style={{ marginTop: "6px", fontSize: "13px" }}>
        <strong>Score:</strong> {score} / 5
      </div>

      <div style={{ fontSize: "12px", opacity: 0.8 }}>
        {score <= 1
          ? "0–1: Consider outpatient care"
          : "≥2: Admit to hospital"}
      </div>
    </div>
  );
}

export default CURB65Calculator;
