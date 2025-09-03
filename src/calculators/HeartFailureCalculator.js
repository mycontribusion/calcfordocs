// src/calculators/HeartFailureFramingham.js
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

    let diagnosis = "No Heart Failure";
    if (majorCount >= 2) {
      diagnosis = "Heart Failure Present";
    } else if (majorCount === 1 && minorCount >= 2) {
      diagnosis = "Possible Heart Failure";
    }

    setResult(`Diagnosis: ${diagnosis}`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Heart Failure (Framingham Criteria)</h2>

      <h3 className="font-medium mt-2">Major Criteria</h3>
      {majorCriteria.map((c) => (
        <label key={c.id} className="block">
          <input
            type="checkbox"
            checked={!!selected[c.id]}
            onChange={() => toggleCheck(c.id)}
            className="mr-2"
          />
          {c.label}
        </label>
      ))}

      <h3 className="font-medium mt-3">Minor Criteria</h3>
      {minorCriteria.map((c) => (
        <label key={c.id} className="block">
          <input
            type="checkbox"
            checked={!!selected[c.id]}
            onChange={() => toggleCheck(c.id)}
            className="mr-2"
          />
          {c.label}
        </label>
      ))}

      <button
        onClick={calculateHeartFailure}
        className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
      >
        Diagnose
      </button>

      {result && <p className="mt-3 font-medium">{result}</p>}
    </div>
  );
}
