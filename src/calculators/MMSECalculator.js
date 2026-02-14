import React, { useState, useEffect, useMemo } from "react";
import "./CalculatorShared.css";

export default function MMSECalculator() {
    const questions = [
        { q: "Orientation to Time", max: 5, hint: "Year, season, date, day, month" },
        { q: "Orientation to Place", max: 5, hint: "State, country, town, hospital, floor" },
        { q: "Registration", max: 3, hint: "Name 3 objects; 1pt for each repeated" },
        { q: "Attention & Calculation", max: 5, hint: "Serial 7s or spell 'WORLD' backwards" },
        { q: "Recall", max: 3, hint: "Recall the 3 objects named above" },
        { q: "Language & Command", max: 8, hint: "Naming(2), Repeat(1), 3-step(3), Read(1), Write(1)" },
        { q: "Copying Design", max: 1, hint: "Intersecting pentagons" }
    ];

    const [answers, setAnswers] = useState(Array(questions.length).fill(0));

    // Using useMemo for better performance on derived state
    const totalScore = useMemo(() => {
        return answers.reduce((a, b) => a + b, 0);
    }, [answers]);

    const handleChange = (index, value, max) => {
        let num = parseInt(value, 10) || 0;
        if (num < 0) num = 0;
        if (num > max) num = max;

        const newAnswers = [...answers];
        newAnswers[index] = num;
        setAnswers(newAnswers);
    };

    const handleReset = () => {
        setAnswers(Array(questions.length).fill(0));
    };

    const getCognitiveStatus = (score) => {
        if (score >= 24) return { label: "Normal Cognition", color: "#16a34a" };
        if (score >= 18) return { label: "Mild Impairment", color: "#d97706" };
        return { label: "Severe Impairment", color: "#dc2626" };
    };

    const status = getCognitiveStatus(totalScore);

    return (
        <div className="calc-container">
            <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Mini-Mental State Exam (MMSE)</h3>

            <div className="ballard-grid">
                {questions.map((q, i) => (
                    <div key={i} className="calc-box">
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <label className="calc-label" style={{ fontWeight: "bold" }}>{q.q}</label>
                            <span style={{ fontSize: "0.75rem", color: "#7f8c8d", fontStyle: "italic" }}>
                                {q.hint}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                            <input
                                type="number"
                                min="0"
                                max={q.max}
                                className="calc-input"
                                value={answers[i]}
                                onChange={(e) => handleChange(i, e.target.value, q.max)}
                                style={{ width: "60px", textAlign: "center" }}
                            />
                            <span style={{ fontSize: "0.85rem", color: "#95a5a6" }}>/ {q.max}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={handleReset} className="calc-btn-reset" style={{ flex: 1 }}>
                    Clear All
                </button>
            </div>

            <div className="calc-result" style={{
                marginTop: "20px",
                borderLeft: `6px solid ${status.color}`,
                backgroundColor: "#f8fafc",
                padding: "16px"
            }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.85rem", opacity: 0.8, color: "#475569" }}>Total Score</p>
                <div style={{ fontSize: "2rem", fontWeight: "800", color: status.color }}>
                    {totalScore} <span style={{ fontSize: "1rem", color: "#94a3b8" }}>/ 30</span>
                </div>
                <div style={{ fontWeight: "700", marginTop: "4px", fontSize: "1.1rem", color: status.color }}>
                    {status.label}
                </div>

                <div style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                    fontSize: "0.8rem",
                    color: "#64748b",
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <span>24-30: Normal</span>
                    <span>18-23: Mild</span>
                    <span>0-17: Severe</span>
                </div>
            </div>
        </div>
    );
}