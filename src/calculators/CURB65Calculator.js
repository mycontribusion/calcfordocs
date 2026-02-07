import { useState } from "react";
import "./CalculatorShared.css";

export default function CURB65Calculator() {
  const [confusion, setConfusion] = useState(false);
  const [ureaHigh, setUreaHigh] = useState(false);
  const [rrHigh, setRrHigh] = useState(false);
  const [bpLow, setBpLow] = useState(false);
  const [age65, setAge65] = useState(false);

  const score =
    (confusion ? 1 : 0) +
    (ureaHigh ? 1 : 0) +
    (rrHigh ? 1 : 0) +
    (bpLow ? 1 : 0) +
    (age65 ? 1 : 0);

  const resetCalculator = () => {
    setConfusion(false);
    setUreaHigh(false);
    setRrHigh(false);
    setBpLow(false);
    setAge65(false);
  };

  return (
    <div className="calc-container">
      <h3 className="calc-title">CURB-65 Calculator</h3>

      <div className="calc-box">
        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={confusion}
            onChange={e => setConfusion(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Confusion
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={ureaHigh}
            onChange={e => setUreaHigh(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Urea ≥ 7 mmol/L or BUN ≥ 20 mg/dL
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={rrHigh}
            onChange={e => setRrHigh(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Respiratory rate ≥ 30 /min
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={bpLow}
            onChange={e => setBpLow(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          SBP &lt; 90 mmHg or DBP ≤ 60 mmHg
        </label>

        <label style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={age65}
            onChange={e => setAge65(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Age ≥ 65 years
        </label>
      </div>

      <button
        onClick={resetCalculator}
        className="calc-btn-reset"
      >
        Reset
      </button>

      <div className="calc-result" style={{ marginTop: 16 }}>
        Score: {score} / 5
        <div style={{ fontSize: "0.9rem", fontWeight: "normal", marginTop: 4 }}>
          {score <= 1
            ? "Mild CAP — consider outpatient care"
            : "Severe CAP — recommend hospitalization"}
        </div>
      </div>
    </div>
  );
}
