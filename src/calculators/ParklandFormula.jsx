import React from "react";
import { useCalc, SyncSuggestion, FormulaBox, ResetButton } from "./CalcFields";
import { toKg } from "../utils/unitConversion";

const INITIAL_STATE = {
    weight: "",
    weightUnit: "kg",
    tbsa: "",
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function ParklandFormula() {
    const { values, suggestions, updateField, syncField, reset } = useCalc(INITIAL_STATE);

    const weight = toKg(values.weight, values.weightUnit) || 0;
    const tbsaInput = parseFloat(values.tbsa) || 0;

    // Cap calculation at 50% TBSA
    const tbsaForCalc = Math.min(tbsaInput, 50);
    const isCapped = tbsaInput > 50;

    const totalFluid = 4 * weight * tbsaForCalc;
    const first8Hours = totalFluid / 2;
    const next16Hours = totalFluid / 2;

    return (
        <div className="calc-container">
            <FormulaBox title="Parkland Formula & Resuscitation Guide">
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formula:</p>
                <p style={{ fontFamily: "monospace", margin: "0 0 4px 0" }}>Total Fluid (24h) = 4 mL × Weight (kg) × %TBSA</p>
                <p style={{ margin: "4px 0", fontSize: '0.78rem' }}>• <strong>Fluid of Choice:</strong> Ringer's Lactate (RL)</p>
                <p style={{ margin: "2px 0", fontSize: '0.78rem' }}>• <strong>Timing:</strong> Give 50% in first 8 hours (from time of burn), remaining 50% over next 16 hours.</p>
                <p style={{ margin: "2px 0", fontSize: '0.78rem' }}>• <strong>Note:</strong> Maximum TBSA capped at 50% for fluid estimation to prevent fluid overload.</p>
            </FormulaBox>

            <div className="calc-grid">
                <div className="calc-group">
            <label>Weight (kg)</label>
            <SyncSuggestion field="weight" suggestion={suggestions.weight} onSync={syncField} />
            <input
                type="number"
                value={values.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className="calc-input"
            />
            <select value={values.weightUnit} onChange={(e) => updateField("weightUnit", e.target.value)} className="calc-select">
                <option value="kg">kg</option>
                <option value="lb">lb</option>
            </select>
                </div>
                <div className="calc-group">
                    <label>TBSA Burned (%)</label>
                    <input
                        type="number"
                        value={values.tbsa}
                        onChange={(e) => updateField("tbsa", e.target.value)}
                        className={`calc-input ${isCapped ? 'input-warning' : ''}`}
                        min="0"
                        max="100"
                    />
                    {isCapped && (
                        <div className="calc-info-badge">
                            Capped at 50% for calculation
                        </div>
                    )}
                </div>
            </div>

            <button onClick={reset} className="calc-btn-reset">
                Reset Calculator
            </button>

            {totalFluid > 0 && (
                <div className="calc-result-container">
                    <div className="calc-result">
                        <strong>Total Fluid (24h):</strong> {totalFluid.toLocaleString()} mL (Lactated Ringer's)
                    </div>
                    <div className="calc-result-sub">
                        <strong>First 8 Hours:</strong> {first8Hours.toLocaleString()} mL
                    </div>
                    <div className="calc-result-sub">
                        <strong>Next 16 Hours:</strong> {next16Hours.toLocaleString()} mL
                    </div>
                </div>
            )}
        </div>
    );
}
