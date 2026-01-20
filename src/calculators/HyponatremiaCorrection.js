import { useState } from "react";

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

  function getTBWFactor() {
    if (sex === "male" && ageGroup === "nonelderly") return 0.6;
    if (sex === "female" && ageGroup === "nonelderly") return 0.5;
    if (sex === "male" && ageGroup === "elderly") return 0.5;
    return 0.45; // elderly female
  }

  function getInfusateNa() {
    if (fluid === "ns") return 154;
    if (fluid === "hts") return 513;
    if (fluid === "rl") return 130;
    return 0;
  }

  function calculate() {
    const na = parseFloat(serumNa);
    const wt = parseFloat(weight);
    const target = parseFloat(targetRise);

    if ([na, wt, target].some(v => isNaN(v))) {
      setWarning("Please enter valid numeric values.");
      setResult(null);
      return;
    }

    if (volumeStatus !== "hypovolemic" && fluid === "ns") {
      setWarning(
        "⚠️ Normal Saline may worsen hyponatremia in euvolemic or hypervolemic states."
      );
    } else {
      setWarning("");
    }

    if (target > 8) {
      setWarning("⚠️ Target correction exceeds safe daily limit (≤8 mmol/L).");
      setResult(null);
      return;
    }

    const tbw = wt * getTBWFactor();
    const infusateNa = getInfusateNa();

    const deltaPerLiter =
      (infusateNa - na) / (tbw + 1);

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
      formula: `ΔNa = (Na_infusate − Na_serum) / (TBW + 1)`
    });
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Hyponatremia Correction Calculator (Adrogué–Madias)</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Serum Sodium (mmol/L)</label><br />
        <input type="number" value={serumNa} onChange={e => setSerumNa(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }} />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Weight (kg)</label><br />
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }} />
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Sex</label><br />
        <select value={sex} onChange={e => setSex(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Age Group</label><br />
        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}>
          <option value="nonelderly">Non-elderly</option>
          <option value="elderly">Elderly</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Volume Status</label><br />
        <select value={volumeStatus} onChange={e => setVolumeStatus(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}>
          <option value="hypovolemic">Hypovolemic</option>
          <option value="euvolemic">Euvolemic (SIADH)</option>
          <option value="hypervolemic">Hypervolemic</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Infusate</label><br />
        <select value={fluid} onChange={e => setFluid(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }}>
          <option value="ns">0.9% Normal Saline</option>
          <option value="hts">3% Hypertonic Saline</option>
          <option value="rl">Ringer’s Lactate</option>
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Target Rise (mmol / 24h)</label><br />
        <input type="number" value={targetRise} onChange={e => setTargetRise(e.target.value)} style={{ width: "100%", padding: "0.25rem", marginTop: "0.25rem" }} />
      </div>

      <button onClick={calculate} style={{ padding: "0.5rem 1rem", marginTop: "0.5rem", cursor: "pointer" }}>Calculate</button>

      {warning && <p style={{ marginTop: "0.5rem", color: "darkred" }}>{warning}</p>}

      {result && (
        <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <p><strong>Total Body Water:</strong> {result.tbw} L</p>
          <p><strong>ΔNa per 1 L:</strong> +{result.deltaPerLiter} mmol/L</p>
          <p><strong>Total Volume Needed:</strong> {result.totalLiters} L</p>
          <p><strong>Estimated Rate:</strong> {result.hourlyRate} mL/hr</p>
          {result.hourlyRate > 200 && <p style={{ color: "darkred" }}>⚠️ High infusion rate — risk of volume overload.</p>}

          <p style={{ marginTop: "0.75rem" }}>
            <em>Formula used: {result.formula}</em>
          </p>
        </div>
      )}
    </div>
  );
}
