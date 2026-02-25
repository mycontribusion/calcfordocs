import { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  mode: "traditional",
  dilation: 0,
  effacement: 0,
  station: 0,
  position: 0,
  consistency: 0,
  modDilation: 0,
  cervicalLength: 0,
  modStation: 0,
  // Global Sync Keys
  age: "",
  sex: "female",
};

export default function BishopScore() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const totalScore = useMemo(() => {
    if (values.mode === "traditional") {
      return (
        Number(values.dilation) +
        Number(values.effacement) +
        Number(values.station) +
        Number(values.position) +
        Number(values.consistency)
      );
    }

    return (
      Number(values.modDilation) +
      Number(values.cervicalLength) +
      Number(values.modStation)
    );
  }, [values]);

  const interpretation = useMemo(() => {
    if (values.mode === "traditional") {
      return totalScore > 8
        ? "Favorable cervix (high likelihood of successful induction)"
        : "Unfavorable cervix (low likelihood of successful induction)";
    }

    return totalScore >= 5
      ? "Favorable cervix"
      : "Unfavorable cervix";
  }, [values.mode, totalScore]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Scoring system:</label>
        <select value={values.mode} onChange={(e) => setField("mode", e.target.value)} className="calc-select">
          <option value="traditional">Traditional Bishop Score</option>
          <option value="modified">Modified Bishop Score</option>
        </select>
      </div>

      {values.mode === "traditional" && (
        <div className="calc-box">
          <h4 className="calc-label" style={{ marginBottom: 16 }}>Traditional Parameters</h4>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical dilation</label>
            <select value={values.dilation} onChange={(e) => setField("dilation", e.target.value)} className="calc-select">
              <option value={0}>Closed</option>
              <option value={1}>1–2 cm</option>
              <option value={2}>3–4 cm</option>
              <option value={3}>≥5 cm</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Effacement</label>
            <select value={values.effacement} onChange={(e) => setField("effacement", e.target.value)} className="calc-select">
              <option value={0}>0–30%</option>
              <option value={1}>40–50%</option>
              <option value={2}>60–70%</option>
              <option value={3}>≥80%</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Fetal station</label>
            <select value={values.station} onChange={(e) => setField("station", e.target.value)} className="calc-select">
              <option value={0}>−3</option>
              <option value={1}>−2</option>
              <option value={2}>−1 / 0</option>
              <option value={3}>+1 / +2</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical position</label>
            <select value={values.position} onChange={(e) => setField("position", e.target.value)} className="calc-select">
              <option value={0}>Posterior</option>
              <option value={1}>Mid-position</option>
              <option value={2}>Anterior</option>
            </select>
          </div>

          <div>
            <label className="calc-label">Cervical consistency</label>
            <select value={values.consistency} onChange={(e) => setField("consistency", e.target.value)} className="calc-select">
              <option value={0}>Firm</option>
              <option value={1}>Medium</option>
              <option value={2}>Soft</option>
            </select>
          </div>
        </div>
      )}

      {values.mode === "modified" && (
        <div className="calc-box">
          <h4 className="calc-label" style={{ marginBottom: 16 }}>Modified Parameters</h4>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical dilation</label>
            <select value={values.modDilation} onChange={(e) => setField("modDilation", e.target.value)} className="calc-select">
              <option value={0}>0 cm</option>
              <option value={2}>1–2 cm</option>
              <option value={4}>3–4 cm</option>
              <option value={6}>≥5 cm</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="calc-label">Cervical length</label>
            <select value={values.cervicalLength} onChange={(e) => setField("cervicalLength", e.target.value)} className="calc-select">
              <option value={0}>&gt; 2.5 cm</option>
              <option value={1}>1.5–2.5 cm</option>
              <option value={2}>0.5–1.5 cm</option>
              <option value={3}>&le; 0.5 cm</option>
            </select>
          </div>

          <div>
            <label className="calc-label">Fetal station</label>
            <select value={values.modStation} onChange={(e) => setField("modStation", e.target.value)} className="calc-select">
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
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}
