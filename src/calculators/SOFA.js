import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  mode: "qsofa",
  rrHigh: false,
  sbpLow: false,
  gcsLow: false,
  spo2fio2: "",
  liver: "none",
  map: "",
  vasopressor: "none",
  gcsM: "",
  creatinine: "",
  creatinineUnit: "umol",
  qsofaScore: 0,
  qsofaInterp: "Low immediate risk",
  msofaResult: {
    resp: 0,
    liver: 0,
    cardio: 0,
    cns: 0,
    renal: 0,
    total: 0,
    interpretation: "No organ dysfunction detected",
  }
};

export default function SOFA() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const score = (values.rrHigh ? 1 : 0) + (values.sbpLow ? 1 : 0) + (values.gcsLow ? 1 : 0);
    const interpretation = score === 0 ? "Low immediate risk" : score === 1 ? "Intermediate risk → close monitoring" : "High risk → urgent sepsis assessment";
    if (values.qsofaScore !== score) {
      updateFields({ qsofaScore: score, qsofaInterp: interpretation });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.rrHigh, values.sbpLow, values.gcsLow]);

  useEffect(() => {
    let resp = 0;
    if (values.spo2fio2 === "≤150") resp = 4;
    else if (values.spo2fio2 === "151-235") resp = 3;
    else if (values.spo2fio2 === "236-315") resp = 2;
    else if (values.spo2fio2 === "316-400") resp = 1;

    const liverScore = values.liver === "jaundice" ? 3 : 0;

    let cardio = 0;
    if (values.vasopressor === "dopamineLow" || values.vasopressor === "dobutamine") cardio = 2;
    else if (values.vasopressor === "dopamineMid" || values.vasopressor === "epiLow" || values.vasopressor === "norepiLow") cardio = 3;
    else if (values.vasopressor === "dopamineHigh" || values.vasopressor === "epiHigh" || values.vasopressor === "norepiHigh") cardio = 4;
    else if (values.map === "<70") cardio = 1;

    let cns = 0;
    if (values.gcsM === "3-5") cns = 4;
    else if (values.gcsM === "6-9") cns = 3;
    else if (values.gcsM === "10-12") cns = 2;
    else if (values.gcsM === "13-14") cns = 1;

    let renal = 0;
    let crMg = values.creatinineUnit === "umol"
      ? values.creatinine === "≥442" ? 5 : values.creatinine === "309-441" ? 3.5 : values.creatinine === "177-308" ? 2 : values.creatinine === "106-176" ? 1.2 : 0
      : values.creatinine === "≥5" ? 5 : values.creatinine === "3.5-4.9" ? 3.5 : values.creatinine === "2-3.4" ? 2 : values.creatinine === "1.2-1.9" ? 1.2 : 0;
    if (crMg >= 5) renal = 4;
    else if (crMg >= 3.5) renal = 3;
    else if (crMg >= 2) renal = 2;
    else if (crMg >= 1.2) renal = 1;

    const total = resp + liverScore + cardio + cns + renal;
    const interpretation = total === 0 ? "No organ dysfunction detected" : total <= 4 ? "Mild organ dysfunction" : total <= 9 ? "Moderate dysfunction → increased mortality risk" : "Severe dysfunction → ICU-level care likely required";

    if (values.msofaResult.total !== total) {
      updateFields({
        msofaResult: { resp, liver: liverScore, cardio, cns, renal, total, interpretation }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.spo2fio2, values.liver, values.map, values.vasopressor, values.gcsM, values.creatinine, values.creatinineUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Mode:</label>
        <select className="calc-select" value={values.mode} onChange={e => setField("mode", e.target.value)}>
          <option value="qsofa">qSOFA</option>
          <option value="msofa">mSOFA</option>
        </select>
      </div>
      <button onClick={reset} className="calc-btn-reset" style={{ marginBottom: 16 }}>Reset Calculator</button>
      {values.mode === "qsofa" && (
        <>
          <div className="calc-box">
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}><input type="checkbox" checked={values.rrHigh} onChange={() => setField("rrHigh", !values.rrHigh)} style={{ marginRight: 10 }} /> RR ≥ 22</label>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}><input type="checkbox" checked={values.sbpLow} onChange={() => setField("sbpLow", !values.sbpLow)} style={{ marginRight: 10 }} /> SBP ≤ 100</label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={values.gcsLow} onChange={() => setField("gcsLow", !values.gcsLow)} style={{ marginRight: 10 }} /> GCS &lt; 15</label>
          </div>
          <div className="calc-result"><p><strong>Score:</strong> {values.qsofaScore} / 3</p><p>{values.qsofaInterp}</p></div>
        </>
      )}
      {values.mode === "msofa" && (
        <>
          <div className="calc-box">
            <label className="calc-label">SpO₂ / FiO₂:</label>
            <select className="calc-select" value={values.spo2fio2} onChange={e => setField("spo2fio2", e.target.value)}>
              <option value="">Select</option><option value="≤150">≤150</option><option value="151-235">151–235</option><option value="236-315">236–315</option><option value="316-400">316–400</option><option value=">400">&gt;400</option>
            </select>
          </div>
          <div className="calc-box"><label className="calc-label">Jaundice:</label><div style={{ display: "flex", gap: "16px" }}><label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><input type="radio" name="liver" value="none" checked={values.liver === "none"} onChange={e => setField("liver", e.target.value)} style={{ marginRight: 6 }} /> No</label><label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><input type="radio" name="liver" value="jaundice" checked={values.liver === "jaundice"} onChange={e => setField("liver", e.target.value)} style={{ marginRight: 6 }} /> Yes</label></div></div>
          <div className="calc-box">
            <label className="calc-label">MAP:</label>
            <select className="calc-select" value={values.map} onChange={e => setField("map", e.target.value)} style={{ marginBottom: 8 }}><option value="">Select</option><option value="<70">&lt;70</option><option value="≥70">≥70</option></select>
            <select className="calc-select" value={values.vasopressor} onChange={e => setField("vasopressor", e.target.value)}><option value="none">No Vasopressor</option><option value="dopamineLow">Dopamine ≤5</option><option value="dopamineMid">Dopamine &gt;5</option><option value="dopamineHigh">Dopamine &gt;15</option><option value="dobutamine">Dobutamine</option><option value="epiLow">Epinephrine ≤0.1</option><option value="epiHigh">Epinephrine &gt;0.1</option><option value="norepiLow">Norepinephrine ≤0.1</option><option value="norepiHigh">Norepinephrine &gt;0.1</option></select>
          </div>
          <div className="calc-box">
            <label className="calc-label">GCS:</label>
            <select className="calc-select" value={values.gcsM} onChange={e => setField("gcsM", e.target.value)}><option value="">Select</option><option value="3-5">3–5</option><option value="6-9">6–9</option><option value="10-12">10–12</option><option value="13-14">13–14</option><option value="15">15</option></select>
          </div>
          <div className="calc-box">
            <label className="calc-label">Creatinine:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="calc-select" value={values.creatinine} onChange={e => setField("creatinine", e.target.value)} style={{ flex: 2 }}><option value="">Select</option>{values.creatinineUnit === "umol" ? <><option value="≥442">≥442</option><option value="309-441">309–441</option><option value="177-308">177–308</option><option value="106-176">106–176</option><option value="<106">&lt;106</option></> : <><option value="≥5">≥5</option><option value="3.5-4.9">3.5–4.9</option><option value="2-3.4">2–3.4</option><option value="1.2-1.9">1.2–1.9</option><option value="<1.2">&lt;1.2</option></>}</select>
              <select className="calc-select" value={values.creatinineUnit} onChange={e => setField("creatinineUnit", e.target.value)} style={{ flex: 1 }}><option value="umol">µmol/L</option><option value="mg">mg/dL</option></select>
            </div>
          </div>
          <div className="calc-result"><p><strong>Score:</strong> {values.msofaResult.total} / 19</p><p>{values.msofaResult.interpretation}</p></div>
        </>
      )}
    </div>
  );
}
