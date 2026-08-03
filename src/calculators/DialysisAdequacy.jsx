import { useEffect } from "react";
import { useCalc, SyncSuggestion, FormulaBox, ResetButton } from "./CalcFields";

const INITIAL_STATE = {
    preBUN: "",
    postBUN: "",
    ureaUnit: "mmol/L",
    result: null,
};

export default function DialysisAdequacy() {
    const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

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
            <FormulaBox title="URR Formula & Adequacy Targets">
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formula:</p>
                <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>URR (%) = [(Pre BUN − Post BUN) ÷ Pre BUN] × 100</p>
                <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Adequacy Targets:</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
                    <li><strong>URR ≥ 65%:</strong> Adequate HD session (KDOQI target)</li>
                    <li><strong>Kt/V ≥ 1.2:</strong> Equivalent adequacy measure (not calculated here)</li>
                    <li><strong>URR &lt; 65%:</strong> Inadequate — review session time, blood flow rate, or access</li>
                </ul>
                <p style={{ margin: "6px 0 0", fontSize: '0.73rem', opacity: 0.75 }}>URR = Urea Reduction Ratio. Units cancel — ratio is valid regardless of mmol/L or mg/dL.</p>
            </FormulaBox>

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

            <ResetButton onClick={reset} />

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p><strong>URR:</strong> {values.result.urr}%</p>
                    <p style={{ marginTop: 4, fontWeight: 700, color: values.result.urrColor }}>{values.result.urrInterp}</p>
                </div>
            )}
        </div>
    );
}
