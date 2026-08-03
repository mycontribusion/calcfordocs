import React, { useEffect } from "react";
import { useCalc, ResetButton, FormulaBox } from "./CalcFields";

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
  // Global Sync Keys
  heartRate: "",
};

export default function WellsScorePE() {
  const { values, updateField: setField, updateFields, reset } = useCalc(INITIAL_STATE);

  const toggleCriteria = (id) => {
    const { selectedIds } = values;
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setField("selectedIds", newSelected);
  };

  // Auto-sync heart rate criteria
  useEffect(() => {
    const hr = parseFloat(values.heartRate);
    if (!isNaN(hr)) {
      const hasHrCriteria = values.selectedIds.includes(3);
      if (hr > 100 && !hasHrCriteria) {
        updateFields({ selectedIds: [...values.selectedIds, 3] });
      } else if (hr <= 100 && hasHrCriteria) {
        updateFields({ selectedIds: values.selectedIds.filter(id => id !== 3) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.heartRate]);

  // Auto-calculate score
  const totalScore = values.selectedIds
    .map((id) => WELLS_CRITERIA.find((c) => c.id === id).points)
    .reduce((sum, p) => sum + p, 0);

  let interpretation = "";
  let action = "";
  if (totalScore > 6) {
    interpretation = "High probability of PE";
    action = "Score > 6 — do CTPA";
  } else if (totalScore >= 2) {
    interpretation = "Moderate probability of PE";
    action = "Score ≤ 6 — do D-Dimer";
  } else {
    interpretation = "Low probability of PE";
    action = "Score ≤ 6 — do D-Dimer";
  }

  return (
    <div className="calc-container">
      <FormulaBox title="Wells PE Criteria & Diagnostic Protocol">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Diagnostic Protocol:</p>
        <ul style={{ margin: "0 0 6px", paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>Score &gt; 6 (High Risk / PE Likely):</strong> Proceed directly to CT Pulmonary Angiogram (CTPA).</li>
          <li><strong>Score ≤ 6 (PE Unlikely):</strong> Perform High-sensitivity D-Dimer test. If negative, PE is ruled out. If positive, proceed to CTPA.</li>
        </ul>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>3-Tier Probability Classification:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>&gt; 6 points:</strong> High Risk (~65% PE probability)</li>
          <li><strong>2 – 6 points:</strong> Moderate Risk (~30% PE probability)</li>
          <li><strong>&lt; 2 points:</strong> Low Risk (~10% PE probability)</li>
        </ul>
      </FormulaBox>

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

      <ResetButton onClick={reset} />

      {values.selectedIds.length > 0 && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Score:</strong> {totalScore}</p>
          <p><strong>Interpretation:</strong> {interpretation}</p>
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <p style={{ color: '#0056b3', marginTop: 4 }}>Action: {action}</p>
          </div>
        </div>
      )}
    </div>
  );
}
