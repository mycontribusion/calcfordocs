import { useState, useMemo } from "react";
import "./CalculatorShared.css";

export default function BishopScore() {
  const [mode, setMode] = useState("traditional");

  // Traditional inputs
  const [dilation, setDilation] = useState(0);
  const [effacement, setEffacement] = useState(0);
  const [station, setStation] = useState(0);
  const [position, setPosition] = useState(0);
  const [consistency, setConsistency] = useState(0);

  // Modified inputs
  const [modDilation, setModDilation] = useState(0);
  const [cervicalLength, setCervicalLength] = useState(0);
  const [modStation, setModStation] = useState(0);

  const totalScore = useMemo(() => {
    if (mode === "traditional") {
      return (
        Number(dilation) +
        Number(effacement) +
        Number(station) +
        Number(position) +
        Number(consistency)
      );
    }

    return (
      Number(modDilation) +
      Number(cervicalLength) +
      Number(modStation)
    );
  }, [
    mode,
    dilation,
    effacement,
    station,
    position,
    consistency,
    modDilation,
    cervicalLength,
    modStation
  ]);

  const interpretation = useMemo(() => {
    if (mode === "traditional") {
      return totalScore > 8
        ? "Favorable cervix (high likelihood of successful induction)"
        : "Unfavorable cervix (low likelihood of successful induction)";
    }

    return totalScore >= 5
      ? "Favorable cervix"
      : "Unfavorable cervix";
  }, [mode, totalScore]);

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Scoring system:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="calc-select">
          <option value="traditional">Traditional Bishop Score</option>
          <option value="modified">Modified Bishop Score</option>
        </select>
      </div>

      {mode === "traditional" && (
        <div className="calc-box">
          <h4 className="calc-label" style={{ marginBottom: 16 }}>Traditional Parameters</h4>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical dilation</label>
            <select value={dilation} onChange={(e) => setDilation(e.target.value)} className="calc-select">
              <option value={0}>Closed</option>
              <option value={1}>1–2 cm</option>
              <option value={2}>3–4 cm</option>
              <option value={3}>≥5 cm</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Effacement</label>
            <select value={effacement} onChange={(e) => setEffacement(e.target.value)} className="calc-select">
              <option value={0}>0–30%</option>
              <option value={1}>40–50%</option>
              <option value={2}>60–70%</option>
              <option value={3}>≥80%</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Fetal station</label>
            <select value={station} onChange={(e) => setStation(e.target.value)} className="calc-select">
              <option value={0}>−3</option>
              <option value={1}>−2</option>
              <option value={2}>−1 / 0</option>
              <option value={3}>+1 / +2</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical position</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="calc-select">
              <option value={0}>Posterior</option>
              <option value={1}>Mid-position</option>
              <option value={2}>Anterior</option>
            </select>
          </div>

          <div>
            <label className="calc-label">Cervical consistency</label>
            <select value={consistency} onChange={(e) => setConsistency(e.target.value)} className="calc-select">
              <option value={0}>Firm</option>
              <option value={1}>Medium</option>
              <option value={2}>Soft</option>
            </select>
          </div>
        </div>
      )}

      {mode === "modified" && (
        <div className="calc-box">
          <h4 className="calc-label" style={{ marginBottom: 16 }}>Modified Parameters</h4>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical dilation</label>
            <select value={modDilation} onChange={(e) => setModDilation(e.target.value)} className="calc-select">
              <option value={0}>0 cm</option>
              <option value={2}>1–2 cm</option>
              <option value={4}>3–4 cm</option>
              <option value={6}>≥5 cm</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical length</label>
            <select value={cervicalLength} onChange={(e) => setCervicalLength(e.target.value)} className="calc-select">
              <option value={0}>&gt; 2.5 cm</option>
              <option value={1}>1.5–2.5 cm</option>
              <option value={2}>0.5–1.5 cm</option>
              <option value={3}>&le; 0.5 cm</option>
            </select>
          </div>

          <div>
            <label className="calc-label">Fetal station</label>
            <select value={modStation} onChange={(e) => setModStation(e.target.value)} className="calc-select">
              <option value={0}>−3</option>
              <option value={1}>−2</option>
              <option value={2}>−1 / 0</option>
              <option value={3}>+1 / +2</option>
            </select>
          </div>
        </div>
      )}

      <div className="calc-result">
        <h3>Total Score: {totalScore}</h3>
        <p style={{ margin: 0, fontWeight: "normal", fontSize: "0.9rem" }}>{interpretation}</p>
      </div>
    </div>
  );
}
