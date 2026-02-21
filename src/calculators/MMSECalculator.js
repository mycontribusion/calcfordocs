import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const QUESTIONS = [
    { q: "Orientation (Year/Season/Date/Day/Month)", max: 5 },
    { q: "Orientation (State/Country/Town/Hospital/Floor)", max: 5 },
    { q: "Registration (3 objects)", max: 3 },
    { q: "Attention/Calculation", max: 5 },
    { q: "Recall (3 objects)", max: 3 },
    { q: "Language (Naming)", max: 2 },
    { q: "Repetition", max: 1 },
    { q: "3-Stage Command", max: 3 },
    { q: "Reading", max: 1 },
    { q: "Writing", max: 1 },
    { q: "Copying", max: 1 }
];

const INITIAL_STATE = { answers: Array(QUESTIONS.length).fill(0) };

export default function MMSECalculator() {
    const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

    const total = useMemo(() => values.answers.reduce((a, b) => a + b, 0), [values.answers]);
    const status = total >= 24 ? { label: "Normal", color: "#16a34a" } : total >= 18 ? { label: "Mild Impairment", color: "#d97706" } : { label: "Severe Impairment", color: "#dc2626" };

    return (
        <div className="calc-container">
            <div className="calc-questions">
                {QUESTIONS.map((q, i) => (
                    <div key={i} className="calc-box" style={{ padding: "12px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <label className="calc-label" style={{ marginBottom: 0, flex: 1 }}>{q.q}</label>
                            <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.9rem", marginLeft: "8px" }}>
                                {values.answers[i]} / {q.max}
                            </span>
                        </div>
                        <input type="range" min="0" max={q.max} step="1" value={values.answers[i]} onChange={e => {
                            const newAns = [...values.answers]; newAns[i] = parseInt(e.target.value);
                            setField("answers", newAns);
                        }} style={{ width: "100%", accentColor: "#015c9c", height: "6px" }} />
                    </div>
                ))}
            </div>
            <button onClick={reset} className="calc-btn-reset">Reset Assessment</button>
            <div className="calc-result" style={{ color: status.color, marginTop: 16 }}>
                <p><strong>Score:</strong> {total} / 30 — {status.label}</p>
                <div style={{ fontSize: "0.8rem", marginTop: "8px", fontWeight: "normal", opacity: 0.9 }}>
                    <p>Normal: 24-30 | Mild: 18-23 | Severe: 0-17</p>
                </div>
            </div>
        </div>
    );
}