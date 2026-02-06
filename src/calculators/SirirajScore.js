import React, { useState, useEffect } from "react";

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

  const containerStyle = {
    maxWidth: "400px",
    margin: "20px auto",
    fontFamily: "sans-serif",
    padding: "16px",
    border: "1px solid",
    borderRadius: "6px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
  };

  const inputStyle = {
    marginLeft: "8px",
    padding: "4px",
  };

  const buttonStyle = {
    marginTop: "12px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const resultStyle = {
    marginTop: "16px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid",
  };

  return (
    <div style={containerStyle}>
      <h2>Siriraj Stroke Score</h2>

      <label style={labelStyle}>
        Consciousness:
        <select
          value={consciousness}
          onChange={(e) => setConsciousness(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>Alert</option>
          <option value={1}>Drowsy/Stuporous</option>
          <option value={2}>Semi-coma/Coma</option>
        </select>
      </label>

      <label style={labelStyle}>
        Vomiting:
        <select
          value={vomiting}
          onChange={(e) => setVomiting(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </label>

      <label style={labelStyle}>
        Headache:
        <select
          value={headache}
          onChange={(e) => setHeadache(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </label>

      <label style={labelStyle}>
        Diastolic BP (mmHg):
        <input
          type="number"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          placeholder="e.g. 90"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Atheroma markers:
        <select
          value={atheroma}
          onChange={(e) => setAtheroma(Number(e.target.value))}
          style={inputStyle}
        >
          <option value={0}>Absent</option>
          <option value={1}>Present</option>
        </select>
      </label>

      <button onClick={resetAll} style={buttonStyle}>Reset</button>

      {score !== null && (
        <div style={resultStyle}>
          <p><strong>Score:</strong> {score}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
        </div>
      )}
    </div>
  );
}
