import { useState } from "react";

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
    <div style={{ maxWidth: 360, margin: "1rem auto", fontFamily: "Arial, sans-serif" }}>
      <h3>CURB-65 Calculator</h3>

      {/* C — Confusion */}
      <p></p>
        <label>
          <input
            type="checkbox"
            checked={confusion}
            onChange={e => setConfusion(e.target.checked)}
          />{" "}
          Confusion
        </label>


      {/* U — Urea */}
      <p></p>
        <label>
          <input
            type="checkbox"
            checked={ureaHigh}
            onChange={e => setUreaHigh(e.target.checked)}
          />{" "}
          Urea ≥ 7 mmol/L or BUN ≥ 20 mg/dL
        </label>


      {/* R — Respiratory Rate */}
      <p></p>
        <label>
          <input
            type="checkbox"
            checked={rrHigh}
            onChange={e => setRrHigh(e.target.checked)}
          />{" "}
          Respiratory rate ≥ 30 /min
        </label>


      {/* B — Blood Pressure */}
      <p></p>
        <label>
          <input
            type="checkbox"
            checked={bpLow}
            onChange={e => setBpLow(e.target.checked)}
          />{" "}
          SBP &lt; 90 mmHg or DBP ≤ 60 mmHg
        </label>


      {/* 65 — Age */}
      <p></p>
        <label>
          <input
            type="checkbox"
            checked={age65}
            onChange={e => setAge65(e.target.checked)}
          />{" "}
          Age ≥ 65 years
        </label><p></p>


      {/* Reset */}
      <button
        onClick={resetCalculator}
        style={{
          width: "100%",
          cursor: "pointer",
        }}
      >
        Reset
      </button>

      <p style={{ fontWeight: "bold", marginTop: 10 }}>
        Score: {score} / 5
      </p>

      <div style={{ fontSize: 12 }}>
        {score <= 1
          ? "0–1: Mild CAP — consider outpatient care"
          : "≥2: Severe CAP — recommend hospitalization"}
      </div>
    </div>
  );
}
