import { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    appearance: null,
    pulse: null,
    grimace: null,
    activity: null,
    respiration: null
};

const CRITERIA = [
    {
        key: "appearance",
        label: "Appearance (Skin Color)",
        options: [
            { value: 0, label: "Blue-gray, pale all over" },
            { value: 1, label: "Normal color central, blue extremities" },
            { value: 2, label: "Normal color all over" }
        ]
    },
    {
        key: "pulse",
        label: "Pulse (Heart Rate)",
        options: [
            { value: 0, label: "Absent" },
            { value: 1, label: "< 100 beats per minute" },
            { value: 2, label: "≥ 100 beats per minute" }
        ]
    },
    {
        key: "grimace",
        label: "Grimace (Reflex Irritability)",
        options: [
            { value: 0, label: "No response to stimulation" },
            { value: 1, label: "Grimace on stimulation" },
            { value: 2, label: "Cough, sneeze, or cry" }
        ]
    },
    {
        key: "activity",
        label: "Activity (Muscle Tone)",
        options: [
            { value: 0, label: "None / Limp" },
            { value: 1, label: "Some flexion" },
            { value: 2, label: "Active motion" }
        ]
    },
    {
        key: "respiration",
        label: "Respiration (Breathing Effort)",
        options: [
            { value: 0, label: "Absent" },
            { value: 1, label: "Slow or irregular" },
            { value: 2, label: "Good, crying" }
        ]
    }
];

export default function ApgarScore() {
    const { values: scores, updateField: handleSelect, reset } = useCalculator(INITIAL_STATE);

    const totalScore = useMemo(() => {
        const scoreValues = Object.values(scores);
        if (scoreValues.some((v) => v === null)) return null;
        return scoreValues.reduce((sum, v) => sum + v, 0);
    }, [scores]);

    const interpretation = useMemo(() => {
        if (totalScore === null) return null;
        if (totalScore >= 8) return { label: "Excellent (Normal)", color: "#16a34a" };
        if (totalScore >= 4) return { label: "Fairly Low (Moderately Depressed)", color: "#ea580c" };
        return { label: "Critically Low (Severely Depressed)", color: "#dc2626" };
    }, [totalScore]);

    return (
        <div className="calc-container">
            <div className="calc-grid">
                {CRITERIA.map((criterion) => (
                    <div key={criterion.key} className="calc-box full-width">
                        <label className="calc-label">{criterion.label}</label>
                        <select
                            value={scores[criterion.key] ?? ""}
                            onChange={(e) => handleSelect(criterion.key, parseInt(e.target.value))}
                            className="calc-input"
                            style={{
                                width: "100%",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                backgroundColor: "rgba(0,0,0,0.02)",
                                minHeight: "32px",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                            }}
                        >
                            <option value="" disabled>Select option...</option>
                            {criterion.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.value} pts: {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {totalScore !== null && (
                <div className="calc-result" style={{ marginTop: "24px" }}>
                    <div className="result-item">
                        <span className="result-label">Total score:</span>
                        <span className="result-value" style={{ color: interpretation.color }}>
                            {totalScore} / 10
                        </span>
                    </div>
                    <div className="result-item" style={{ marginTop: "8px" }}>
                        <span className="result-label">Interpretation:</span>
                        <span className="result-value" style={{ color: interpretation.color, fontSize: "1.1rem" }}>
                            {interpretation.label}
                        </span>
                    </div>
                </div>
            )}

            <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

            <p className="calc-footer" style={{ marginTop: "16px", fontSize: "0.8rem", opacity: 0.7 }}>
                Note: The APGAR score is typically calculated at 1 and 5 minutes after birth.
            </p>
        </div>
    );
}
