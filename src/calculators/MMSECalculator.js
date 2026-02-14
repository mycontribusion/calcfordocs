import React, { useState, useMemo } from "react";
import "./CalculatorShared.css";

export default function MMSECalculator() {
    const questions = [
        { q: "Orientation to Time", max: 5 },
        { q: "Orientation to Place", max: 5 },
        { q: "Registration", max: 3 },
        { q: "Attention & Calculation", max: 5 },
        { q: "Recall", max: 3 },
        { q: "Language & Command", max: 8 },
        { q: "Copying Design", max: 1 }
    ];

    const [answers, setAnswers] = useState(Array(questions.length).fill(0));

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
    };

    const getStatus = (score) => {
        if (score >= 24) return { label: "NORMAL COGNITION", color: "#16a34a" };
        if (score >= 18) return { label: "MILD IMPAIRMENT", color: "#d97706" };
        return { label: "SEVERE IMPAIRMENT", color: "#dc2626" };
    };

    const status = getStatus(totalScore);

    return (
        <div className="calc-container">
            <div className="ballard-grid">
                {questions.map((q, i) => (
                    <div key={i} className="calc-box" style={{ padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <label className="calc-label" style={{ marginBottom: 0 }}>{q.q}</label>
                            <span style={{ fontWeight: "700", color: "#015c9c", fontSize: "0.9rem" }}>
                                {answers[i]} <small style={{ opacity: 0.5, fontWeight: "400" }}>/ {q.max}</small>
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={q.max}
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
            </div>

            <button onClick={handleReset} className="calc-btn-reset" style={{ marginTop: "8px" }}>
                Reset Assessment
            </button>

            <div
                className="calc-result"
                style={{
                    borderColor: status.color,
                    color: status.color,
                    backgroundColor: status.color + '15',
                    borderStyle: "solid",
                    marginTop: "16px"
                }}
            >
                <p style={{ margin: "0 0 4px", fontSize: "0.85rem", opacity: 0.8 }}>Total MMSE Score</p>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {totalScore} <span style={{ fontSize: "0.9rem", fontWeight: "normal", opacity: 0.7 }}>/ 30</span>
                </div>
                <div style={{ fontWeight: "700", marginTop: "8px" }}>
                    {status.label}
                </div>

                <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
                    ≥24: Normal | 18-23: Mild | &lt;18: Severe
                </p>
            </div>
        </div>
    );
}