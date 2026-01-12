// src/calculators/HyponatremiaCorrection.js
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
        "Normal Saline may worsen hyponatremia in euvolemic or hypervolemic states."
      );
    } else {
      setWarning("");
    }

    if (target > 8) {
      setWarning("Target correction exceeds safe daily limit (≤8 mmol/L).");
      setResult(null);
      return;
    }

    const tbw = wt * getTBWFactor();
    const infusateNa = getInfusateNa();

    const deltaPerLiter =
      (infusateNa - na) / (tbw + 1);

    if (deltaPerLiter <= 0) {
      setWarning("Selected fluid will not raise serum sodium.");
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
    });
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="font-semibold text-lg mb-2">
        Hyponatremia Correction Calculator (Adrogué–Madias)
      </h2>

      <p className="text-sm mb-2">
        Formula: ΔNa = (Na<sub>infusate</sub> − Na<sub>serum</sub>) / (TBW + 1)
      </p>

      <div>
        <label>Serum Sodium (mmol/L)</label><br />
        <input type="number" value={serumNa} onChange={e => setSerumNa(e.target.value)} />
      </div>

      <div>
        <label>Weight (kg)</label><br />
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
      </div>

      <div>
        <label>Sex</label><br />
        <select value={sex} onChange={e => setSex(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label>Age Group</label><br />
        <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)}>
          <option value="nonelderly">Non-elderly</option>
          <option value="elderly">Elderly</option>
        </select>
      </div>

      <div>
        <label>Volume Status</label><br />
        <select value={volumeStatus} onChange={e => setVolumeStatus(e.target.value)}>
          <option value="hypovolemic">Hypovolemic</option>
          <option value="euvolemic">Euvolemic (SIADH)</option>
          <option value="hypervolemic">Hypervolemic</option>
        </select>
      </div>

      <div>
        <label>Infusate</label><br />
        <select value={fluid} onChange={e => setFluid(e.target.value)}>
          <option value="ns">0.9% Normal Saline</option>
          <option value="hts">3% Hypertonic Saline</option>
          <option value="rl">Ringer’s Lactate</option>
        </select>
      </div>

      <div>
        <label>Target Rise (mmol / 24h)</label><br />
        <input type="number" value={targetRise} onChange={e => setTargetRise(e.target.value)} />
      </div>

      <button onClick={calculate} className="mt-2 px-3 py-1 border">
        Calculate
      </button>

      {warning && <p className="mt-2 text-sm">{warning}</p>}

      {result && (
        <div className="mt-3 text-sm">
          <p><strong>Total Body Water:</strong> {result.tbw} L</p>
          <p><strong>ΔNa per 1 L:</strong> +{result.deltaPerLiter} mmol/L</p>
          <p><strong>Total Volume Needed:</strong> {result.totalLiters} L</p>
          <p><strong>Estimated Rate:</strong> {result.hourlyRate} mL/hr</p>

          {result.hourlyRate > 200 && (
            <p>
              ⚠️ High infusion rate — risk of volume overload.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
