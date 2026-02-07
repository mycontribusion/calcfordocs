import { useState, useEffect } from "react";
import "./CalculatorShared.css";

// Move criteria arrays outside the component to avoid ESLint warnings
const majorCriteria = [
  { id: "pnd", label: "Paroxysmal Nocturnal Dyspnea" },
  { id: "jvd", label: "Jugular Venous Distension" },
  { id: "rales", label: "Pulmonary Rales" },
  { id: "cardiomegaly", label: "Cardiomegaly" },
  { id: "pulmonaryEdema", label: "Acute Pulmonary Edema" },
  { id: "s3", label: "S3 Gallop" },
  { id: "venousPressure", label: "Venous Pressure >16 cm H₂O" },
  { id: "circulation", label: "Circulation Time ≥25 sec" },
  { id: "weightLoss", label: "Weight Loss ≥4.5kg in 5 days (Tx)" },
];

const minorCriteria = [
  { id: "ankleEdema", label: "Ankle Edema" },
  { id: "nocturnalCough", label: "Nocturnal Cough" },
  { id: "dyspnea", label: "Dyspnea on Exertion" },
  { id: "hepatomegaly", label: "Hepatomegaly" },
  { id: "pleuralEffusion", label: "Pleural Effusion" },
  { id: "tachycardia", label: "Tachycardia ≥120 bpm" },
];

export default function HeartFailureFramingham() {
  const [selected, setSelected] = useState({});
  const [result, setResult] = useState("");

  // Toggle checkbox selection
  const toggleCheck = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Auto-calculate diagnosis whenever selection changes
  useEffect(() => {
    let majorCount = majorCriteria.filter((c) => selected[c.id]).length;
    let minorCount = minorCriteria.filter((c) => selected[c.id]).length;

    let diagnosis = "No Heart Failure (criteria not met)";
    if (majorCount >= 2) diagnosis = "Heart Failure Present (≥2 Major criteria)";
    else if (majorCount === 1 && minorCount >= 2)
      diagnosis = "Heart Failure Present (1 Major + ≥2 Minor)";

    setResult(diagnosis);
  }, [selected]);

  // Reset all checkboxes
  const reset = () => {
    setSelected({});
    setResult("");
  };

  return (
    <div className="calc-container" style={{ maxWidth: 500 }}>
      <h2 className="calc-title">Heart Failure (Framingham Criteria)</h2>

      <h3 style={{ fontSize: '1rem', marginTop: 16, marginBottom: 8, color: '#333' }}>Major Criteria</h3>
      <div className="calc-box">
        {majorCriteria.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!selected[c.id]}
              onChange={() => toggleCheck(c.id)}
              style={{ marginRight: 8 }}
            />
            {c.label}
          </label>
        ))}
      </div>

      <h3 style={{ fontSize: '1rem', marginTop: 16, marginBottom: 8, color: '#333' }}>Minor Criteria</h3>
      <div className="calc-box">
        {minorCriteria.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!selected[c.id]}
              onChange={() => toggleCheck(c.id)}
              style={{ marginRight: 8 }}
            />
            {c.label}
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset" style={{ marginTop: 10 }}>
        Reset
      </button>

      {result && (
        <div className="calc-result" style={{ marginTop: 15 }}>
          <strong>Diagnosis:</strong> {result}
        </div>
      )}
    </div>
  );
}
