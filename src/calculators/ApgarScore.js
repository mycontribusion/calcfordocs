import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    activeTab: "m1", // "m1", "m5", "m10"
    m1_appearance: null, m1_pulse: null, m1_grimace: null, m1_activity: null, m1_respiration: null,
    m5_appearance: null, m5_pulse: null, m5_grimace: null, m5_activity: null, m5_respiration: null,
    m10_appearance: null, m10_pulse: null, m10_grimace: null, m10_activity: null, m10_respiration: null,
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
            { value: 1, label: "Grimace or weak cry" },
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
        label: "Respiration (Breathing)",
        options: [
            { value: 0, label: "Absent" },
            { value: 1, label: "Slow or irregular" },
            { value: 2, label: "Strong crying" }
        ]
    }
];

export default function ApgarScore() {
    const { values, updateField: handleSelect, reset } = useCalculator(INITIAL_STATE);

    // Timer State
    const [seconds, setSeconds] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [timerActive]);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const calcIntervalScore = useCallback((prefix) => {
        const keys = ["appearance", "pulse", "grimace", "activity", "respiration"];
        const selected = keys.map(k => values[`${prefix}_${k}`]).filter(v => v !== null);
        return {
            total: selected.reduce((sum, v) => sum + v, 0),
            isComplete: selected.length === 5,
            hasAny: selected.length > 0
        };
    }, [values]);

    const intervalScores = useMemo(() => ({
        m1: calcIntervalScore("m1"),
        m5: calcIntervalScore("m5"),
        m10: calcIntervalScore("m10")
    }), [calcIntervalScore]);

    const getInterpretation = (score) => {
        if (score >= 8) return { label: "Excellent", color: "#16a34a" };
        if (score >= 4) return { label: "Fair", color: "#ea580c" };
        return { label: "Depressed", color: "#dc2626" };
    };

    const currentScore = intervalScores[values.activeTab];
    const currentInterp = getInterpretation(currentScore.total);

    const handleReset = () => {
        reset();
        setSeconds(0);
        setTimerActive(false);
    };

    return (
        <div className="calc-container" style={{ padding: '6px' }}>

            {/* Thinner Apgar Timer */}
            <div className="calc-box" style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', background: 'rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: '700' }}>TIME SINCE BIRTH</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'monospace' }}>{formatTime(seconds)}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setTimerActive(!timerActive)}
                        style={{ background: timerActive ? '#dc2626' : '#16a34a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                        {timerActive ? 'STOP' : 'START'}
                    </button>
                    <button
                        onClick={() => setSeconds(0)}
                        style={{ background: 'rgba(0,0,0,0.1)', color: 'inherit', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                        RESET
                    </button>
                </div>
            </div>

            {/* Thinner Tabs */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px', background: 'rgba(0,0,0,0.05)', padding: '2px', borderRadius: '6px' }}>
                {["m1", "m5", "m10"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleSelect("activeTab", tab)}
                        style={{
                            flex: 1,
                            padding: '4px',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            background: values.activeTab === tab ? 'var(--card-bg, #fff)' : 'transparent',
                            color: values.activeTab === tab ? '#015c9c' : 'inherit',
                            transition: 'all 0.1s',
                        }}
                    >
                        {tab === "m1" ? "1m" : tab === "m5" ? "5m" : "10m"}
                        {intervalScores[tab].hasAny && <span style={{ opacity: 0.7 }}> ({intervalScores[tab].total})</span>}
                    </button>
                ))}
            </div>

            {/* Criteria - Restored details but thinner layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {CRITERIA.map((criterion) => (
                    <div key={criterion.key} className="calc-box" style={{ padding: '4px 6px', marginBottom: '0' }}>
                        <label className="calc-label" style={{ fontSize: '0.8rem', marginBottom: '2px', opacity: 0.9 }}>
                            {criterion.label}
                        </label>
                        <div style={{ display: "flex", gap: "3px" }}>
                            {criterion.options.map((opt) => {
                                const fieldKey = `${values.activeTab}_${criterion.key}`;
                                const isSelected = values[fieldKey] === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleSelect(fieldKey, opt.value)}
                                        style={{
                                            flex: 1,
                                            padding: "3px",
                                            borderRadius: "4px",
                                            border: "1.5px solid",
                                            borderColor: isSelected ? "#015c9c" : "rgba(0,0,0,0.1)",
                                            backgroundColor: isSelected ? "#015c9c" : "transparent",
                                            color: isSelected ? "#fff" : "inherit",
                                            cursor: "pointer",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: 'center',
                                            minHeight: '34px'
                                        }}
                                    >
                                        <span style={{ fontWeight: "800", fontSize: "0.95rem", lineHeight: 1 }}>{opt.value}</span>
                                        <span style={{ fontSize: "0.6rem", fontWeight: "600", textAlign: "center", lineHeight: "1.05", opacity: 0.9 }}>
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Thinner Summary & Result */}
            <div style={{ marginTop: '10px' }}>
                {currentScore.hasAny && (
                    <div className="calc-result" style={{ padding: '6px 10px', borderLeft: `4px solid ${currentInterp.color}`, textAlign: 'left', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.6 }}>{values.activeTab.toUpperCase()} RESULT:</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: currentInterp.color }}>{currentScore.total}/10 - {currentInterp.label}</div>
                        </div>
                    </div>
                )}

                {(intervalScores.m1.hasAny || intervalScores.m5.hasAny || intervalScores.m10.hasAny) && (
                    <div className="calc-box" style={{ padding: '6px', background: 'rgba(0,0,0,0.02)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', opacity: 0.5 }}>
                                    <th style={{ textAlign: 'left', padding: '2px 4px' }}>Criteria</th>
                                    <th style={{ textAlign: 'center', padding: '2px' }}>1m</th>
                                    <th style={{ textAlign: 'center', padding: '2px' }}>5m</th>
                                    <th style={{ textAlign: 'center', padding: '2px' }}>10m</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CRITERIA.map(c => (
                                    <tr key={c.key} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                        <td style={{ padding: '2px 4px', fontSize: '0.7rem' }}>{c.label.split(' (')[0]}</td>
                                        <td style={{ textAlign: 'center', padding: '2px', fontWeight: values[`m1_${c.key}`] !== null ? '700' : 'normal' }}>{values[`m1_${c.key}`] ?? '-'}</td>
                                        <td style={{ textAlign: 'center', padding: '2px', fontWeight: values[`m5_${c.key}`] !== null ? '700' : 'normal' }}>{values[`m5_${c.key}`] ?? '-'}</td>
                                        <td style={{ textAlign: 'center', padding: '2px', fontWeight: values[`m10_${c.key}`] !== null ? '700' : 'normal' }}>{values[`m10_${c.key}`] ?? '-'}</td>
                                    </tr>
                                ))}
                                <tr style={{ fontWeight: '800', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                                    <td style={{ padding: '4px' }}>TOTAL</td>
                                    <td style={{ textAlign: 'center', padding: '4px', color: '#015c9c' }}>{intervalScores.m1.total}</td>
                                    <td style={{ textAlign: 'center', padding: '4px', color: '#015c9c' }}>{intervalScores.m5.total}</td>
                                    <td style={{ textAlign: 'center', padding: '4px', color: '#015c9c' }}>{intervalScores.m10.total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <button onClick={handleReset} className="calc-btn-reset" style={{ marginTop: '6px', padding: '4px', fontSize: '0.8rem' }}>
                Clear All Records
            </button>
        </div>
    );
}
