import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  sodium: "",
  weight: "",
  weightUnit: "kg",
  sex: "male",
  age: "",
  ageGroup: "nonelderly",
  volumeStatus: "hypovolemic",
  targetRise: "6",
  fluid: "ns",
  result: null,
  warning: "",
};

export default function HyponatremiaCorrection() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);
  const getInfusateNa = (fluidType) => ({ ns: 154, hts: 513, rl: 130 }[fluidType] || 0);

  useEffect(() => {
    const na = parseFloat(values.sodium);
    const wt = parseFloat(values.weight);
    const target = parseFloat(values.targetRise);

    // Auto-set ageGroup based on global age
    if (values.age) {
      const ageVal = parseFloat(values.age);
      if (!isNaN(ageVal)) {
        updateFields({ ageGroup: ageVal >= 65 ? "elderly" : "nonelderly" });
      }
    }

    if (isNaN(na) || isNaN(wt) || isNaN(target)) {
      if (values.result !== null || values.warning !== "") updateFields({ result: null, warning: "" });
      return;
    }

    let warn = "";
    if (na >= 135) {
      updateFields({ warning: "✅ Serum sodium is within normal range (≥ 135 mmol/L). This tool is for hyponatremia only.", result: null });
      return;
    }
    if (values.volumeStatus !== "hypovolemic" && values.fluid === "ns") warn = "⚠️ NS may worsen hyponatremia in euvolemic/hypervolemic states.";
    else warn = "Aim for ≤8 mmol/L rise in 24h. Avoid rapid correction.";

    if (target > 8) { updateFields({ warning: "⚠️ Target correction exceeds safe limit (≤8 mmol/L).", result: null }); return; }

    let tbwFactor = values.sex === "male" ? (values.ageGroup === "nonelderly" ? 0.6 : 0.5) : (values.ageGroup === "nonelderly" ? 0.5 : 0.45);
    const tbw = wt * tbwFactor;
    const deltaPerLiter = (getInfusateNa(values.fluid) - na) / (tbw + 1);

    if (deltaPerLiter <= 0) { updateFields({ warning: "⚠️ Selected fluid will not raise serum sodium.", result: null }); return; }

    const totalLiters = target / deltaPerLiter;
    const hourlyRate = (totalLiters * 1000) / 24;

    updateFields({
      result: { tbw: tbw.toFixed(1), deltaPerLiter: deltaPerLiter.toFixed(2), totalLiters: totalLiters.toFixed(2), hourlyRate: hourlyRate.toFixed(0) },
      warning: warn
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.weight, values.ageGroup, values.sex, values.fluid, values.volumeStatus, values.targetRise, values.age]);

  return (
    <div className="calc-container">
      <div style={{ display: "flex", gap: "8px" }}>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Serum Na (mmol/L)</label><input type="number" value={values.sodium} onChange={e => setField("sodium", e.target.value)} className="calc-input" /></div>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Weight (kg)</label><input type="number" value={values.weight} onChange={e => setField("weight", e.target.value)} className="calc-input" /></div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Sex</label><select value={values.sex} onChange={e => setField("sex", e.target.value)} className="calc-select"><option value="male">Male</option><option value="female">Female</option></select></div>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Age Group</label><select value={values.ageGroup} onChange={e => setField("ageGroup", e.target.value)} className="calc-select"><option value="nonelderly">Non-elderly</option><option value="elderly">Elderly</option></select></div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Volume Status</label><select value={values.volumeStatus} onChange={e => setField("volumeStatus", e.target.value)} className="calc-select"><option value="hypovolemic">Hypovolemic</option><option value="euvolemic">Euvolemic (SIADH)</option><option value="hypervolemic">Hypervolemic</option></select></div>
        <div className="calc-box" style={{ flex: 1 }}><label className="calc-label">Infusate</label><select value={values.fluid} onChange={e => setField("fluid", e.target.value)} className="calc-select"><option value="ns">0.9% NS</option><option value="hts">3% HTS</option><option value="rl">RL</option></select></div>
      </div>
      <div className="calc-box"><label className="calc-label">Target Rise (mmol/24h)</label><input type="number" value={values.targetRise} onChange={e => setField("targetRise", e.target.value)} className="calc-input" /></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.warning && <p className="calc-result" style={{ color: "darkred" }}>{values.warning}</p>}
      {values.result && (
        <div className="calc-result">
          <p><strong>ΔNa per 1 L:</strong> +{values.result.deltaPerLiter} mmol/L</p>
          <p><strong>Total Volume Needed:</strong> {values.result.totalLiters} L</p>
          <p><strong>Estimated Rate:</strong> {values.result.hourlyRate} mL/hr</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <span style={{ opacity: 0.7 }}>Adrogue-Madias: ΔNa = (Infusate Na – Serum Na) / (TBW + 1)</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
              <li>⚠️ Max correction: ≤8–10 mmol/L per 24h</li>
              <li>⚠️ Rapid correction risks Osmotic Demyelination Syndrome (ODS)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
