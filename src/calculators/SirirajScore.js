import React, { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function SirirajScore() {
  const [consciousness, setConsciousness] = useState(0);
  const [vomiting, setVomiting] = useState(0);
  const [headache, setHeadache] = useState(0);
  const [dbp, setDbp] = useState("70");
  const [atheroma, setAtheroma] = useState(0);
  const [score, setScore] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  // Auto-calculate whenever inputs change
  useEffect(() => {
    if (dbp === "") {
      setScore(null);
      setInterpretation("");
      return;
    }

    const dbpVal = Number(dbp) || 0;
    const result =
      (2.5 * consciousness) +
      (2 * vomiting) +
      (2 * headache) +
      (0.1 * dbpVal) -
      (3 * atheroma) -
      12;

    setScore(result.toFixed(2));

    if (result > 1) {
      setInterpretation("Likely Hemorrhagic Stroke");
    } else if (result < -1) {
      setInterpretation("Likely Ischemic Stroke");
    } else {
      setInterpretation("Indeterminate (Grey Zone) → Imaging required");
    }
  }, [consciousness, vomiting, headache, dbp, atheroma]);

  const resetAll = () => {
    setConsciousness(0);
    setVomiting(0);
    setHeadache(0);
    setDbp("");
    setAtheroma(0);
    setScore(null);
    setInterpretation("");
  };

  return (
    <div className="calc-container">
      <h4 className="calc-title">Siriraj Stroke Score</h4>

      <div className="calc-box">
        <label className="calc-label">Consciousness:</label>
        <select
          className="calc-select"
          value={consciousness}
          onChange={(e) => setConsciousness(Number(e.target.value))}
        >
          <option value={0}>Alert</option>
          <option value={1}>Drowsy/Stuporous</option>
          <option value={2}>Semi-coma/Coma</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">Vomiting:</label>
        <select
          className="calc-select"
          value={vomiting}
          onChange={(e) => setVomiting(Number(e.target.value))}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">Headache:</label>
        <select
          className="calc-select"
          value={headache}
          onChange={(e) => setHeadache(Number(e.target.value))}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">Diastolic BP (mmHg):</label>
        <input
          type="number"
          className="calc-input"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          placeholder="e.g. 90"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Atheroma markers:</label>
        <select
          className="calc-select"
          value={atheroma}
          onChange={(e) => setAtheroma(Number(e.target.value))}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </div>

      <button onClick={resetAll} className="calc-btn-reset">Reset</button>

      {score !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Score:</strong> {score}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}
