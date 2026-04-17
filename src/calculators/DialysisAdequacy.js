import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    preBUN: "",
    postBUN: "",
    ureaUnit: "mmol/L",
    result: null,
};

export default function DialysisAdequacy() {
    const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const pre = parseFloat(values.preBUN);
        const post = parseFloat(values.postBUN);

        if (
            !Number.isFinite(pre) || !Number.isFinite(post) || pre <= 0 || post <= 0
        ) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        // URR calculation (independent of BUN units, since it's a ratio)
        const urr = ((pre - post) / pre) * 100;

        let urrInterp = urr >= 65 ? "Adequate (≥ 65%)" : "Inadequate (< 65%)";

        updateFields({
            result: {
                urr: urr.toFixed(1),
                urrInterp,
                urrColor: urr >= 65 ? '#16a34a' : '#b30000'
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.preBUN, values.postBUN]);

    return (
        <div className="calc-container">
            <div className="calc-box">
                <label className="calc-label">Pre-Dialysis Urea / BUN:</label>
                <SyncSuggestion field="preBUN" suggestion={suggestions.preBUN} onSync={syncField} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        value={values.preBUN}
                        onChange={(e) => setField("preBUN", e.target.value)}
                        className="calc-input"
                        style={{ flex: 2 }}
                    />
                    <select value={values.ureaUnit} onChange={(e) => setField("ureaUnit", e.target.value)} className="calc-select" style={{ flex: 1.5 }}>
                        <option value="mmol/L">Urea (mmol/L)</option>
                        <option value="mg/dL">Urea (mg/dL)</option>
                        <option value="BUN (mg/dL)">BUN (mg/dL)</option>
                    </select>
                </div>
            </div>

            <div className="calc-box">
                <label className="calc-label">Post-Dialysis Urea / BUN:</label>
                <SyncSuggestion field="postBUN" suggestion={suggestions.postBUN} onSync={syncField} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        value={values.postBUN}
                        onChange={(e) => setField("postBUN", e.target.value)}
                        className="calc-input"
                        style={{ flex: 2 }}
                    />
                    <select value={values.ureaUnit} onChange={(e) => setField("ureaUnit", e.target.value)} className="calc-select" style={{ flex: 1.5 }}>
                        <option value="mmol/L">Urea (mmol/L)</option>
                        <option value="mg/dL">Urea (mg/dL)</option>
                        <option value="BUN (mg/dL)">BUN (mg/dL)</option>
                    </select>
                </div>
            </div>

            <button onClick={reset} className="calc-btn-reset">
                Reset Calculator
            </button>

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p><strong>URR:</strong> {values.result.urr}%</p>
                    <p style={{ marginTop: 4, color: values.result.urrColor }}>{values.result.urrInterp}</p>

                    <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
                        <strong>Interpretation Guide:</strong>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
                            <li>• Target Urea Reduction Ratio (URR) is generally ≥ 65%</li>
                            <li>• URR = ((Pre BUN - Post BUN) / Pre BUN) × 100</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
