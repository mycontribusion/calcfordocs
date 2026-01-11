// src/calculators/BishopScore.js
import { useState } from "react";

export default function BishopScore() {
  const [dilation, setDilation] = useState("");
  const [effacement, setEffacement] = useState("");
  const [consistency, setConsistency] = useState("");
  const [position, setPosition] = useState("");
  const [station, setStation] = useState("");
  const [result, setResult] = useState(null);

  function calculateScore() {
    if (
      dilation === "" ||
      effacement === "" ||
      consistency === "" ||
      position === "" ||
      station === ""
    ) {
      setResult({ error: "Please select all parameters." });
      return;
    }

    const total =
      Number(dilation) +
      Number(effacement) +
      Number(consistency) +
      Number(position) +
      Number(station);

    let interpretation = "";
    if (total <= 5) {
      interpretation = "Unfavourable cervix – induction likely to fail.";
    } else if (total <= 7) {
      interpretation = "Moderately favourable cervix.";
    } else {
      interpretation = "Favourable cervix – high likelihood of successful induction.";
    }

    setResult({ total, interpretation });
  }

  return (
    <div>
      <h2>Bishop Score Calculator</h2>

      <p style={{ fontSize: "0.9em" }}>
        <em>
          Assesses cervical readiness for induction of labour.
        </em>
      </p>

      {/* Dilation */}
      <label>
        Cervical Dilatation (cm):
        <br />
        <select value={dilation} onChange={e => setDilation(e.target.value)}>
          <option value="">Select</option>
          <option value="0">Closed</option>
          <option value="1">1–2 cm</option>
          <option value="2">3–4 cm</option>
          <option value="3">≥ 5 cm</option>
        </select>
      </label>

      <p />

      {/* Effacement */}
      <label>
        Cervical Effacement (%):
        <br />
        <select value={effacement} onChange={e => setEffacement(e.target.value)}>
          <option value="">Select</option>
          <option value="0">0–30%</option>
          <option value="1">40–50%</option>
          <option value="2">60–70%</option>
          <option value="3">≥ 80%</option>
        </select>
      </label>

      <p />

      {/* Consistency */}
      <label>
        Cervical Consistency:
        <br />
        <select value={consistency} onChange={e => setConsistency(e.target.value)}>
          <option value="">Select</option>
          <option value="0">Firm</option>
          <option value="1">Medium</option>
          <option value="2">Soft</option>
        </select>
      </label>

      <p />

      {/* Position */}
      <label>
        Cervical Position:
        <br />
        <select value={position} onChange={e => setPosition(e.target.value)}>
          <option value="">Select</option>
          <option value="0">Posterior</option>
          <option value="1">Mid-position</option>
          <option value="2">Anterior</option>
        </select>
      </label>

      <p />

      {/* Station */}
      <label>
        Fetal Station:
        <br />
        <select value={station} onChange={e => setStation(e.target.value)}>
          <option value="">Select</option>
          <option value="0">−3</option>
          <option value="1">−2</option>
          <option value="2">−1 / 0</option>
          <option value="3">+1 / +2</option>
        </select>
      </label>

      <p />

      <button onClick={calculateScore}>Calculate</button>

      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>
                <strong>Total Bishop Score:</strong> {result.total}
              </p>
              <p>
                <strong>Interpretation:</strong> {result.interpretation}
              </p>
              <p style={{ fontSize: "0.9em" }}>
                <em>
                  Score ≥ 8 predicts successful induction.  
                  Score ≤ 5 suggests need for cervical ripening.
                </em>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
