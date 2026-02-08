import { useState } from "react";
import "./CalculatorShared.css";

// Move criteria outside the component to avoid missing deps warning
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

export default function WellsDVTScore() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [interpretation, setInterpretation] = useState("");

  // Toggle checkbox and recalc immediately
  const toggle = (key) => {
    const newAnswers = { ...answers, [key]: !answers[key] };
    setAnswers(newAnswers);

    // Auto-calc
    let total = 0;
    criteria.forEach((c) => {
      if (newAnswers[c.key]) total += c.points;
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
    setAnswers({});
    setScore(0);
    setInterpretation("");
  };

  return (
    <div className="calc-container" style={{ maxWidth: 500 }}>

      <div className="calc-box">
        {criteria.map((c) => (
          <label key={c.key} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!answers[c.key]}
              onChange={() => toggle(c.key)}
              style={{ marginRight: 8 }}
            />
            {c.label} {c.points > 0 ? `(+${c.points})` : `(${c.points})`}
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset">
        Reset
      </button>

      <div className="calc-result" style={{ marginTop: 16 }}>
        <strong>Total Score:</strong> {score} <br />
        <strong>Interpretation:</strong> {interpretation}
      </div>
    </div>
  );
}
