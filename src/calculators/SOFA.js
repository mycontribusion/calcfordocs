import React, { useState } from "react";

export default function SOFA() {
  const [mode, setMode] = useState("qsofa");

  /* ================= qSOFA ================= */
  const [rr, setRr] = useState("");
  const [sbp, setSbp] = useState("");
  const [gcsQ, setGcsQ] = useState("");
  const [qsofaResult, setQsofaResult] = useState(null);

  const calculateQSOFA = () => {
    let score = 0;
    if (Number(rr) >= 22) score++;
    if (Number(sbp) <= 100) score++;
    if (Number(gcsQ) < 15) score++;

    let interpretation = "";
    if (score === 0) interpretation = "Low immediate risk";
    else if (score === 1) interpretation = "Intermediate risk → close monitoring";
    else interpretation = "High risk → urgent sepsis assessment";

    setQsofaResult({ score, interpretation });
  };

  /* ================= mSOFA ================= */
  const [spo2fio2, setSpo2fio2] = useState("");
  const [liver, setLiver] = useState("none");
  const [map, setMap] = useState("");
  const [vasopressor, setVasopressor] = useState("none");
  const [gcsM, setGcsM] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("umol");
  const [msofaResult, setMsofaResult] = useState(null);

  const calculateRespiratory = (value) => {
    if (value > 400) return 0;
    if (value <= 150) return 4;
    if (value <= 235) return 3;
    if (value <= 315) return 2;
    return 1;
  };

  const calculateCNS = (gcs) => {
    if (gcs === 15) return 0;
    if (gcs >= 13) return 1;
    if (gcs >= 10) return 2;
    if (gcs >= 6) return 3;
    return 4;
  };

  const convertCreatinineToMg = (value) =>
    creatinineUnit === "umol" ? value / 88.4 : value;

  const calculateRenal = (mg) => {
    if (mg < 1.2) return 0;
    if (mg <= 1.9) return 1;
    if (mg <= 3.4) return 2;
    if (mg <= 4.9) return 3;
    return 4;
  };

  const calculateCardio = () => {
    const mapVal = Number(map);
    switch (vasopressor) {
      case "dopamineLow":
      case "dobutamine":
        return 2;
      case "dopamineMid":
      case "epiLow":
      case "norepiLow":
        return 3;
      case "dopamineHigh":
      case "epiHigh":
      case "norepiHigh":
        return 4;
      default:
        return mapVal >= 70 ? 0 : 1;
    }
  };

  const calculateMSOFA = () => {
    const resp = calculateRespiratory(Number(spo2fio2));
    const liverScore = liver === "jaundice" ? 3 : 0;
    const cardio = calculateCardio();
    const cns = calculateCNS(Number(gcsM));
    const renal = calculateRenal(convertCreatinineToMg(Number(creatinine)));

    const total = resp + liverScore + cardio + cns + renal;

    let interpretation = "";
    if (total <= 4) interpretation = "Mild organ dysfunction";
    else if (total <= 9)
      interpretation = "Moderate dysfunction → increased mortality risk";
    else interpretation = "Severe dysfunction → ICU-level care likely required";

    setMsofaResult({
      resp,
      liver: liverScore,
      cardio,
      cns,
      renal,
      total,
      interpretation,
    });
  };

  return (
    <div>
      <h2>SOFA Calculator</h2>

      <label>
        Select Calculator:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="qsofa">qSOFA</option>
          <option value="msofa">mSOFA</option>
        </select>
      </label>

      {/* ================= qSOFA UI ================= */}
      {mode === "qsofa" && (
        <div>
          <h3>qSOFA</h3>

          Respiratory Rate: <br/><input
            placeholder="Respiratory Rate"
            value={rr}
            onChange={(e) => setRr(e.target.value)}
          />
          <p></p>Systolic BP: <br/><input
            placeholder="Systolic BP"
            value={sbp}
            onChange={(e) => setSbp(e.target.value)}
          />
          <p></p>GCS: <br/><input
            placeholder="GCS"
            value={gcsQ}
            onChange={(e) => setGcsQ(e.target.value)}
          />

          <p></p><button onClick={calculateQSOFA}>Calculate</button>

          {qsofaResult && (
            <div><p></p>
              <span>Score: {qsofaResult.score} / 3</span><br />
              <span style={{fontSize:"small"}}>{qsofaResult.interpretation}</span>
            </div>
          )}
        </div>
      )}

      {/* ================= mSOFA UI ================= */}
      {mode === "msofa" && (
        <div>
          <h3>mSOFA</h3>

          <input
            placeholder="SpO₂ / FiO₂ Ratio"
            value={spo2fio2}
            onChange={(e) => setSpo2fio2(e.target.value)}
          />

          <p></p><select value={liver} onChange={(e) => setLiver(e.target.value)}>
            <option value="none">No jaundice</option>
            <option value="jaundice">Jaundice present</option>
          </select>

          <p></p><input
            placeholder="MAP"
            value={map}
            onChange={(e) => setMap(e.target.value)}
          />

          <select
            value={vasopressor}
            onChange={(e) => setVasopressor(e.target.value)}
          >
            <option value="none">No vasopressors</option>
            <option value="dopamineLow">Dopamine ≤5</option>
            <option value="dopamineMid">Dopamine &gt;5</option>
            <option value="dopamineHigh">Dopamine &gt;15</option>
            <option value="dobutamine">Dobutamine (any dose)</option>
            <option value="epiLow">Epinephrine ≤0.1</option>
            <option value="epiHigh">Epinephrine &gt;0.1</option>
            <option value="norepiLow">Norepinephrine ≤0.1</option>
            <option value="norepiHigh">Norepinephrine &gt;0.1</option>
          </select>

          <p></p><input
            placeholder="GCS"
            value={gcsM}
            onChange={(e) => setGcsM(e.target.value)}
          />

          <p></p><input
            placeholder="Creatinine"
            value={creatinine}
            onChange={(e) => setCreatinine(e.target.value)}
          />

          <select
            value={creatinineUnit}
            onChange={(e) => setCreatinineUnit(e.target.value)}
          >
            <option value="umol">µmol/L</option>
            <option value="mg">mg/dL</option>
          </select>

          <p></p><button onClick={calculateMSOFA}>Calculate</button>

          {msofaResult && (
            <div style={{fontSize:"small"}}><p></p>
              <span>Respiratory: {msofaResult.resp}</span><br />
              <span>Liver: {msofaResult.liver}</span><br />
              <span>Cardiovascular: {msofaResult.cardio}</span><br />
              <span>CNS: {msofaResult.cns}</span><br />
              <span>Renal: {msofaResult.renal}</span><p></p>
              <span style={{fontSize:"large"}}>Score: {msofaResult.total} / 24</span><br />
              <span style={{fontSize:"small"}}>{msofaResult.interpretation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
