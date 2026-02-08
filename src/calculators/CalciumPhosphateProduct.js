import React, { useState, useEffect, useCallback } from "react";
import "./CalculatorShared.css";

export default function CalciumPhosphateProduct() {
  const [calcium, setCalcium] = useState("");
  const [phosphate, setPhosphate] = useState("");
  const [caUnit, setCaUnit] = useState("mmol"); // default mmol/L
  const [phUnit, setPhUnit] = useState("mmol"); // default mmol/L
  const [result, setResult] = useState("");
  const [showFormula, setShowFormula] = useState(false);

  const caConv = 0.2495; // 1 mg/dL → mmol/L
  const phConv = 0.3229; // 1 mg/dL → mmol/L

  const convertToMgDL = (value, type, unit) => {
    if (unit === "mmol") {
      return type === "calcium" ? value / caConv : value / phConv;
    }
    return value; // already in mg/dL
  };

  const calculateCPP = useCallback(() => {
    const caVal = parseFloat(calcium);
    const phVal = parseFloat(phosphate);

    if (isNaN(caVal) || isNaN(phVal) || caVal <= 0 || phVal <= 0) {
      setResult("Please enter valid numerical values.");
      setShowFormula(false);
      return;
    }

    const caMg = convertToMgDL(caVal, "calcium", caUnit);
    const phMg = convertToMgDL(phVal, "phosphate", phUnit);
    const product = caMg * phMg;

    let interpretation = "";
    if (product < 55) interpretation = "Low risk of vascular calcification";
    else if (product <= 70) interpretation = "Moderate risk of vascular calcification";
    else interpretation = "High risk of vascular calcification";

    setResult(`Ca × P Product: ${product.toFixed(2)} mg²/dL² → ${interpretation}`);
    setShowFormula(true);
  }, [calcium, phosphate, caUnit, phUnit]);

  // Auto-calc on input change
  useEffect(() => {
    if (calcium !== "" && phosphate !== "") {
      calculateCPP();
    } else {
      setResult("");
      setShowFormula(false);
    }
  }, [calcium, phosphate, caUnit, phUnit, calculateCPP]);

  const reset = () => {
    setCalcium("");
    setPhosphate("");
    setCaUnit("mmol");
    setPhUnit("mmol");
    setResult("");
    setShowFormula(false);
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Serum Calcium:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Enter Calcium"
            value={calcium}
            onChange={(e) => setCalcium(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={caUnit}
            onChange={(e) => setCaUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="mmol">mmol/L</option>
            <option value="mg">mg/dL</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Serum Phosphate:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            placeholder="Enter Phosphate"
            value={phosphate}
            onChange={(e) => setPhosphate(e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select
            value={phUnit}
            onChange={(e) => setPhUnit(e.target.value)}
            className="calc-select"
            style={{ flex: 1 }}
          >
            <option value="mmol">mmol/L</option>
            <option value="mg">mg/dL</option>
          </select>
        </div>
      </div>

      <button
        onClick={reset}
        className="calc-btn-reset"
      >
        Reset
      </button>

      {result && <div className="calc-result" style={{ marginTop: 16 }}>{result}</div>}

      {showFormula && (
        <div style={{ fontSize: "small", marginTop: 8, padding: 8, borderRadius: 4, background: 'rgba(0,0,0,0.02)' }}>
          <span><strong>Formula:</strong> Ca × P = Serum Calcium × Serum Phosphate</span><br />
          <span><strong>Units:</strong> mg/dL × mg/dL → mg²/dL²</span>
        </div>
      )}
    </div>
  );
}
