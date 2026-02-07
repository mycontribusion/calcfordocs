import React, { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function SOFA() {
  const [mode, setMode] = useState("qsofa");

  /* ================= qSOFA ================= */
  const [rrHigh, setRrHigh] = useState(false);
  const [sbpLow, setSbpLow] = useState(false);
  const [gcsLow, setGcsLow] = useState(false);
  const [qsofaResult, setQsofaResult] = useState({
    score: 0,
    interpretation: "Low immediate risk",
  });

  /* ================= mSOFA ================= */
  const [spo2fio2, setSpo2fio2] = useState("");
  const [liver, setLiver] = useState("none");
  const [map, setMap] = useState("");
  const [vasopressor, setVasopressor] = useState("none");
  const [gcsM, setGcsM] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [creatinineUnit, setCreatinineUnit] = useState("umol");
  const [msofaResult, setMsofaResult] = useState({
    resp: 0,
    liver: 0,
    cardio: 0,
    cns: 0,
    renal: 0,
    total: 0,
    interpretation: "No organ dysfunction detected",
  });

  /* ================= qSOFA AUTO ================= */
  useEffect(() => {
    const score =
      (rrHigh ? 1 : 0) +
      (sbpLow ? 1 : 0) +
      (gcsLow ? 1 : 0);

    const interpretation =
      score === 0
        ? "Low immediate risk"
        : score === 1
          ? "Intermediate risk → close monitoring"
          : "High risk → urgent sepsis assessment";

    setQsofaResult({ score, interpretation });
  }, [rrHigh, sbpLow, gcsLow]);

  /* ================= mSOFA AUTO ================= */
  useEffect(() => {
    /* Respiratory */
    let resp = 0;
    if (spo2fio2 === "≤150") resp = 4;
    else if (spo2fio2 === "151-235") resp = 3;
    else if (spo2fio2 === "236-315") resp = 2;
    else if (spo2fio2 === "316-400") resp = 1;

    /* Liver */
    const liverScore = liver === "jaundice" ? 3 : 0;

    /* Cardiovascular */
    let cardio = 0;
    if (vasopressor === "dopamineLow" || vasopressor === "dobutamine") cardio = 2;
    else if (
      vasopressor === "dopamineMid" ||
      vasopressor === "epiLow" ||
      vasopressor === "norepiLow"
    )
      cardio = 3;
    else if (
      vasopressor === "dopamineHigh" ||
      vasopressor === "epiHigh" ||
      vasopressor === "norepiHigh"
    )
      cardio = 4;
    else if (map === "<70") cardio = 1;

    /* CNS */
    let cns = 0;
    if (gcsM === "3-5") cns = 4;
    else if (gcsM === "6-9") cns = 3;
    else if (gcsM === "10-12") cns = 2;
    else if (gcsM === "13-14") cns = 1;

    /* Renal */
    let renal = 0;
    let crMg =
      creatinineUnit === "umol"
        ? creatinine === "≥442"
          ? 5
          : creatinine === "309-441"
            ? 3.5
            : creatinine === "177-308"
              ? 2
              : creatinine === "106-176"
                ? 1.2
                : 0
        : creatinine === "≥5"
          ? 5
          : creatinine === "3.5-4.9"
            ? 3.5
            : creatinine === "2-3.4"
              ? 2
              : creatinine === "1.2-1.9"
                ? 1.2
                : 0;

    if (crMg >= 5) renal = 4;
    else if (crMg >= 3.5) renal = 3;
    else if (crMg >= 2) renal = 2;
    else if (crMg >= 1.2) renal = 1;

    const total = resp + liverScore + cardio + cns + renal;

    const interpretation =
      total === 0
        ? "No organ dysfunction detected"
        : total <= 4
          ? "Mild organ dysfunction"
          : total <= 9
            ? "Moderate dysfunction → increased mortality risk"
            : "Severe dysfunction → ICU-level care likely required";

    setMsofaResult({
      resp,
      liver: liverScore,
      cardio,
      cns,
      renal,
      total,
      interpretation,
    });
  }, [
    spo2fio2,
    liver,
    map,
    vasopressor,
    gcsM,
    creatinine,
    creatinineUnit,
  ]);

  /* ================= RESET ================= */
  const resetCurrent = () => {
    if (mode === "qsofa") {
      setRrHigh(false);
      setSbpLow(false);
      setGcsLow(false);
    } else {
      setSpo2fio2("");
      setLiver("none");
      setMap("");
      setVasopressor("none");
      setGcsM("");
      setCreatinine("");
      setCreatinineUnit("umol");
    }
  };

  return (
    <div className="calc-container">
      <h2 className="calc-title">SOFA Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">Mode:</label>
        <select
          className="calc-select"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="qsofa">qSOFA</option>
          <option value="msofa">mSOFA</option>
        </select>
      </div>

      <button onClick={resetCurrent} className="calc-btn-reset" style={{ marginBottom: 16 }}>
        Reset
      </button>

      {mode === "qsofa" && (
        <div>
          <h3 className="calc-title" style={{ fontSize: '1rem', marginTop: 10 }}>qSOFA Criteria</h3>
          <div className="calc-box">
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={rrHigh} onChange={() => setRrHigh(!rrHigh)} style={{ marginRight: 10 }} />
              RR ≥ 22
            </label>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={sbpLow} onChange={() => setSbpLow(!sbpLow)} style={{ marginRight: 10 }} />
              SBP ≤ 100
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={gcsLow} onChange={() => setGcsLow(!gcsLow)} style={{ marginRight: 10 }} />
              GCS &lt; 15
            </label>
          </div>

          <div className="calc-result">
            <p><strong>Score:</strong> {qsofaResult.score} / 3</p>
            <p>{qsofaResult.interpretation}</p>
          </div>
        </div>
      )}

      {mode === "msofa" && (
        <div>
          <h3 className="calc-title" style={{ fontSize: '1rem', marginTop: 10 }}>mSOFA Criteria</h3>

          <div className="calc-box">
            <label className="calc-label">SpO₂ / FiO₂:</label>
            <select
              className="calc-select"
              value={spo2fio2}
              onChange={e => setSpo2fio2(e.target.value)}
            >
              <option value="">Select</option>
              <option value="≤150">≤150</option>
              <option value="151-235">151–235</option>
              <option value="236-315">236–315</option>
              <option value="316-400">316–400</option>
              <option value=">400">&gt;400</option>
            </select>
          </div>

          <div className="calc-box">
            <label className="calc-label">Jaundice:</label>
            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="radio" name="liver" value="none" checked={liver === "none"} onChange={e => setLiver(e.target.value)} style={{ marginRight: 6 }} /> No
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="radio" name="liver" value="jaundice" checked={liver === "jaundice"} onChange={e => setLiver(e.target.value)} style={{ marginRight: 6 }} /> Yes
              </label>
            </div>
          </div>

          <div className="calc-box">
            <label className="calc-label">MAP:</label>
            <select
              className="calc-select"
              value={map}
              onChange={e => setMap(e.target.value)}
              style={{ marginBottom: 8 }}
            >
              <option value="">Select</option>
              <option value="<70">&lt;70</option>
              <option value="≥70">≥70</option>
            </select>

            <select
              className="calc-select"
              value={vasopressor}
              onChange={e => setVasopressor(e.target.value)}
            >
              <option value="none">No Vasopressor</option>
              <option value="dopamineLow">Dopamine ≤5</option>
              <option value="dopamineMid">Dopamine &gt;5</option>
              <option value="dopamineHigh">Dopamine &gt;15</option>
              <option value="dobutamine">Dobutamine</option>
              <option value="epiLow">Epinephrine ≤0.1</option>
              <option value="epiHigh">Epinephrine &gt;0.1</option>
              <option value="norepiLow">Norepinephrine ≤0.1</option>
              <option value="norepiHigh">Norepinephrine &gt;0.1</option>
            </select>
          </div>

          <div className="calc-box">
            <label className="calc-label">GCS:</label>
            <select
              className="calc-select"
              value={gcsM}
              onChange={e => setGcsM(e.target.value)}
            >
              <option value="">Select</option>
              <option value="3-5">3–5</option>
              <option value="6-9">6–9</option>
              <option value="10-12">10–12</option>
              <option value="13-14">13–14</option>
              <option value="15">15</option>
            </select>
          </div>

          <div className="calc-box">
            <label className="calc-label">Creatinine:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="calc-select"
                value={creatinine}
                onChange={e => setCreatinine(e.target.value)}
                style={{ flex: 2 }}
              >
                <option value="">Select</option>
                {creatinineUnit === "umol" ? (
                  <>
                    <option value="≥442">≥442</option>
                    <option value="309-441">309–441</option>
                    <option value="177-308">177–308</option>
                    <option value="106-176">106–176</option>
                    <option value="<106">&lt;106</option>
                  </>
                ) : (
                  <>
                    <option value="≥5">≥5</option>
                    <option value="3.5-4.9">3.5–4.9</option>
                    <option value="2-3.4">2–3.4</option>
                    <option value="1.2-1.9">1.2–1.9</option>
                    <option value="<1.2">&lt;1.2</option>
                  </>
                )}
              </select>

              <select
                className="calc-select"
                value={creatinineUnit}
                onChange={e => setCreatinineUnit(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="umol">µmol/L</option>
                <option value="mg">mg/dL</option>
              </select>
            </div>
          </div>

          <div className="calc-result">
            <p><strong>Score:</strong> {msofaResult.total} / 19</p>
            <p>{msofaResult.interpretation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
