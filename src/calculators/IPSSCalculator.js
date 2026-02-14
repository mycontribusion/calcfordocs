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
        let num = parseInt(value, 10) || 0;
        if (num < 0) num = 0;
        if (num > 5) num = 5;
        const newAnswers = [...answers];
        newAnswers[index] = num;
        setAnswers(newAnswers);
    };

    const handleReset = () => {
        setAnswers(Array(questions.length).fill(0));
        setQol(0);
    };

    const getSeverity = (score) => {
        if (score <= 7) return { label: "Mild Symptoms", color: "#16a34a" };
        if (score <= 19) return { label: "Moderate Symptoms", color: "#d97706" };
        return { label: "Severe Symptoms", color: "#dc2626" };
    };

    const severity = getSeverity(totalScore);

    return (
        <div className="calc-container">
            <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>IPSS (Prostate Score)</h3>

            <div className="ballard-grid">
                {questions.map((q, i) => (
                    <div key={i} className="calc-box">
                        <label className="calc-label" style={{ fontWeight: "600" }}>{q}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                className="calc-input"
                                value={answers[i]}
                                onChange={(e) => handleChange(i, e.target.value)}
                                style={{ width: "60px", textAlign: "center" }}
                            />
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>/ 5</span>
                        </div>
                    </div>
                ))}

                {/* Quality of Life (QoL) */}
                <div className="calc-box" style={{ borderLeft: "4px solid #3b82f6" }}>
                    <label className="calc-label" style={{ fontWeight: "600" }}>Quality of Life</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <input
                            type="number"
                            min="0"
                            max="6"
                            className="calc-input"
                            value={qol}
                            onChange={(e) => setQol(Math.min(6, Math.max(0, Number(e.target.value))))}
                            style={{ width: "60px", textAlign: "center" }}
                        />
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>/ 6</span>
                    </div>
                </div>
            </div>

            <button onClick={handleReset} className="calc-btn-reset" style={{ marginTop: "16px" }}>
                Reset
            </button>

            <div className="calc-result" style={{
                marginTop: "20px",
                borderLeft: `6px solid ${severity.color}`,
                backgroundColor: "#f8fafc",
                padding: "16px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>Symptom Score</p>
                        <div style={{ fontSize: "1.8rem", fontWeight: "800", color: severity.color }}>
                            {totalScore} <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "400" }}>/ 35</span>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>QoL</p>
                        <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b" }}>{qol}</div>
                    </div>
                </div>

                <div style={{
                    fontWeight: "700",
                    marginTop: "12px",
                    fontSize: "1.1rem",
                    color: severity.color
                }}>
                    {severity.label}
                </div>

                <div style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <span>0-7: Mild</span>
                    <span>8-19: Moderate</span>
                    <span>20-35: Severe</span>
                </div>
            </div>
        </div>
    );
}