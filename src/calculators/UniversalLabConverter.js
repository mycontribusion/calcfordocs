import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const ANALYTES = {
    sodium: {
        name: "Sodium",
        units: ["mmol/L", "mEq/L", "mg/dL"],
        convert: (val, from) => {
            if (from === "mg/dL") return [{ value: val / 2.3, unit: "mmol/L" }, { value: val / 2.3, unit: "mEq/L" }];
            return from === "mmol/L" ? [{ value: val, unit: "mEq/L" }] : [{ value: val, unit: "mmol/L" }];
        }
    },
    potassium: {
        name: "Potassium",
        units: ["mmol/L", "mEq/L", "mg/dL"],
        convert: (val, from) => {
            if (from === "mg/dL") return [{ value: val / 3.9, unit: "mmol/L" }, { value: val / 3.9, unit: "mEq/L" }];
            return from === "mmol/L" ? [{ value: val, unit: "mEq/L" }] : [{ value: val, unit: "mmol/L" }];
        }
    },
    creatinine: {
        name: "Creatinine",
        units: ["µmol/L", "mg/dL", "mmol/L"],
        convert: (val, from) => {
            if (from === "µmol/L") {
                return [
                    { value: val / 88.4, unit: "mg/dL" },
                    { value: val / 1000, unit: "mmol/L" }
                ];
            } else if (from === "mg/dL") {
                return [
                    { value: val * 88.4, unit: "µmol/L" },
                    { value: (val * 88.4) / 1000, unit: "mmol/L" }
                ];
            } else {
                return [
                    { value: val * 1000, unit: "µmol/L" },
                    { value: (val * 1000) / 88.4, unit: "mg/dL" }
                ];
            }
        }
    },
    urea: {
        name: "Urea / BUN",
        units: ["mmol/L", "mg/dL", "BUN (mg/dL)"],
        convert: (val, from) => {
            if (from === "mmol/L") {
                return [
                    { value: val * 6.006, unit: "mg/dL" },
                    { value: val * 2.8, unit: "BUN (mg/dL)" }
                ];
            } else if (from === "mg/dL") {
                return [
                    { value: val / 6.006, unit: "mmol/L" },
                    { value: val / 2.14, unit: "BUN (mg/dL)" }
                ];
            } else {
                return [
                    { value: val / 2.8, unit: "mmol/L" },
                    { value: val * 2.14, unit: "mg/dL" }
                ];
            }
        }
    },
    calcium: {
        name: "Calcium",
        units: ["mmol/L", "mg/dL"],
        convert: (val, from) => {
            return from === "mmol/L"
                ? [{ value: val * 4.008, unit: "mg/dL" }]
                : [{ value: val / 4.008, unit: "mmol/L" }];
        }
    },
    phosphate: {
        name: "Phosphate",
        units: ["mmol/L", "mg/dL"],
        convert: (val, from) => {
            return from === "mmol/L"
                ? [{ value: val * 3.097, unit: "mg/dL" }]
                : [{ value: val / 3.097, unit: "mmol/L" }];
        }
    },
    magnesium: {
        name: "Magnesium",
        units: ["mmol/L", "mg/dL", "mEq/L"],
        convert: (val, from) => {
            if (from === "mmol/L") {
                return [
                    { value: val * 2.43, unit: "mg/dL" },
                    { value: val * 2, unit: "mEq/L" }
                ];
            } else if (from === "mg/dL") {
                return [
                    { value: val / 2.43, unit: "mmol/L" },
                    { value: (val / 2.43) * 2, unit: "mEq/L" }
                ];
            } else {
                return [
                    { value: val / 2, unit: "mmol/L" },
                    { value: (val / 2) * 2.43, unit: "mg/dL" }
                ];
            }
        }
    },
    albumin: {
        name: "Albumin / Total Protein",
        units: ["g/L", "g/dL"],
        convert: (val, from) => {
            return from === "g/L"
                ? [{ value: val / 10, unit: "g/dL" }]
                : [{ value: val * 10, unit: "g/L" }];
        }
    },
    bilirubin: {
        name: "Bilirubin",
        units: ["µmol/L", "mg/dL"],
        convert: (val, from) => {
            return from === "µmol/L"
                ? [{ value: val / 17.1, unit: "mg/dL" }]
                : [{ value: val * 17.1, unit: "µmol/L" }];
        }
    },
    hemoglobin: {
        name: "Hemoglobin",
        units: ["g/dL", "g/L", "mmol/L"],
        convert: (val, from) => {
            if (from === "g/dL") {
                return [
                    { value: val * 10, unit: "g/L" },
                    { value: val * 0.6206, unit: "mmol/L" }
                ];
            } else if (from === "g/L") {
                return [
                    { value: val / 10, unit: "g/dL" },
                    { value: (val / 10) * 0.6206, unit: "mmol/L" }
                ];
            } else {
                return [
                    { value: val / 0.6206, unit: "g/dL" },
                    { value: (val / 0.6206) * 10, unit: "g/L" }
                ];
            }
        }
    },
    cholesterol: {
        name: "Cholesterol",
        units: ["mmol/L", "mg/dL"],
        convert: (val, from) => {
            return from === "mmol/L"
                ? [{ value: val * 38.67, unit: "mg/dL" }]
                : [{ value: val / 38.67, unit: "mmol/L" }];
        }
    },
    triglycerides: {
        name: "Triglycerides",
        units: ["mmol/L", "mg/dL"],
        convert: (val, from) => {
            return from === "mmol/L"
                ? [{ value: val * 88.57, unit: "mg/dL" }]
                : [{ value: val / 88.57, unit: "mmol/L" }];
        }
    }
};

const INITIAL_STATE = {
    analyteKey: "sodium",
    inputValue: "",
    inputUnit: ANALYTES.sodium.units[0],
    results: [],
    // SYNC KEYS for auto-detection
    creatinine: "",
    creatinineUnit: "µmol/L",
    albumin: "",
    sodium: "",
    potassium: "",
    urea: "",
    ureaUnit: "mmol/L",
    calcium: "",
    calciumUnit: "mg/dL",
    phosphate: "",
    phosphateUnit: "mg/dL",
};

export default function UniversalLabConverter() {
    const { values, suggestions, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    // Initial sync when analyte changes or suggestions appear
    useEffect(() => {
        const analyte = values.analyteKey;
        if (analyte === "creatinine" && values.creatinine) {
            updateFields({ inputValue: values.creatinine, inputUnit: values.creatinineUnit });
        } else if (analyte === "albumin" && values.albumin) {
            updateFields({ inputValue: values.albumin, inputUnit: "g/dL" });
        } else if (analyte === "sodium" && values.sodium) {
            updateFields({ inputValue: values.sodium, inputUnit: "mmol/L" });
        } else if (analyte === "potassium" && values.potassium) {
            updateFields({ inputValue: values.potassium, inputUnit: "mmol/L" });
        } else if (analyte === "urea" && values.urea) {
            updateFields({ inputValue: values.urea, inputUnit: values.ureaUnit || "mmol/L" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.analyteKey]);

    useEffect(() => {
        const val = parseFloat(values.inputValue);
        if (isNaN(val) || val < 0) {
            if (values.results.length > 0) updateFields({ results: [] });
            return;
        }

        const updates = {};
        if (values.analyteKey === "creatinine") {
            updates.creatinine = values.inputValue;
            updates.creatinineUnit = values.inputUnit;
        } else if (values.analyteKey === "albumin") {
            updates.albumin = values.inputValue;
        } else if (values.analyteKey === "sodium" && values.inputUnit === "mmol/L") {
            updates.sodium = values.inputValue;
        } else if (values.analyteKey === "potassium" && values.inputUnit === "mmol/L") {
            updates.potassium = values.inputValue;
        } else if (values.analyteKey === "urea" && (values.inputUnit === "mmol/L" || values.inputUnit === "mg/dL")) {
            updates.urea = values.inputValue;
            updates.ureaUnit = values.inputUnit;
        }
        const converted = ANALYTES[values.analyteKey].convert(val, values.inputUnit);
        updateFields({ ...updates, results: converted });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.inputValue, values.inputUnit, values.analyteKey]);

    return (
        <div className="calc-container">
            <div className="calc-box">
                <label className="calc-label">Select Lab Test:</label>
                <select
                    className="calc-select"
                    value={values.analyteKey}
                    onChange={(e) => setField("analyteKey", e.target.value)}
                >
                    {Object.entries(ANALYTES).map(([key, data]) => (
                        <option key={key} value={key}>{data.name}</option>
                    ))}
                </select>
            </div>

            <div className="calc-box">
                <label className="calc-label">Value:</label>
                <SyncSuggestion
                    field="inputValue"
                    suggestion={suggestions[values.analyteKey]}
                    onSync={(field) => setField(field, suggestions[values.analyteKey])}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        inputMode="decimal"
                        className="calc-input"
                        value={values.inputValue}
                        onChange={(e) => setField("inputValue", e.target.value)}
                        placeholder="Enter value"
                        style={{ flex: 2 }}
                    />
                    <select
                        className="calc-select"
                        value={values.inputUnit}
                        onChange={(e) => setField("inputUnit", e.target.value)}
                        style={{ flex: 1.5 }}
                    >
                        {ANALYTES[values.analyteKey].units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
            </div>

            <button className="calc-btn-reset" onClick={reset}>Reset Calculator</button>

            {values.results.length > 0 && (
                <div className="calc-result" style={{ marginTop: '16px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Converted Results:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {values.results.map((res, index) => (
                            <div key={index} style={{ padding: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px' }}>
                                <strong>{res.value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 })}</strong> {res.unit}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
