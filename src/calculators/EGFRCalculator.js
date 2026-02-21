import { useState, useEffect } from "react";
import "./CalculatorShared.css";

function EGFRCalculator() {
  const [scr, setScr] = useState("");
  const [unit, setUnit] = useState("umol");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");

  const [egfr, setEgfr] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  const interpretEGFR = (value) => {
    if (value >= 90) return "G1: Normal kidney function (≥90)";
    if (value >= 60) return "G2: Mildly decreased kidney function (60–89)";
    if (value >= 45) return "G3a: Mild–moderate CKD (45–59)";
    if (value >= 30) return "G3b: Moderate–severe CKD (30–44)";
    if (value >= 15) return "G4: Severe CKD (15–29)";
    return "G5: Kidney failure (<15)";
  };

  // Helper to parse positive numbers
  const parseRequired = (v) => {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  // Auto-calc when all required fields exist
  useEffect(() => {
    const scrVal = parseRequired(scr);
    const ageVal = parseRequired(age);

    if (scrVal === null || ageVal === null) {
      setEgfr(null);
      setInterpretation("");
      return;
    }

    // Convert µmol/L → mg/dL if needed
    const scrMgdl = unit === "umol" ? scrVal / 88.4 : scrVal;

    const kappa = sex === "male" ? 0.9 : 0.7;
    const alpha = sex === "male" ? -0.302 : -0.241;

    const scrRatio = scrMgdl / kappa;
    const minPart = Math.min(scrRatio, 1) ** alpha;
    const maxPart = Math.max(scrRatio, 1) ** -1.2;
    const ageFactor = 0.9938 ** ageVal;
    const sexFactor = sex === "female" ? 1.012 : 1;

    const result = 142 * minPart * maxPart * ageFactor * sexFactor;
    const rounded = Number(result.toFixed(1));

    setEgfr(rounded);
    setInterpretation(interpretEGFR(rounded));
  }, [scr, unit, age, sex]);

  const handleReset = () => {
    setScr("");
    setUnit("umol");
    setAge("");
    setSex("male");
    setEgfr(null);
    setInterpretation("");
  };

  return (
    <div className="calc-container">
      <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>CKD-EPI 2021</h3>

      <div className="calc-box">
        <label className="calc-label">Serum Creatinine:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={scr}
            onChange={(e) => setScr(e.target.value)}
            placeholder="e.g., 80"
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="calc-select" style={{ flex: 1 }}>
            <option value="umol">µmol/L</option>
            <option value="mgdl">mg/dL</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Age (years):</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g., 40"
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Sex: </label>
        <select value={sex} onChange={(e) => setSex(e.target.value)} className="calc-select">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <button onClick={handleReset} className="calc-btn-reset">Reset</button>

      {/* ✅ Show results only when required fields are filled */}
      {egfr !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>eGFR:</strong> {egfr} mL/min/1.73m²</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>

          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "0.85rem",
              background: 'rgba(0,0,0,0.02)',
              textAlign: 'left'
            }}
          >
            <strong>Formula Used (CKD-EPI 2021):</strong>
            <br />
            <code style={{ display: 'block', margin: '8px 0', background: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 4 }}>
              eGFR = 142 × min(SCr/κ, 1)<sup>α</sup> × max(SCr/κ, 1)<sup>−1.200</sup> × 0.9938<sup>Age</sup> × (1.012 if female)
            </code>
            Where:
            <ul style={{ paddingLeft: "20px", margin: "4px 0 0" }}>
              <li>κ = 0.7 (female), 0.9 (male)</li>
              <li>α = −0.241 (female), −0.302 (male)</li>
              <li>Creatinine converted to mg/dL if µmol/L: SCr ÷ 88.4</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default EGFRCalculator;
