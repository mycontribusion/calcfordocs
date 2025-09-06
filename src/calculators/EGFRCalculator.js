import { useState } from "react";

function EGFRCalculator() {
  const [scr, setScr] = useState(""); // serum creatinine input
  const [unit, setUnit] = useState("umol"); // default µmol/L
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [egfr, setEgfr] = useState(null);

  const calculateEGFR = () => {
    let scrVal = parseFloat(scr);
    const ageVal = parseFloat(age);

    if (isNaN(scrVal) || isNaN(ageVal) || scrVal <= 0 || ageVal <= 0) {
      setEgfr("Invalid input");
      return;
    }

    // ✅ convert to mg/dL if input is in µmol/L
    const scrMgdl = unit === "umol" ? scrVal / 88.4 : scrVal;

    // CKD-EPI 2021 formula (race-free, Medscape version)
    const kappa = sex === "male" ? 0.9 : 0.7;
    const alpha = sex === "male" ? -0.302 : -0.241;

    const scrRatio = scrMgdl / kappa;
    const minPart = Math.min(scrRatio, 1) ** alpha;
    const maxPart = Math.max(scrRatio, 1) ** -1.200;
    const ageFactor = 0.9938 ** ageVal;
    const sexFactor = sex === "female" ? 1.012 : 1;

    const result = 142 * minPart * maxPart * ageFactor * sexFactor;

    setEgfr(result.toFixed(1));
  };

  return (
    <div className="calc-container">
      <h2>eGFR Calculator (CKD-EPI 2021)</h2>

      <label>Serum Creatinine</label>
      <input
        type="number"
        value={scr}
        onChange={(e) => setScr(e.target.value)}
        placeholder="e.g., 80"
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="umol">µmol/L</option>
        <option value="mgdl">mg/dL</option>
      </select>

      <label>Age (years)</label>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="e.g., 40"
      />

      <label>Sex</label>
      <select value={sex} onChange={(e) => setSex(e.target.value)}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <button onClick={calculateEGFR}>Calculate</button>

      {egfr && (
        <div className="result">
          <strong>eGFR:</strong> {egfr} mL/min/1.73m²
        </div>
      )}
    </div>
  );
}

export default EGFRCalculator;
