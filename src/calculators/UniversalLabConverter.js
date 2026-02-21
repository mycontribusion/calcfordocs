import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const ANALYTES = {
    glucose: {
        name: "Glucose",
        units: ["mmol/L", "mg/dL"],
        convert: (val, from) => {
            const factor = 18.0182;
            return from === "mmol/L"
                ? [{ value: val * factor, unit: "mg/dL" }]
                : [{ value: val / factor, unit: "mmol/L" }];
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
        units: ["mmol/L (Urea)", "mg/dL (Urea)", "mg/dL (BUN)"],
        convert: (val, from) => {
            if (from === "mmol/L (Urea)") {
                return [
                    { value: val * 6.006, unit: "mg/dL (Urea)" },
                    { value: val * 2.8, unit: "mg/dL (BUN)" }
                ];
            } else if (from === "mg/dL (Urea)") {
                return [
                    { value: val / 6.006, unit: "mmol/L (Urea)" },
                    { value: val / 2.14, unit: "mg/dL (BUN)" }
                ];
            } else {
                return [
                    { value: val / 2.8, unit: "mmol/L (Urea)" },
                    { value: val * 2.14, unit: "mg/dL (Urea)" }
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
    analyteKey: "glucose",
    inputValue: "",
    inputUnit: ANALYTES.glucose.units[0],
    results: [],
};

export default function UniversalLabConverter() {
    const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        updateFields({
            inputUnit: ANALYTES[values.analyteKey].units[0],
            inputValue: "",
            results: []
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.analyteKey]);

    useEffect(() => {
        const val = parseFloat(values.inputValue);
        if (isNaN(val) || val < 0) {
            if (values.results.length > 0) updateFields({ results: [] });
            return;
        }

        const converted = ANALYTES[values.analyteKey].convert(val, values.inputUnit);
        updateFields({ results: converted });
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
