import { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    respiration: null,
    // Global Sync Keys
    age: "",
    sex: "male",
};

const CRITERIA = [
    {
        key: "appearance",
        label: "Appearance (Skin Color)",
        options: [
            { value: 0, label: "Cyanotic / Pale all over" },
            { value: 1, label: "Body pink, extremities blue" },
            { value: 2, label: "Pink all over" }
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
            { value: 1, label: "Grimace or weak cry on stimulation" },
            { value: 2, label: "Cough, sneeze, or vigorous cry" }
        ]
    },
    {
        key: "activity",
        label: "Activity (Muscle Tone)",
        options: [
            { value: 0, label: "None / Limp" },
            { value: 1, label: "Some flexion" },
            { value: 2, label: "Well flexed / Active motion" }
        ]
    },
    {
        key: "respiration",
        label: "Respiration (Breathing Effort)",
        options: [
            { value: 0, label: "Absent" },
            { value: 1, label: "Slow or irregular" },
            { value: 2, label: "Strong crying" }
        ]
    }
];

export default function ApgarScore() {
    const { values: scores, updateField: handleSelect, reset } = useCalculator(INITIAL_STATE);

    const { totalScore, isComplete, hasAnySelection } = useMemo(() => {
        const scoreValues = Object.values(scores);
        const selected = scoreValues.filter(v => v !== null);
        return {
            totalScore: selected.reduce((sum, v) => sum + v, 0),
            isComplete: selected.length === 5,
            hasAnySelection: selected.length > 0
        };
    }, [scores]);

    const interpretation = useMemo(() => {
        if (!hasAnySelection) return null;
        // Interpretations based on the current total (even if partial)
        if (totalScore >= 8) return { label: "Excellent (Normal)", color: "#16a34a" };
        if (totalScore >= 4) return { label: "Fairly Low (Moderately Depressed)", color: "#ea580c" };
        return { label: "Critically Low (Severely Depressed)", color: "#dc2626" };
    }, [totalScore, hasAnySelection]);

    return (
        <div className="calc-container" style={{ padding: '8px' }}>
            <div className="calc-grid" style={{ gap: '6px' }}>
                {CRITERIA.map((criterion) => (
                    <div key={criterion.key} className="calc-box full-width" style={{ padding: '8px', marginBottom: '6px' }}>
                        <label className="calc-label" style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px', lineHeight: '1.2' }}>
                            {criterion.label}
                        </label>
                        <div style={{
                            display: "flex",
                            gap: "6px"
                        }}>
                            {criterion.options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(criterion.key, opt.value)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 2px",
                                        borderRadius: "6px",
                                        border: "2px solid",
                                        borderColor: scores[criterion.key] === opt.value ? "#015c9c" : "rgba(0,0,0,0.15)",
                                        backgroundColor: scores[criterion.key] === opt.value ? "#015c9c" : "#fff",
                                        color: scores[criterion.key] === opt.value ? "#fff" : "inherit",
                                        cursor: "pointer",
                                        transition: "all 0.1s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minHeight: "50px"
                                    }}
                                >
                                    <span style={{ fontWeight: "800", fontSize: "1.2rem", lineHeight: 1 }}>{opt.value}</span>
                                    <span style={{
                                        fontSize: "0.85rem",
                                        fontWeight: "600",
                                        marginTop: "2px",
                                        textAlign: "center",
                                        lineHeight: "1.1",
                                        wordWrap: "break-word",
                                        width: "100%"
                                    }}>
                                        {opt.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {hasAnySelection && (
                <div className="calc-result" style={{ marginTop: "16px", padding: '12px' }}>
                    <div className="result-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span className="result-label" style={{ fontSize: '1rem', fontWeight: '600' }}>
                            {isComplete ? "Total Apgar Score:" : "Current Partial Score:"}
                        </span>
                        <span className="result-value" style={{ color: interpretation?.color || "#015c9c", fontSize: '1.8rem', fontWeight: '900' }}>
                            {totalScore} / 10
                        </span>
                    </div>
                    {interpretation && (
                        <div className="result-item" style={{ marginTop: "8px", textAlign: 'center' }}>
                            <span className="result-value" style={{ color: interpretation.color, fontSize: "1.2rem", fontWeight: '700', lineHeight: '1.2' }}>
                                {interpretation.label}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <button onClick={reset} className="calc-btn-reset" style={{ marginTop: '12px', padding: '10px', fontSize: '1.05rem', fontWeight: '700' }}>
                Reset Calculator
            </button>

            {!isComplete && hasAnySelection && (
                <p style={{ margin: '10px 0 0', fontSize: '0.85rem', fontWeight: '500', opacity: 0.8, textAlign: 'center' }}>
                    Score updates dynamically. Complete all fields for final assessment.
                </p>
            )}
        </div>
    );
}
