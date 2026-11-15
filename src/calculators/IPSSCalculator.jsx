import React, { useMemo } from "react";
import { useCalc, ResetButton } from "./CalcFields";

const QUESTIONS = [
    { label: "Incomplete Emptying", max: 5 },
    { label: "Frequency", max: 5 },
    { label: "Intermittency", max: 5 },
    { label: "Urgency", max: 5 },
    { label: "Weak Stream", max: 5 },
    { label: "Straining", max: 5 },
    { label: "Nocturia", max: 5 }
];
const INITIAL_STATE = {
    answers: Array(QUESTIONS.length).fill(0), qol: 0,
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function IPSSCalculator() {
    const { values, updateField: setField, reset } = useCalc(INITIAL_STATE);

    const total = useMemo(() => values.answers.reduce((a, b) => a + b, 0), [values.answers]);
    const status = total <= 7
        ? { label: "Mild", color: "#16a34a" }
        : total <= 19
            ? { label: "Moderate", color: "#d97706" }
            : { label: "Severe", color: "#dc2626" };

    return (
        <div className="calc-container">
            <div className="two-col-grid">
                {QUESTIONS.map((q, i) => (
                    <div key={i} className="calc-box">
                        <div style={{ marginBottom: "3px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.78rem", lineHeight: 1.2 }}>{q.label}</div>
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
                <div className="calc-box">
                    <div style={{ marginBottom: "3px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: "0.78rem", lineHeight: 1.2 }}>Quality of Life</div>
                        </div>
                        <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.78rem", marginLeft: "4px", whiteSpace: "nowrap" }}>
                            {values.qol}/6
                        </span>
                    </div>
                    <input type="range" min="0" max="6" step="1" value={values.qol} onChange={(e) => setField("qol", parseInt(e.target.value))} style={{ width: "100%", accentColor: "#015c9c", height: "6px" }} />
                </div>
            </div>
            <ResetButton onClick={reset} />
            <div className="calc-result" style={{ borderColor: status.color, color: status.color, marginTop: 16 }}>
                <p><strong>Score:</strong> {total} / 35 — {status.label}</p>
                <p>QoL Index: {values.qol} / 6</p>
                <div style={{ fontSize: "0.8rem", marginTop: "8px", fontWeight: "normal", opacity: 0.9 }}>
                    <p>Mild: 0-7 | Moderate: 8-19 | Severe: 20-35</p>
                </div>
            </div>
        </div>
    );
}