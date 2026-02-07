import React, { useState } from "react";
import "./CalculatorShared.css";

export default function CHA2DS2VASc() {
  const criteria = [
    { label: "Congestive heart failure / LV dysfunction", value: 1 },
    { label: "Hypertension (treated or untreated)", value: 1 },
    { label: "Age ≥ 75 years", value: 2 },
    { label: "Diabetes mellitus", value: 1 },
    { label: "Stroke / TIA / thromboembolism history", value: 2 },
    { label: "Vascular disease (MI, PAD, aortic plaque)", value: 1 },
    { label: "Age 65–74 years", value: 1 },
    { label: "Female sex", value: 1 },
  ];

  const [checked, setChecked] = useState({});
  const [score, setScore] = useState(0);
  const [interpretation, setInterpretation] = useState("");

  const toggle = (label) => {
    const updated = { ...checked, [label]: !checked[label] };
    setChecked(updated);

    // calculate new score
    let sum = 0;
    criteria.forEach((c) => {
      if (updated[c.label]) sum += c.value;
    });

    setScore(sum);
    interpret(sum, updated);
  };

  const interpret = (sum, updated) => {
    let sex = updated["Female sex"] ? "female" : "male";

    // CHA₂DS₂-VASc interpretation rules
    let text = "";

    if (sex === "male") {
      if (sum === 0) text = "Low risk — no anticoagulation needed.";
      else if (sum === 1)
        text = "Intermediate risk — consider anticoagulation.";
      else text = "High risk — anticoagulation recommended.";
    } else {
      // female
      if (sum === 1) text = "Low risk — no anticoagulation needed.";
      else if (sum === 2)
        text = "Intermediate risk — consider anticoagulation.";
      else if (sum >= 3) text = "High risk — anticoagulation recommended.";
    }

    setInterpretation(text);
  };

  const reset = () => {
    setChecked({});
    setScore(0);
    setInterpretation("");
  };

  return (
    <div className="calc-container">
      <h3 className="calc-title" style={{ fontSize: '1.2rem', marginBottom: 16 }}>CHA₂DS₂-VASc Score (Atrial Fibrillation Stroke Risk)</h3>

      <div className="calc-box">
        {criteria.map((c) => (
          <label key={c.label} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checked[c.label] || false}
              onChange={() => toggle(c.label)}
              style={{ marginRight: 10 }}
            />
            <span>{c.label} ({c.value} point{c.value > 1 ? "s" : ""})</span>
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset</button>

      {(score > 0 || interpretation) && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Total Score:</strong> {score}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}
