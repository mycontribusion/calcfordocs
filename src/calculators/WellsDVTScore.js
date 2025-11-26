import React, { useState } from "react";

export default function WellsDVTScore() {
  const [answers, setAnswers] = useState({
    cancer: false,
    paralysis: false,
    bedridden: false,
    tenderness: false,
    legSwollen: false,
    calfDiff: false,
    edema: false,
    collateral: false,
    prevDvt: false,
    altDx: false,
  });

  const [score, setScore] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  const criteria = [
    { key: "cancer", label: "Active cancer (treatment within 6 months or palliative)", points: 1 },
    { key: "paralysis", label: "Paralysis, paresis, or recent immobilization of lower limb", points: 1 },
    { key: "bedridden", label: "Recently bedridden ≥ 3 days OR major surgery within 12 weeks", points: 1 },
    { key: "tenderness", label: "Localized tenderness along the deep venous system", points: 1 },
    { key: "legSwollen", label: "Entire leg swollen", points: 1 },
    { key: "calfDiff", label: "Calf swelling ≥ 3 cm compared to the other leg", points: 1 },
    { key: "edema", label: "Pitting edema confined to symptomatic leg", points: 1 },
    { key: "collateral", label: "Collateral superficial (non-varicose) veins", points: 1 },
    { key: "prevDvt", label: "Previous DVT", points: 1 },
    { key: "altDx", label: "Alternative diagnosis more likely than DVT", points: -2 },
  ];

  const toggle = (key) => {
    setAnswers({ ...answers, [key]: !answers[key] });
  };

  const calculate = () => {
    let total = 0;
    criteria.forEach((c) => {
      if (answers[c.key]) total += c.points;
    });
    setScore(total);

    let interp = "";
    if (total >= 3) interp = "High probability of DVT";
    else if (total >= 1) interp = "Moderate probability of DVT";
    else interp = "Low probability of DVT";

    if (total >= 2) interp += " — DVT likely.";
    else interp += " — DVT unlikely.";

    setInterpretation(interp);
  };

  const reset = () => {
    setAnswers({
      cancer: false,
      paralysis: false,
      bedridden: false,
      tenderness: false,
      legSwollen: false,
      calfDiff: false,
      edema: false,
      collateral: false,
      prevDvt: false,
      altDx: false,
    });
    setScore(null);
    setInterpretation("");
  };

  return (
    <div>
      <h2>Wells Score for DVT</h2>

      {criteria.map((c) => (
        <div key={c.key}>
          <label>
            <input
              type="checkbox"
              checked={answers[c.key]}
              onChange={() => toggle(c.key)}
            />
            {c.label} {c.points > 0 ? `(+${c.points})` : `(${c.points})`}
          </label>
        </div>
      ))}

      <div style={{ marginTop: "10px" }}>
        <button onClick={calculate}>Calculate</button>
        <button onClick={reset}>Reset</button>
      </div>

      {score !== null && (
        <div style={{ marginTop: "10px" }}>
          <div><strong>Total Score:</strong> {score}</div>
          <div><strong>Interpretation:</strong> {interpretation}</div>
        </div>
      )}
    </div>
  );
}
