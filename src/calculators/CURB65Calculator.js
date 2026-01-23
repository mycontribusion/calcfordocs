import { useState } from "react";

function CURB65Calculator() {
  const [confusion, setConfusion] = useState(false);
  const [nitrogenType, setNitrogenType] = useState("urea_mmol"); // default
  const [value, setValue] = useState("");
  const [respRate, setRespRate] = useState("");
  const [lowBP, setLowBP] = useState(false);
  const [age65, setAge65] = useState(false);

  // Convert everything to BUN mg/dL
  const bunMg = (() => {
    if (value === "") return 0;
    const v = Number(value);

    switch (nitrogenType) {
      case "urea_mmol":
        return v * 2.8;
      case "urea_mg":
        return v * 0.467;
      case "bun_mmol":
        return v * 2.8;
      case "bun_mg":
        return v;
      default:
        return 0;
    }
  })();

  const score =
    (confusion ? 1 : 0) +
    (bunMg >= 20 ? 1 : 0) +
    (respRate !== "" && Number(respRate) >= 30 ? 1 : 0) +
    (lowBP ? 1 : 0) +
    (age65 ? 1 : 0);

  const interpretation =
    score <= 1
      ? "Score 0–1: Mild to moderate CAP. Consider outpatient management after additional assessment."
      : "Score ≥2: Severe CAP. Hospitalization recommended.";

  const placeholderMap = {
    urea_mmol: "≥ 7.1 mmol/L",
    urea_mg: "≥ 43 mg/dL",
    bun_mmol: "≥ 7.1 mmol/L",
    bun_mg: "≥ 20 mg/dL",
  };

  return (
    <div className="calc-container">
      <h3>CURB-65 Score</h3>

      <div className="calc-row">
        <label>
          <input
            type="checkbox"
            checked={confusion}
            onChange={(e) => setConfusion(e.target.checked)}
          />
          Confusion (AMS ≤ 8 or orientation &lt; 3)
        </label>
      </div>

      <div className="calc-row">
        <label>
          Nitrogen parameter
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholderMap[nitrogenType]}
              style={{ flex: 1 }}
            />

            <select
              value={nitrogenType}
              onChange={(e) => setNitrogenType(e.target.value)}
            >
              <option value="urea_mmol">Urea (mmol/L)</option>
              <option value="urea_mg">Urea (mg/dL)</option>
              <option value="bun_mmol">BUN (mmol/L)</option>
              <option value="bun_mg">BUN (mg/dL)</option>
            </select>
          </div>
        </label>
      </div>

      <div className="calc-row">
        <label>
          Respiratory Rate (/min)
          <input
            type="number"
            value={respRate}
            onChange={(e) => setRespRate(e.target.value)}
            placeholder="≥ 30"
          />
        </label>
      </div>

      <div className="calc-row">
        <label>
          <input
            type="checkbox"
            checked={lowBP}
            onChange={(e) => setLowBP(e.target.checked)}
          />
          Hypotension (SBP &lt; 90 or DBP &lt; 60)
        </label>
      </div>

      <div className="calc-row">
        <label>
          <input
            type="checkbox"
            checked={age65}
            onChange={(e) => setAge65(e.target.checked)}
          />
          Age ≥ 65 years
        </label>
      </div>

      <hr />

      <div className="calc-result">
        <strong>Score:</strong> {score} / 5
      </div>

      <div className="calc-interpretation">
        {interpretation}
      </div>
    </div>
  );
}

export default CURB65Calculator;
