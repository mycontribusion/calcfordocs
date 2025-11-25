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
    altDx: false, // subtracts 2 if yes
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

    // Interpretation (3-tier)
    let interp = "";
    if (total >= 3) interp = "High probability of DVT";
    else if (total >= 1) interp = "Moderate probability of DVT";
    else interp = "Low probability of DVT";

    // Simplified recommendation
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
    <div style={styles.container}>
      <h2 style={styles.title}>Wells Score for DVT</h2>

      <div style={styles.criteriaList}>
        {criteria.map((c) => (
          <label key={c.key} style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={answers[c.key]}
              onChange={() => toggle(c.key)}
              style={{ marginRight: "8px" }}
            />
            {c.label} {c.points > 0 ? `(+${c.points})` : `(${c.points})`}
          </label>
        ))}
      </div>

      <div style={styles.buttons}>
        <button onClick={calculate} style={styles.calcBtn}>Calculate</button>
        <button onClick={reset} style={styles.resetBtn}>Reset</button>
      </div>

      {score !== null && (
        <div style={styles.result}>
          <div><strong>Total Score:</strong> {score}</div>
          <div><strong>Interpretation:</strong> {interpretation}</div>
        </div>
      )}
    </div>
  );
}

// -------------------- STYLES --------------------
const styles = {
  container: {
    width: "90%",
    maxWidth: "450px",
    margin: "20px auto",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "1.3rem",
  },
  criteriaList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.92rem",
    lineHeight: "1.3",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    gap: "10px",
    flexWrap: "wrap",
  },
  calcBtn: {
    flex: 1,
    padding: "8px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resetBtn: {
    flex: 1,
    padding: "8px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  result: {
    marginTop: "20px",
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
  },
};
