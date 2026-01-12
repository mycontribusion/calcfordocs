import { useState, useMemo } from "react";

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
    <div className="card">
      <h2>Bishop Score Calculator</h2>

      <label>
        Scoring system:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="traditional">Traditional Bishop Score</option>
          <option value="modified">Modified Bishop Score</option>
        </select>
      </label>

      {mode === "traditional" && (
        <>
          <h4>Traditional Parameters</h4>

          <label>
            Cervical dilation
            <select value={dilation} onChange={(e) => setDilation(e.target.value)}>
              <option value={0}>Closed</option>
              <option value={1}>1–2 cm</option>
              <option value={2}>3–4 cm</option>
              <option value={3}>≥5 cm</option>
            </select>
          </label><p></p>

          <label>
            Effacement
            <select value={effacement} onChange={(e) => setEffacement(e.target.value)}>
              <option value={0}>0–30%</option>
              <option value={1}>40–50%</option>
              <option value={2}>60–70%</option>
              <option value={3}>≥80%</option>
            </select>
          </label><p></p>

          <label>
            Fetal station
            <select value={station} onChange={(e) => setStation(e.target.value)}>
              <option value={0}>−3</option>
              <option value={1}>−2</option>
              <option value={2}>−1 / 0</option>
              <option value={3}>+1 / +2</option>
            </select>
          </label><p></p>

          <label>
            Cervical position
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value={0}>Posterior</option>
              <option value={1}>Mid-position</option>
              <option value={2}>Anterior</option>
            </select>
          </label><p></p>

          <label>
            Cervical consistency
            <select value={consistency} onChange={(e) => setConsistency(e.target.value)}>
              <option value={0}>Firm</option>
              <option value={1}>Medium</option>
              <option value={2}>Soft</option>
            </select>
          </label>
        </>
      )}

      {mode === "modified" && (
        <>
          <h4>Modified Parameters</h4>

          <label>
            Cervical dilation
            <select
              value={modDilation}
              onChange={(e) => setModDilation(e.target.value)}
            >
              <option value={0}>0 cm</option>
              <option value={2}>1–2 cm</option>
              <option value={4}>3–4 cm</option>
              <option value={6}>≥5 cm</option>
            </select>
          </label><p></p>

          <label>
            Cervical length
            <select
              value={cervicalLength}
              onChange={(e) => setCervicalLength(e.target.value)}
            >
              <option value={0}>&gt; 2.5 cm</option>
              <option value={1}>1.5–2.5 cm</option>
              <option value={2}>0.5–1.5 cm</option>
              <option value={3}>&le; 0.5 cm</option>
            </select>
          </label><p></p>

          <label>
            Fetal station
            <select
              value={modStation}
              onChange={(e) => setModStation(e.target.value)}
            >
              <option value={0}>−3</option>
              <option value={1}>−2</option>
              <option value={2}>−1 / 0</option>
              <option value={3}>+1 / +2</option>
            </select>
          </label>
        </>
      )}

      <hr />

      <h3>Total Score: {totalScore}</h3>
      <p><strong>Interpretation:</strong> {interpretation}</p>
    </div>
  );
}
