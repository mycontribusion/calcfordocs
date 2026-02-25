import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const QUESTIONS = ["Incomplete Emptying", "Frequency", "Intermittency", "Urgency", "Weak Stream", "Straining", "Nocturia"];
const INITIAL_STATE = {
    answers: Array(QUESTIONS.length).fill(0), qol: 0,
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function IPSSCalculator() {
    const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

    const totalScore = useMemo(() => values.answers.reduce((a, b) => a + b, 0), [values.answers]);
    const severity = totalScore <= 7 ? { label: "MILD", color: "#16a34a" } : totalScore <= 19 ? { label: "MODERATE", color: "#d97706" } : { label: "SEVERE", color: "#dc2626" };

    return (
        <div className="calc-container">
            <div className="two-col-grid">
                {QUESTIONS.map((q, i) => (
                    <div key={i} className="calc-box">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <label className="calc-label">{q}</label>
                            <strong>{values.answers[i]}</strong>
                        </div>
                        <input type="range" min="0" max="5" value={values.answers[i]} onChange={(e) => {
                            const newAns = [...values.answers]; newAns[i] = parseInt(e.target.value);
                            setField("answers", newAns);
                        }} style={{ width: "100%", accentColor: "#015c9c" }} />
                    </div>
                ))}
                <div className="calc-box">
                    <div style={{ display: "flex", justifyContent: "space-between" }}><label className="calc-label">Quality of Life</label><strong>{values.qol}</strong></div>
                    <input type="range" min="0" max="6" value={values.qol} onChange={(e) => setField("qol", parseInt(e.target.value))} style={{ width: "100%", accentColor: "#015c9c" }} />
                </div>
            </div>
            <button onClick={reset} className="calc-btn-reset">Reset Assessment</button>
            <div className="calc-result" style={{ borderColor: severity.color, color: severity.color, marginTop: 16 }}>
                <p><strong>Score:</strong> {totalScore} / 35 — {severity.label}</p>
                <p>QoL Index: {values.qol}</p>
            </div>
        </div>
    );
}