import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const ELECTROLYTES = {
    KCl: { name: "Potassium Chloride (KCl)", mw: 74.55, unit: "mg/mmol" },
    NaCl: { name: "Sodium Chloride (NaCl)", mw: 58.44, unit: "mg/mmol" },
    NaHCO3: { name: "Sodium Bicarbonate (NaHCO₃)", mw: 84.01, unit: "mg/mmol" },
    MgSO4: { name: "Magnesium Sulfate (Anhydrous)", mw: 120.37, unit: "mg/mmol" },
    CaCl2: { name: "Calcium Chloride (Dihydrate)", mw: 147.01, unit: "mg/mmol" },
    CaGluconate: { name: "Calcium Gluconate", mw: 430.37, unit: "mg/mmol" },
};

const INITIAL_STATE = {
    type: "KCl",
    massMg: "",
    mmol: "",
    lastChanged: null, // "mass" or "mmol"
    result: null
};

export default function ElectrolyteUnitConverter() {
    const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const salt = ELECTROLYTES[values.type];
        if (!salt) return;

        if (values.lastChanged === "mass") {
            const mg = parseFloat(values.massMg);
            if (isNaN(mg) || mg <= 0) {
                setField("mmol", "");
                return;
            }
            const calculatedMmol = mg / salt.mw;
            updateFields({ mmol: calculatedMmol.toFixed(2), lastChanged: null });
        } else if (values.lastChanged === "mmol") {
            const mm = parseFloat(values.mmol);
            if (isNaN(mm) || mm <= 0) {
                setField("massMg", "");
                return;
            }
            const calculatedMg = mm * salt.mw;
            updateFields({ massMg: calculatedMg.toFixed(1), lastChanged: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.massMg, values.mmol, values.type, values.lastChanged]);

    const handleMassChange = (val) => {
        updateFields({ massMg: val, lastChanged: "mass" });
    };

    const handleMmolChange = (val) => {
        updateFields({ mmol: val, lastChanged: "mmol" });
    };

    // Preset quick buttons
    const setQuickMass = (g) => {
        handleMassChange((g * 1000).toString());
    };

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
                >
                    {Object.entries(ELECTROLYTES).map(([key, data]) => (
                        <option key={key} value={key}>{data.name}</option>
                    ))}
                </select>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                    Molar Mass: {ELECTROLYTES[values.type].mw} {ELECTROLYTES[values.type].unit}
                </span>
            </div>

            <div className="calc-box">
                <label className="calc-label">Mass (mg)</label>
                <input
                    type="number"
                    value={values.massMg}
                    onChange={(e) => handleMassChange(e.target.value)}
                    placeholder="Enter milligrams"
                    className="calc-input"
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button className="calc-btn-reset" style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }} onClick={() => setQuickMass(1)}>1 gram</button>
                    <button className="calc-btn-reset" style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }} onClick={() => setQuickMass(2)}>2 grams</button>
                </div>
            </div>

            <div className="calc-box">
                <label className="calc-label">Substance Amount (mmol)</label>
                <input
                    type="number"
                    value={values.mmol}
                    onChange={(e) => handleMmolChange(e.target.value)}
                    placeholder="Enter millimoles"
                    className="calc-input"
                />
            </div>

            <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

            {(values.massMg || values.mmol) && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p style={{ fontWeight: 'bold', color: '#0056b3' }}>Conversion Summary</p>
                    <p style={{ marginTop: 8 }}>
                        <strong>{values.massMg || "?"} mg</strong> of {values.type} ≈ <strong>{values.mmol || "?"} mmol</strong>
                    </p>
                    <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: 8 }}>
                        Formula: mg = mmol × Molecular Weight
                    </span>
                </div>
            )}
        </div>
    );
}
