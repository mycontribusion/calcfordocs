import React, { useMemo } from "react";
import { useCalc, ResetButton, FormulaBox } from "./CalcFields";

const QUESTIONS = ["Incomplete Emptying", "Frequency", "Intermittency", "Urgency", "Weak Stream", "Straining", "Nocturia"];
const INITIAL_STATE = {
    answers: Array(QUESTIONS.length).fill(0), qol: 0,
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function IPSSCalculator() {
    const { values, updateField: setField, reset } = useCalc(INITIAL_STATE);

    const totalScore = useMemo(() => values.answers.reduce((a, b) => a + b, 0), [values.answers]);
    const severity = totalScore <= 7 ? { label: "MILD", color: "#16a34a" } : totalScore <= 19 ? { label: "MODERATE", color: "#d97706" } : { label: "SEVERE", color: "#dc2626" };

    return (
        <div className="calc-container">
            <FormulaBox title="IPSS Scoring & Severity Guide">
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Symptom Score Ranges (0–35):</p>
                <ul style={{ margin: "0 0 6px", paddingLeft: 18, fontSize: '0.75rem' }}>
                    <li><strong>0 – 7:</strong> Mildly symptomatic LUTS</li>
                    <li><strong>8 – 19:</strong> Moderately symptomatic LUTS</li>
                    <li><strong>20 – 35:</strong> Severely symptomatic LUTS</li>
                </ul>
                <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Quality of Life (QoL) Index (0–6):</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
                    <li>0 = Delighted, 1 = Pleased, 2 = Mostly satisfied</li>
                    <li>3 = Mixed, 4 = Mostly dissatisfied, 5 = Unhappy, 6 = Terrible</li>
                </ul>
            </FormulaBox>

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
            <ResetButton onClick={reset} />
            <div className="calc-result" style={{ borderColor: severity.color, color: severity.color, marginTop: 16 }}>
                <p><strong>Score:</strong> {totalScore} / 35 — {severity.label}</p>
                <p>QoL Index: {values.qol}</p>
            </div>
        </div>
    );
}