import React, { useState, useMemo } from "react";
import "./CalculatorShared.css";

export default function IPSSCalculator() {
    const questions = [
        "Incomplete Emptying",
        "Frequency",
        "Intermittency",
        "Urgency",
        "Weak Stream",
        "Straining",
        "Nocturia"
    ];

    const [answers, setAnswers] = useState(Array(questions.length).fill(0));
    const [qol, setQol] = useState(0);

    const totalScore = useMemo(() => {
        return answers.reduce((a, b) => a + b, 0);
    }, [answers]);

    const handleChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = parseInt(value, 10);
        setAnswers(newAnswers);
    };

    const handleReset = () => {
        setAnswers(Array(questions.length).fill(0));
        setQol(0);
    };

    const getSeverity = (score) => {
        if (score <= 7) return { label: "MILD SYMPTOMS", color: "#16a34a" };
        if (score <= 19) return { label: "MODERATE SYMPTOMS", color: "#d97706" };
        return { label: "SEVERE SYMPTOMS", color: "#dc2626" };
    };

    const severity = getSeverity(totalScore);

    return (
        <div className="calc-container">
            <div className="ballard-grid">
                {questions.map((q, i) => (
                    <div key={i} className="calc-box" style={{ padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label className="calc-label" style={{ marginBottom: 0 }}>{q}</label>
                            <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.9rem" }}>
                                {answers[i]} <small style={{ opacity: 0.5, fontWeight: "400" }}>/ 5</small>
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="1"
                            value={answers[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                            style={{
                                width: "100%",
                                cursor: "pointer",
                                accentColor: "#015c9c",
                                height: "6px"
                            }}
                        />
                    </div>
                ))}

                <div className="calc-box" style={{ padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label className="calc-label" style={{ marginBottom: 0 }}>Quality of Life</label>
                        <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.9rem" }}>
                            {qol} <small style={{ opacity: 0.5, fontWeight: "400" }}>/ 6</small>
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="6"
                        step="1"
                        value={qol}
                        onChange={(e) => setQol(parseInt(e.target.value, 10))}
                        style={{
                            width: "100%",
                            cursor: "pointer",
                            accentColor: "#015c9c",
                            height: "6px"
                        }}
                    />
                </div>
            </div>

            <button onClick={handleReset} className="calc-btn-reset" style={{ marginTop: "8px" }}>
                Reset Assessment
            </button>

            <div
                className="calc-result"
                style={{
                    borderColor: severity.color,
                    color: severity.color,
                    backgroundColor: severity.color + '15',
                    borderStyle: "solid",
                    marginTop: "16px"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ textAlign: "left" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", opacity: 0.8 }}>Symptom Score</p>
                        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            {totalScore} <small style={{ fontSize: "0.9rem", fontWeight: "normal", opacity: 0.7 }}>/ 35</small>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", opacity: 0.8 }}>QoL Index</p>
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{qol}</div>
                    </div>
                </div>

                <div style={{ fontWeight: "700", marginTop: "8px" }}>
                    {severity.label}
                </div>

                <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
                    0-7: Mild | 8-19: Moderate | 20-35: Severe
                </p>
            </div>
        </div>
    );
}