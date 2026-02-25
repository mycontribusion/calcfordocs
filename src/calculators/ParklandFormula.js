import React from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    weight: "",
    weightUnit: "kg",
    tbsa: "",
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function ParklandFormula() {
    const { values, suggestions, updateField, syncField, reset } = useCalculator(INITIAL_STATE);

    const weight = parseFloat(values.weight) || 0;
    const tbsaInput = parseFloat(values.tbsa) || 0;

    // Cap calculation at 50% TBSA
    const tbsaForCalc = Math.min(tbsaInput, 50);
    const isCapped = tbsaInput > 50;

    const totalFluid = 4 * weight * tbsaForCalc;
    const first8Hours = totalFluid / 2;
    const next16Hours = totalFluid / 2;

    return (
        <div className="calc-container">
            <div className="calc-formula-box">
                <strong>Formula:</strong> 4 mL × Weight (kg) × %TBSA
                <div style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '4px' }}>
                    *Use 50% max TBSA for fluid calculation.
                </div>
            </div>

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
