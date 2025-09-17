import { useState } from "react";

export default function PediatricTransfusionCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [inputType, setInputType] = useState("pcv"); // "pcv" or "hb"
  const [observed, setObserved] = useState("");
  const [target, setTarget] = useState("");
  const [rbcPcv, setRbcPcv] = useState(""); // optional
  const [result, setResult] = useState("");

  const validatePositiveNumber = (n) => Number.isFinite(Number(n)) && Number(n) > 0;

  const calculateTransfusion = () => {
    if (!validatePositiveNumber(weight) || !validatePositiveNumber(observed) || !validatePositiveNumber(target)) {
      setResult("⚠️ Please enter valid positive numbers for weight, observed, and target values.");
      return;
    }

    let weightKg = weightUnit === "lb" ? Number(weight) * 0.453592 : Number(weight);
    let obsVal = Number(observed);
    let tgtVal = Number(target);

    if (inputType === "pcv") {
      obsVal = obsVal / 3;
      tgtVal = tgtVal / 3;
    }

    if (tgtVal <= obsVal) {
      setResult("✅ No transfusion needed (target ≤ observed).");
      return;
    }

    const deltaHb = tgtVal - obsVal;
    const pcvFactor = validatePositiveNumber(rbcPcv) ? Number(rbcPcv) / 100 : 1;
    const volume = (deltaHb * weightKg * 3) / pcvFactor;

    setResult(
      `Transfusion Volume: ${volume.toFixed(0)} mL of PRBC\n\n` +
      `Formula used:\n` +
      `Volume = Weight (kg) × (Target Hb − Observed Hb) × 3 ÷ PCV of transfused blood\n\n` +
      `Notes:\n` +
      `- Usual pediatric transfusion: 10–15 mL/kg PRBC over 3–4 hours\n` +
      `- Monitor vitals to avoid fluid overload`
    );
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", maxWidth: "500px" }}>
      <h2>Pediatric Blood Transfusion (Anemia)</h2>

      {/* Always visible note */}
      

      <div>
        <label>
          Weight:
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
        <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </div>

      <div>
        <p></p>
        <label>
          Input Type:
          <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
            <option value="pcv">PCV (%)</option>
            <option value="hb">Hb (g/dL)</option>
          </select>
        </label>
      </div>

      <div>
        <p></p>
        <label>
          Observed {inputType === "pcv" ? "PCV (%)" : "Hb (g/dL)"}:
          <input type="number" value={observed} onChange={(e) => setObserved(e.target.value)} />
        </label>
      </div>

      <div><p></p>
        <label>
          Target {inputType === "pcv" ? "PCV (%)" : "Hb (g/dL)"}:
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
      </div>

      <div><p></p>
        <label>
          HCT of RBC [optional]:
          <input type="number" value={rbcPcv} onChange={(e) => setRbcPcv(e.target.value)} />
        </label>
      </div><p></p>

      <button onClick={calculateTransfusion}>Calculate</button>

      <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
        HCT of RBCs also means PCV of transfused blood
      </p>

      {result && <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>{result}</p>}
    </div>
  );
}
