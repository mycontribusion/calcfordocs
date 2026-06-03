import { useEffect } from "react";
import { useCalc, CalcBox, NumberField, ResetButton } from "./CalcFields";
import { toGlucoseMmol, toUreaMmol } from "../utils/unitConversion";

const INITIAL_STATE = {
  sodium: "",
  glucose: "",
  glucoseUnit: "mg/dL",
  urea: "",
  ureaUnit: "mmol/L",
  measured: "",
  result: null,
};

export default function SerumOsmolalityCalculator() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const naVal = parseFloat(values.sodium);
    const gluVal  = toGlucoseMmol(values.glucose, values.glucoseUnit);
    const ureaVal = toUreaMmol(values.urea, values.ureaUnit);

    if (isNaN(naVal) || isNaN(gluVal) || isNaN(ureaVal)) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const osm = 2 * naVal + gluVal + ureaVal;
    const measVal = values.measured === "" ? null : parseFloat(values.measured);
    const gap = (measVal !== null && !isNaN(measVal)) ? (measVal - osm).toFixed(1) : null;

    let osmInterp = "";
    let osmColor = "#16a34a"; // Normal

    if (osm < 275) {
      osmInterp = "Low (hypo-osmolality)";
      osmColor = "#d97706"; // Amber
    } else if (osm > 295) {
      osmInterp = "High (hyper-osmolality)";
      osmColor = "#dc2626"; // Red
    } else {
      osmInterp = "Normal";
    }

    updateFields({ result: { osmolality: osm.toFixed(1), gap, osmInterp, osmColor } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.sodium, values.glucose, values.glucoseUnit, values.urea, values.ureaUnit, values.measured]);

  return (
    <div className="calc-container">
      <NumberField label="Sodium (mmol/L):" field="sodium" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <NumberField
        label="Glucose:"
        field="glucose"
        values={values}
        setField={setField}
        suggestions={suggestions}
        syncField={syncField}
        units={[{ value: "mmol/L", label: "mmol/L" }, { value: "mg/dL", label: "mg/dL" }]}
      />
      <NumberField
        label="Urea:"
        field="urea"
        values={values}
        setField={setField}
        suggestions={suggestions}
        syncField={syncField}
        units={[{ value: "mmol/L", label: "mmol/L" }, { value: "mg/dL", label: "mg/dL" }]}
      />
      <CalcBox label="Measured Osmolality (optional):">
        <input type="number" value={values.measured} onChange={(e) => setField("measured", e.target.value)} className="calc-input" />
      </CalcBox>
      <ResetButton onClick={reset} />
      {values.result && (
        <div className="calc-result">
          <div className="calc-formula-box" style={{ marginBottom: 12, fontSize: '0.85rem' }}>
            Osm = 2×Na + Glucose + Urea (all in mmol/L)
          </div>
          <p>
            <strong>Calculated:</strong> {values.result.osmolality} mOsm/kg &nbsp;
            <span style={{ color: values.result.osmColor, fontWeight: 'bold' }}>({values.result.osmInterp})</span>
          </p>
          {values.result.gap !== null && (
            <>
              <p><strong>Osmol Gap:</strong> {values.result.gap} mOsm/kg</p>
              <p style={{ fontSize: '0.85rem', marginTop: 4, color: parseFloat(values.result.gap) > 10 ? '#dc2626' : '#16a34a' }}>
                {parseFloat(values.result.gap) > 10
                  ? '⚠️ Elevated gap (>10) — consider toxic alcohols, mannitol, or ketoacidosis'
                  : '✅ Normal osmol gap (≤10)'}
              </p>
            </>
          )}
          <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
            <strong>Reference:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0', opacity: 0.8 }}>
              <li>Normal: 275–295 mOsm/kg</li>
              <li>Normal osmol gap: &lt; 10 mOsm/kg</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
