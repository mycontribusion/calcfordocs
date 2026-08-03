import { useCalc, ResetButton, FormulaBox } from "./CalcFields";
import { useMemo } from "react";

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

const INITIAL_STATE = {
  selected: {},
};

export default function HeartFailureFramingham() {
  const { values, updateField: setField, reset } = useCalc(INITIAL_STATE);

  const result = useMemo(() => {
    let majorCount = majorCriteria.filter((c) => values.selected[c.id]).length;
    let minorCount = minorCriteria.filter((c) => values.selected[c.id]).length;

    let diagnosis = "No Heart Failure (criteria not met)";
    if (majorCount >= 2) diagnosis = "Heart Failure Present (≥2 Major criteria)";
    else if (majorCount === 1 && minorCount >= 2) diagnosis = "Heart Failure Present (1 Major + ≥2 Minor)";
    return diagnosis;
  }, [values.selected]);

  const toggleCheck = (id) => {
    setField("selected", { ...values.selected, [id]: !values.selected[id] });
  };

  return (
    <div className="calc-container" style={{ maxWidth: 500 }}>
      <FormulaBox title="Framingham Criteria for Heart Failure">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Diagnosis requires:</p>
        <ul style={{ margin: "0 0 6px", paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>≥ 2 Major criteria, <strong>OR</strong></li>
          <li>1 Major + ≥ 2 Minor criteria</li>
        </ul>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Major Criteria:</p>
        <ul style={{ margin: "0 0 4px", paddingLeft: 18, fontSize: '0.73rem', opacity: 0.85 }}>
          <li>PND, JVD, Pulmonary Rales, Cardiomegaly</li>
          <li>Acute Pulmonary Oedema, S3 Gallop</li>
          <li>CVP &gt;16 cmH₂O, Circ Time ≥25 sec, Wt loss ≥4.5 kg on Rx</li>
        </ul>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Minor Criteria:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.73rem', opacity: 0.85 }}>
          <li>Ankle Oedema, Nocturnal Cough, Dyspnea on Exertion</li>
          <li>Hepatomegaly, Pleural Effusion, HR ≥120 bpm</li>
        </ul>
      </FormulaBox>

      <h3 style={{ fontSize: '1rem', marginTop: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Major Criteria</h3>
      <div className="calc-box">
        {majorCriteria.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={!!values.selected[c.id]} onChange={() => toggleCheck(c.id)} style={{ marginRight: 8 }} /> {c.label}
          </label>
        ))}
      </div>
      <h3 style={{ fontSize: '1rem', marginTop: 16, marginBottom: 8, color: 'var(--text-primary)' }}>Minor Criteria</h3>
      <div className="calc-box">
        {minorCriteria.map((c) => (
          <label key={c.id} style={{ display: "block", marginBottom: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={!!values.selected[c.id]} onChange={() => toggleCheck(c.id)} style={{ marginRight: 8 }} /> {c.label}
          </label>
        ))}
      </div>
      <ResetButton onClick={reset} style={{ marginTop: 10 }} />
      <div className="calc-result" style={{ marginTop: 15 }}><strong>Diagnosis:</strong> {result}</div>
    </div>
  );
}
