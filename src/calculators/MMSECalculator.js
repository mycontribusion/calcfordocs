import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const QUESTIONS = [
    { label: "Orientation", detail: "Year · Season · Date · Day · Month", max: 5 },
    { label: "Orientation", detail: "State · County · Town · Hospital · Floor", max: 5 },
    { label: "Registration", detail: "3 objects", max: 3 },
    { label: "Attention", detail: "Serial 7s / Spell WORLD", max: 5 },
    { label: "Recall", detail: "3 objects", max: 3 },
    { label: "Naming", detail: "Pencil & watch", max: 2 },
    { label: "Repetition", detail: "No ifs, ands, or buts", max: 1 },
    { label: "3-Stage Command", detail: "Take, fold, put", max: 3 },
    { label: "Reading", detail: "Close your eyes", max: 1 },
    { label: "Writing", detail: "Write a sentence", max: 1 },
    { label: "Copying", detail: "Copy a figure", max: 1 }
];

const INITIAL_STATE = { answers: Array(QUESTIONS.length).fill(0) };

export default function MMSECalculator() {
    const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

    const total = useMemo(() => values.answers.reduce((a, b) => a + b, 0), [values.answers]);
    const status = total >= 24 ? { label: "Normal", color: "#16a34a" } : total >= 18 ? { label: "Mild Impairment", color: "#d97706" } : { label: "Severe Impairment", color: "#dc2626" };

    return (
        <div className="calc-container">
            <div className="two-col-grid">
                {QUESTIONS.map((q, i) => (
                    <div key={i} className="calc-box">
                        <div style={{ marginBottom: "3px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.78rem", lineHeight: 1.2 }}>{q.label}</div>
                                <div style={{ fontSize: "0.62rem", color: "#888", lineHeight: 1.3, marginTop: "1px" }}>{q.detail}</div>
                            </div>
                            <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.78rem", marginLeft: "4px", whiteSpace: "nowrap" }}>
                                {values.answers[i]}/{q.max}
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