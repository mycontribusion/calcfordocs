// src/calculators/WellsScorePE.js
import { useState } from "react";

const WELLS_CRITERIA = [
  { id: 1, label: "Clinical signs of DVT", points: 3 },
  { id: 2, label: "PE is most likely diagnosis", points: 3 },
  { id: 3, label: "Heart rate > 100 bpm", points: 1.5 },
  { id: 4, label: "Immobilization ≥ 3 days or surgery in the past 4 weeks", points: 1.5 },
  { id: 5, label: "Previous DVT/PE", points: 1.5 },
  { id: 6, label: "Hemoptysis", points: 1 },
  { id: 7, label: "Malignancy (active, treated within 6 months, or palliative)", points: 1 },
];

export default function WellsScorePE() {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCriteria = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Auto-calculate score
  const totalScore = selectedIds
    .map((id) => WELLS_CRITERIA.find((c) => c.id === id).points)
    .reduce((sum, p) => sum + p, 0);

  let interpretation = "";
  if (totalScore > 6) interpretation = "High probability of PE";
  else if (totalScore >= 2) interpretation = "Moderate probability of PE";
  else interpretation = "Low probability of PE";

  return (
    <div style={{padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
      <h2>Wells Score for Pulmonary Embolism</h2>

      {WELLS_CRITERIA.map((c) => (
        <label key={c.id} style={{ display: "block", marginBottom: 4 }}>
          <input
            type="checkbox"
            checked={selectedIds.includes(c.id)}
            onChange={() => toggleCriteria(c.id)}
          />{" "}
          {c.label} ({c.points} pts)
        </label>
      ))}

      {selectedIds.length > 0 && (
        <p style={{ marginTop: 10, fontWeight: "bold" }}>
          Score: {totalScore} → {interpretation}
        </p>
      )}
    </div>
  );
}
