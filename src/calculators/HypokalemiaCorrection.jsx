import { useEffect } from "react";
import { useCalc, NumberField, WeightField, ResetButton, FormulaBox } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
  weight: "",
  weightUnit: "kg",
  potassium: "",
  desiredK: "4.0",
  constant: "0.4",
  maintenanceRate: "1",
  results: null,
  message: "",
};

export default function HypokalemiaCorrection() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    if (!values.weight || !values.potassium || !values.desiredK) {
      if (values.results !== null || values.message !== "") updateFields({ results: null, message: "" });
      return;
    }

    const weightKg = toKg(values.weight, values.weightUnit);
    let currentK = parseFloat(values.potassium);
    let targetK = parseFloat(values.desiredK);
    const constant = parseFloat(values.constant);
    const maintenanceRate = parseFloat(values.maintenanceRate);

    if (isNaN(currentK) || currentK <= 0) { updateFields({ message: "⚠️ Please enter a valid observed serum K⁺ (mmol/L).", results: null }); return; }
    if (isNaN(weightKg) || weightKg <= 0) { updateFields({ message: "⚠️ Please enter a valid weight.", results: null }); return; }
    if (isNaN(targetK)) { updateFields({ message: "⚠️ Please enter a valid target serum K⁺ (mmol/L).", results: null }); return; }
    if (isNaN(constant) || constant <= 0) { updateFields({ message: "⚠️ Please enter a valid constant.", results: null }); return; }
    if (isNaN(maintenanceRate) || maintenanceRate < 0) { updateFields({ message: "⚠️ Please enter a valid maintenance rate.", results: null }); return; }

    if (currentK > 5.5) { updateFields({ message: "⚠️ Observed K⁺ > 5.5 mmol/L — this tool is for hypokalemia only.", results: null }); return; }
    if (currentK >= 3.5 && currentK <= 5.5) { updateFields({ message: "✅ Serum potassium is within normal range (3.5–5.5 mmol/L).", results: null }); return; }

    if (targetK <= currentK) { updateFields({ message: "⚠️ Target K⁺ must be greater than observed K⁺.", results: null }); return; }

    const deficit = (targetK - currentK) * weightKg * constant;
    const maintenance = weightKg * maintenanceRate;
    const total = deficit + maintenance;

    updateFields({ results: { deficit, maintenance, total, constant, maintenanceRate }, message: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.weight, values.weightUnit, values.potassium, values.desiredK, values.constant, values.maintenanceRate]);

  return (
    <div className="calc-container">
      <FormulaBox title="K⁺ Deficit & Safety Rules">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formulas:</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 2px 0", fontSize: '0.78rem' }}>Deficit = (Target − Observed) × Weight(kg) × Constant (default 0.4)</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>Maintenance = Weight(kg) × Rate (default 1 mmol/kg/day)</p>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Unit Conversions:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>Weight (lb) → (kg): × 0.453592</li>
          <li>Weight (g) → (kg): ÷ 1000</li>
        </ul>
        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Administration Safety Rules:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>Ensure <strong>urine output ≥ 0.5 mL/kg/hr</strong> before IV replacement.</li>
          <li><strong>Max daily dose:</strong> 120 mmol/day</li>
          <li><strong>Max infusion rate:</strong> 10–20 mmol/hr</li>
          <li><strong>Max concentration:</strong> 40 mmol/L (peripheral line)</li>
        </ul>
      </FormulaBox>

      <WeightField values={values} setField={setField} suggestions={suggestions} syncField={syncField} />
      <NumberField label="Observed Serum K⁺ (mmol/L):" field="potassium" values={values} setField={setField} suggestions={suggestions} syncField={syncField} />

      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.02)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr 1.4fr", gap: "10px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
            <label className="calc-label" htmlFor="k-target" style={{ marginBottom: 0, fontSize: "0.7rem", fontWeight: 500, opacity: 0.6 }}>Target Serum</label>
            <div style={{ position: "relative", width: "100%", minWidth: 0 }}>
              <input
                id="k-target"
                type="number"
                inputMode="decimal"
                value={values.desiredK}
                onChange={(e) => setField("desiredK", e.target.value)}
                className="calc-input"
                style={{
                  width: "100%",
                  paddingRight: "3.2rem",
                  fontSize: "0.85rem",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "none",
                }}
              />
              <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>mmol/L</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
            <label className="calc-label" htmlFor="k-constant" style={{ marginBottom: 0, fontSize: "0.7rem", fontWeight: 500, opacity: 0.6 }}>Constant</label>
            <input
              id="k-constant"
              type="number"
              inputMode="decimal"
              value={values.constant}
              onChange={(e) => setField("constant", e.target.value)}
              className="calc-input"
              style={{
                width: "100%",
                fontSize: "0.85rem",
                paddingTop: "6px",
                paddingBottom: "6px",
                background: "transparent",
                border: "1px solid rgba(0,0,0,0.12)",
                boxShadow: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
            <label className="calc-label" htmlFor="k-maintenance" style={{ marginBottom: 0, fontSize: "0.7rem", fontWeight: 500, opacity: 0.6 }}>Maintenance</label>
            <div style={{ position: "relative", width: "100%", minWidth: 0 }}>
              <input
                id="k-maintenance"
                type="number"
                inputMode="decimal"
                value={values.maintenanceRate}
                onChange={(e) => setField("maintenanceRate", e.target.value)}
                className="calc-input"
                style={{
                  width: "100%",
                  paddingRight: "4.6rem",
                  fontSize: "0.85rem",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.12)",
                  boxShadow: "none",
                }}
              />
              <span style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "0.65rem", opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>mmol/kg/day</span>
            </div>
          </div>
        </div>
      </div>

      <ResetButton onClick={reset} />
      {values.message && <div className="calc-result" style={{ marginTop: 16, borderColor: values.message.includes("✅") ? '#16a34a' : '#ea580c', color: values.message.includes("✅") ? '#16a34a' : '#ea580c' }}><p>{values.message}</p></div>}
      {values.results && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Deficit:</strong> {values.results.deficit.toFixed(1)} mmol</p>
          <p><strong>Daily Maintenance:</strong> {values.results.maintenance.toFixed(1)} mmol/day</p>
          <p style={{ marginTop: 8, fontSize: '1.1rem', color: '#0056b3' }}><strong>Total Requirement:</strong> {values.results.total.toFixed(1)} mmol</p>

          <div style={{ marginTop: 16, textAlign: 'left', background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px' }}>Notes & Safety</h3>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.85rem', color: '#444' }}>
              <li><strong>Formula:</strong> Deficit = (Target – Observed) × Weight(kg) × {values.results.constant}</li>
              <li><strong>Maintenance:</strong> {values.results.maintenanceRate} mmol/kg/day</li>
              <li>Ensure <strong>urine output</strong> ≥ 0.5 mL/kg/hr before IV replacement</li>
              <li><strong>Max daily dose:</strong> 120 mmol/day</li>
              <li><strong>Max infusion rate:</strong> 10–20 mmol/hr</li>
              <li><strong>Max concentration:</strong> 40 mmol/L (peripheral line)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
