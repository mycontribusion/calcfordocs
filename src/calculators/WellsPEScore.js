// src/calculators/WellsScorePE.js
import { useState } from "react";

export default function WellsScorePE() {
  // Wells PE criteria with their points
  const wellsCriteria = [
    { label: "Clinical signs of DVT", points: 3 },
    { label: "PE is most likely diagnosis", points: 3 },
    { label: "Heart rate > 100 bpm", points: 1.5 },
    { label: "Immobilization ≥ 3 days or surgery in the past 4 weeks", points: 1.5 },
    { label: "Previous DVT/PE", points: 1.5 },
    { label: "Hemoptysis", points: 1 },
    { label: "Malignancy (active, treated within 6 months, or palliative)", points: 1 },
  ];

  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [result, setResult] = useState("");

  const handleCriteriaChange = (point, checked) => {
    if (checked) setSelectedCriteria([...selectedCriteria, point]);
    else setSelectedCriteria(selectedCriteria.filter(p => p !== point));
  };

  const computeWellsScore = () => {
    const total = selectedCriteria.reduce((a, b) => a + b, 0);
    let interpretation = "";

    if (total > 6) interpretation = "High probability of PE";
    else if (total >= 2 && total <= 6) interpretation = "Moderate probability of PE";
    else interpretation = "Low probability of PE";

    setResult(`Score: ${total} → ${interpretation}`);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Wells Score for Pulmonary Embolism</h2>
      
      <div className="mb-2">
        {wellsCriteria.map((c, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`criteria-${idx}`}
              onChange={(e) => handleCriteriaChange(c.points, e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={`criteria-${idx}`}>{c.label} ({c.points} pts)</label>
          </div>
        ))}
      </div><p></p>

      <button
        onClick={computeWellsScore}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        Calculate Score
      </button>

      {result && <p className="mt-2 font-medium">{result}</p>}
    </div>
  );
}
