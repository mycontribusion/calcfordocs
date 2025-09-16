import { useState } from "react";

export default function HeartFailureFramingham() {
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

  const [selected, setSelected] = useState({});
  const [result, setResult] = useState("");

  function toggleCheck(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function calculateHeartFailure() {
    let majorCount = majorCriteria.filter((c) => selected[c.id]).length;
    let minorCount = minorCriteria.filter((c) => selected[c.id]).length;

    let diagnosis = "No Heart Failure (criteria not met)";
    if (majorCount >= 2) {
      diagnosis = "Heart Failure Present (≥2 Major criteria)";
    } else if (majorCount === 1 && minorCount >= 2) {
      diagnosis = "Heart Failure Present (1 Major + ≥2 Minor)";
    }

    setResult(
      `Diagnosis: ${diagnosis}`
    );
  }

  return (
    <div>
      <h2>Heart Failure (Framingham Criteria)</h2>

      <h3>Major Criteria</h3>
      {majorCriteria.map((c) => (
        <label key={c.id}>
          <input
            type="checkbox"
            checked={!!selected[c.id]}
            onChange={() => toggleCheck(c.id)}
          />
          {c.label}
          <br />
        </label>
      ))}

      <h3>Minor Criteria</h3>
      {minorCriteria.map((c) => (
        <label key={c.id}>
          <input
            type="checkbox"
            checked={!!selected[c.id]}
            onChange={() => toggleCheck(c.id)}
          />
          {c.label}
          <br />
        </label>
      ))}

      <button onClick={calculateHeartFailure}>Diagnose</button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
