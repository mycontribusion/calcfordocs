import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

// Updated with Clinically Accurate Hydrated Molecular Weights and Valence (z)
const ELECTROLYTES = {
    KCl: { name: "Potassium Chloride (KCl)", mw: 74.55, z: 1, color: "#e74c3c" },
    NaCl: { name: "Sodium Chloride (NaCl)", mw: 58.44, z: 1, color: "#3498db" },
    NaHCO3: { name: "Sodium Bicarbonate (NaHCO₃)", mw: 84.01, z: 1, color: "#f1c40f" },
    MgSO4: { name: "Magnesium Sulfate (Heptahydrate)", mw: 246.47, z: 2, color: "#9b59b6" },
    CaCl2: { name: "Calcium Chloride (Dihydrate)", mw: 147.01, z: 2, color: "#e67e22" },
    CaGluconate: { name: "Calcium Gluconate (Monohydrate)", mw: 448.39, z: 2, color: "#2ecc71" },
};

const INITIAL_STATE = {
    type: "KCl",
    massValue: "",
    massUnit: "g",
    mmol: "",
    mEq: "",
    lastChanged: null,
    result: null
};

export default function ElectrolyteUnitConverter() {
    const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const salt = ELECTROLYTES[values.type];
        if (!salt) return;

        const factor = values.massUnit === "g" ? 1000 : 1;

        if (values.lastChanged === "mass") {
            const val = parseFloat(values.massValue);
            if (isNaN(val) || val <= 0) {
                updateFields({ mmol: "", mEq: "" });
                return;
            }
            const mg = val * factor;
            const calculatedMmol = mg / salt.mw;
            updateFields({
                mmol: calculatedMmol.toFixed(2),
                mEq: (calculatedMmol * salt.z).toFixed(2),
                lastChanged: null
            });
        } else if (values.lastChanged === "mmol") {
            const mm = parseFloat(values.mmol);
            if (isNaN(mm) || mm <= 0) {
                updateFields({ massValue: "", mEq: "" });
                return;
            }
            const calculatedMg = mm * salt.mw;
            updateFields({
                massValue: (calculatedMg / factor).toFixed(values.massUnit === "g" ? 3 : 1),
                mEq: (mm * salt.z).toFixed(2),
                lastChanged: null
            });
        } else if (values.lastChanged === "unit") {
            const mm = parseFloat(values.mmol);
            if (isNaN(mm) || mm <= 0) return;
            const mg = mm * salt.mw;
            updateFields({
                massValue: (mg / factor).toFixed(values.massUnit === "g" ? 3 : 1),
                lastChanged: null
            });
        }
    }, [values.massValue, values.massUnit, values.mmol, values.type, values.lastChanged, updateFields]);

    const handleMassChange = (val) => updateFields({ massValue: val, lastChanged: "mass" });
    const handleMmolChange = (val) => updateFields({ mmol: val, lastChanged: "mmol" });
    const handleUnitChange = (val) => updateFields({ massUnit: val, lastChanged: "unit" });

    const setQuickMass = (grams) => {
        if (values.massUnit === "g") {
            handleMassChange(grams.toString());
        } else {
            handleMassChange((grams * 1000).toString());
        }
    };

    const activeSalt = ELECTROLYTES[values.type];

    return (
        <div className="calc-container">
            <div className="calc-box">
                <label className="calc-label">Select Electrolyte</label>
                <select
                    value={values.type}
                    onChange={(e) => {
                        reset();
                        setField("type", e.target.value);
                    }}
                    className="calc-input"
                    style={{ borderLeft: `5px solid ${activeSalt.color}` }}
                >
                    {Object.entries(ELECTROLYTES).map(([key, data]) => (
                        <option key={key} value={key}>{data.name}</option>
                    ))}
                </select>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    Molar Mass: {activeSalt.mw} mg/mmol | Valence (z): {activeSalt.z}
                </span>
            </div>

            <div className="calc-box">
                <label className="calc-label">Mass</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        value={values.massValue}
                        onChange={(e) => handleMassChange(e.target.value)}
                        placeholder="Amount"
                        className="calc-input"
                        style={{ flex: 1 }}
                    />
                    <select
                        value={values.massUnit}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        className="calc-select"
                        style={{ width: '100px' }}
                    >
                        <option value="mg">mg</option>
                        <option value="g">grams</option>
                    </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[1, 2, 5].map(g => (
                        <button key={g} className="calc-btn-reset"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                            onClick={() => setQuickMass(g)}>{g}g</button>
                    ))}
                </div>
            </div>

            <div className="calc-box">
                <label className="calc-label">Amount (mmol)</label>
                <input
                    type="number"
                    value={values.mmol}
                    onChange={(e) => handleMmolChange(e.target.value)}
                    placeholder="e.g. 13.4"
                    className="calc-input"
                />
            </div>

            <button onClick={reset} className="calc-btn-reset" style={{ background: '#f8f9fa', color: '#333' }}>
                Clear All
            </button>

            {(values.massValue || values.mmol) && (
                <div className="calc-result" style={{ marginTop: 16, borderTop: `4px solid ${activeSalt.color}` }}>
                    <p style={{ fontWeight: 'bold', color: activeSalt.color }}>Conversion Result</p>

                    <div style={{ margin: '12px 0', fontSize: '1.1rem' }}>
                        <strong>{values.massValue || "0"} {values.massUnit}</strong> ⟷ <strong>{values.mmol || "0"} mmol</strong>
                    </div>

                    {activeSalt.z > 1 && (
                        <div style={{ padding: '8px', background: '#f1f9ff', borderRadius: '4px', marginBottom: '10px' }}>
                            <p style={{ fontSize: '0.9rem', color: '#0056b3', margin: 0 }}>
                                <strong>Equivalent Dose: {values.mEq} mEq</strong>
                            </p>
                            <small style={{ opacity: 0.7 }}>Divalent ion: 1 mmol = 2 mEq</small>
                        </div>
                    )}

                    <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.6, fontStyle: 'italic' }}>
                        Calculation based on {activeSalt.name}
                    </span>
                </div>
            )}
        </div>
    );
}