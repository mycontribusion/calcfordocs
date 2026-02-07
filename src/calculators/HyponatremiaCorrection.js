import React, { useState, useEffect, useCallback } from "react";

export default function HyponatremiaCorrection() {
  const [serumNa, setSerumNa] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("male");
  const [ageGroup, setAgeGroup] = useState("nonelderly");
  const [volumeStatus, setVolumeStatus] = useState("hypovolemic");
  const [targetRise, setTargetRise] = useState("6");
  const [fluid, setFluid] = useState("ns");
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState("");

  const getInfusateNa = (fluidType) => {
    if (fluidType === "ns") return 154;
    if (fluidType === "hts") return 513;
    if (fluidType === "rl") return 130;
    return 0;
  };

  const calculate = useCallback(() => {
    const na = parseFloat(serumNa);
    const wt = parseFloat(weight);
    const target = parseFloat(targetRise);

    if ([na, wt, target].some(v => isNaN(v))) {
      setWarning("");
      setResult(null);
      return;
    }

    if (volumeStatus !== "hypovolemic" && fluid === "ns") {
      setWarning("⚠️ NS may worsen hyponatremia in euvolemic/hypervolemic states.");
    } else {
      setWarning("Aim for ≤8 mmol/L rise in 24h (max 10–12 mmol/L in special cases). Avoid rapid correction to prevent osmotic demyelination.");
    }

    if (target > 8) {
      setWarning("⚠️ Target correction exceeds safe daily limit (≤8 mmol/L).");
      setResult(null);
      return;
    }

    // Total Body Water factor
    let tbwFactor = 0.6; // default male, non-elderly
    if (sex === "female" && ageGroup === "nonelderly") tbwFactor = 0.5;
    if (sex === "male" && ageGroup === "elderly") tbwFactor = 0.5;
    if (sex === "female" && ageGroup === "elderly") tbwFactor = 0.45;

    const tbw = wt * tbwFactor;
    const deltaPerLiter = (getInfusateNa(fluid) - na) / (tbw + 1);

    if (deltaPerLiter <= 0) {
      setWarning("⚠️ Selected fluid will not raise serum sodium.");
      setResult(null);
      return;
    }

    const totalLiters = target / deltaPerLiter;
    const hourlyRate = (totalLiters * 1000) / 24;

    setResult({
      tbw: tbw.toFixed(1),
      deltaPerLiter: deltaPerLiter.toFixed(2),
      totalLiters: totalLiters.toFixed(2),
      hourlyRate: hourlyRate.toFixed(0),
      formula: `ΔNa = (Na_infusate − Na_serum) / (TBW + 1)`,
    });
  }, [serumNa, weight, ageGroup, sex, fluid, volumeStatus, targetRise]);

  // Auto-calculate
  useEffect(() => {
    calculate();
  }, [calculate]);

  const reset = () => {
    setSerumNa("");
    setWeight("");
    setSex("male");
    setAgeGroup("nonelderly");
    setVolumeStatus("hypovolemic");
    setTargetRise("6");
    setFluid("ns");
    setResult(null);
    setWarning("");
  };

  return (
    <div style={{padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h2>Hyponatremia Correction Calculator (Adrogué–Madias)</h2>

      <div>
        <label>Serum Sodium (mmol/L)</label>
        <input type="number" value={serumNa} onChange={e => setSerumNa(e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
      </div>

      <div>
        <label>Weight (kg)</label>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
      </div>

      <div>
        <label>Sex</label>
        <select value={sex} onChange={e => setSex(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label>Age Group</label>
        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          <option value="nonelderly">Non-elderly</option>
          <option value="elderly">Elderly</option>
        </select>
      </div>

      <div>
        <label>Volume Status</label>
        <select value={volumeStatus} onChange={e => setVolumeStatus(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          <option value="hypovolemic">Hypovolemic</option>
          <option value="euvolemic">Euvolemic (SIADH)</option>
          <option value="hypervolemic">Hypervolemic</option>
        </select>
      </div>

      <div>
        <label>Infusate</label>
        <select value={fluid} onChange={e => setFluid(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          <option value="ns">0.9% Normal Saline</option>
          <option value="hts">3% Hypertonic Saline</option>
          <option value="rl">Ringer’s Lactate</option>
        </select>
      </div>

      <div>
        <label>Target Rise (mmol/24h)</label>
        <input type="number" value={targetRise} onChange={e => setTargetRise(e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
      </div>

      <button onClick={reset} style={{ marginTop: 10 }}>Reset</button><p></p>

      {warning && <p style={{ color: "darkred" }}>{warning}</p>}

      {result && (
        <div>
          <p><strong>Total Body Water:</strong> {result.tbw} L</p>
          <p><strong>ΔNa per 1 L:</strong> +{result.deltaPerLiter} mmol/L</p>
          <p><strong>Total Volume Needed:</strong> {result.totalLiters} L</p>
          <p><strong>Estimated Rate:</strong> {result.hourlyRate} mL/hr</p>
          <p><em>Formula: {result.formula}</em></p>
        </div>
      )}
    </div>
  );
}
