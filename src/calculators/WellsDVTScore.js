import { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const criteria = [
  { key: "cancer", label: "Active cancer (treatment within 6 months or palliative)", points: 1 },
  { key: "paralysis", label: "Paralysis, paresis, or recent immobilization of lower limb", points: 1 },
  { key: "bedridden", label: "Recently bedridden ≥ 3 days OR major surgery within 12 weeks", points: 1 },
  { key: "tenderness", label: "Localized tenderness along the deep venous system", points: 1 },
  { key: "legSwollen", label: "Entire leg swollen", points: 1 },
  { key: "calfDiff", label: "Calf swelling ≥ 3 cm compared to the other leg", points: 1 },
  { key: "edema", label: "Pitting edema confined to symptomatic leg", points: 1 },
  { key: "collateral", label: "Collateral superficial (non-varicose) veins", points: 1 },
  { key: "prevDvt", label: "Previous DVT", points: 1 },
  { key: "altDx", label: "Alternative diagnosis more likely than DVT", points: -2 },
];

const INITIAL_STATE = {
  cancer: false,
  paralysis: false,
  bedridden: false,
  tenderness: false,
  legSwollen: false,
  calfDiff: false,
  edema: false,
  collateral: false,
  prevDvt: false,
  altDx: false,
};

export default function WellsDVTScore() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const score = useMemo(() => {
    let total = 0;
    criteria.forEach((c) => {
      if (values[c.key]) total += c.points;
    });
    return total;
  }, [values]);

  const { interpretation, suggests } = useMemo(() => {
    let interp = "";
    let sug = "";
    if (score >= 3) { interp = "High probability of DVT"; sug = "DVT likely"; }
    else if (score >= 1) { interp = "Moderate probability of DVT"; sug = score >= 2 ? "DVT likely" : "DVT unlikely"; }
    else { interp = "Low probability of DVT"; sug = "DVT unlikely"; }

    return { interpretation: interp, suggests: sug };
  }, [score]);

  return (
    <div className="calc-container" style={{ maxWidth: 500 }}>
      <div className="calc-box">
        {criteria.map((c) => (
          <label key={c.key} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={values[c.key]}
              onChange={(e) => setField(c.key, e.target.checked)}
              style={{ marginRight: 8 }}
            />
            {c.label} {c.points > 0 ? `(+${c.points})` : `(${c.points})`}
          </label>
        ))}
      </div>

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      {(score !== 0 || Object.values(values).some(v => v)) && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <strong>Total Score:</strong> {score} <br />
          <strong>Interpretation:</strong> {interpretation}
          {suggests && (
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
              <p style={{ color: '#0056b3', marginTop: 4 }}>Action: {suggests}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
