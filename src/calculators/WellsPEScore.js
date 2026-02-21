// src/calculators/WellsScorePE.js
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const WELLS_CRITERIA = [
  { id: 1, label: "Clinical signs of DVT", points: 3 },
  { id: 2, label: "PE is most likely diagnosis", points: 3 },
  { id: 3, label: "Heart rate > 100 bpm", points: 1.5 },
  { id: 4, label: "Immobilization ≥ 3 days or surgery in the past 4 weeks", points: 1.5 },
  { id: 5, label: "Previous DVT/PE", points: 1.5 },
  { id: 6, label: "Hemoptysis", points: 1 },
  { id: 7, label: "Malignancy (active, treated within 6 months, or palliative)", points: 1 },
];

const INITIAL_STATE = {
  selectedIds: [],
};

export default function WellsScorePE() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const toggleCriteria = (id) => {
    const { selectedIds } = values;
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setField("selectedIds", newSelected);
  };

  // Auto-calculate score
  const totalScore = values.selectedIds
    .map((id) => WELLS_CRITERIA.find((c) => c.id === id).points)
    .reduce((sum, p) => sum + p, 0);

  let interpretation = "";
  if (totalScore > 6) interpretation = "High probability of PE";
  else if (totalScore >= 2) interpretation = "Moderate probability of PE";
  else interpretation = "Low probability of PE";

  return (
    <div className="calc-container">

      <div className="calc-box">
        {WELLS_CRITERIA.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={values.selectedIds.includes(c.id)}
              onChange={() => toggleCriteria(c.id)}
              style={{ marginRight: 8 }}
            />
            {c.label} ({c.points} pts)
          </label>
        ))}
      </div>

      {values.selectedIds.length > 0 && (
        <div className="calc-result">
          Score: {totalScore} → {interpretation}
        </div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}
