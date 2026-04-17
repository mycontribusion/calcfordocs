import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    albumin: "",
    ascitesAlbumin: "",
    albuminUnit: "g/L",
    result: null,
};

export default function SAAGCalculator() {
    const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const serumVal = parseFloat(values.albumin);
        const ascitesVal = parseFloat(values.ascitesAlbumin);

        if (!Number.isFinite(serumVal) || !Number.isFinite(ascitesVal) || serumVal <= 0 || ascitesVal <= 0) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        // SAAG is always calculating the same regardless of units if both are identical, 
        // BUT the threshold of 1.1 is strictly for g/dL. (1.1 g/dL = 11 g/L)
        let saag = serumVal - ascitesVal;
        let threshold = values.albuminUnit === "g/dL" ? 1.1 : 11;

        let interpretation = "";
        let suggests = "";
        if (saag >= threshold) {
            interpretation = "High SAAG (≥ 1.1 g/dL)";
            suggests = "Suggests Portal Hypertension origin (e.g., Cirrhosis, Alcoholic Hepatitis, Heart Failure, Budd-Chiari Syndrome).";
        } else {
            interpretation = "Low SAAG (< 1.1 g/dL)";
            suggests = "Suggests Non-Portal Hypertension origin (e.g., Peritoneal Carcinomatosis, Tuberculosis, Pancreatitis, Nephrotic Syndrome).";
        }

        const res = `${saag.toFixed(values.albuminUnit === "g/dL" ? 2 : 1)} ${values.albuminUnit}`;

        updateFields({ result: { value: res, interpretation, suggests } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.albumin, values.ascitesAlbumin, values.albuminUnit]);

    return (
        <div className="calc-container">
            <div className="calc-box">
                <label className="calc-label">Serum Albumin:</label>
                <SyncSuggestion field="albumin" suggestion={suggestions.albumin} onSync={syncField} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        value={values.albumin}
                        onChange={(e) => setField("albumin", e.target.value)}
                        className="calc-input"
                        style={{ flex: 2 }}
                    />
                    <select
                        value={values.albuminUnit}
                        onChange={(e) => setField("albuminUnit", e.target.value)}
                        className="calc-select"
                        style={{ flex: 1 }}
                    >
                        <option value="g/dL">g/dL</option>
                        <option value="g/L">g/L</option>
                    </select>
                </div>
            </div>

            <div className="calc-box">
                <label className="calc-label">Ascitic Fluid Albumin:</label>
                <SyncSuggestion field="ascitesAlbumin" suggestion={suggestions.ascitesAlbumin} onSync={syncField} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        value={values.ascitesAlbumin}
                        onChange={(e) => setField("ascitesAlbumin", e.target.value)}
                        className="calc-input"
                        style={{ flex: 2 }}
                    />
                    <select
                        value={values.albuminUnit}
                        onChange={(e) => setField("albuminUnit", e.target.value)} // Shares unit state
                        className="calc-select"
                        style={{ flex: 1 }}
                    >
                        <option value="g/dL">g/dL</option>
                        <option value="g/L">g/L</option>
                    </select>
                </div>
            </div>

            <button onClick={reset} className="calc-btn-reset">
                Reset Calculator
            </button>

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p><strong>SAAG:</strong> {values.result.value}</p>
                    <p style={{ marginTop: 4, color: values.result.value.split(' ')[0] >= (values.albuminUnit === "g/dL" ? 1.1 : 11) ? '#b30000' : '#0056b3' }}>
                        {values.result.interpretation}
                    </p>
                    <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
                        <p style={{ color: values.result.value.split(' ')[0] >= (values.albuminUnit === "g/dL" ? 1.1 : 11) ? '#b30000' : '#0056b3' }}>
                            {values.result.suggests}
                        </p>
                        <strong style={{ display: 'block', marginTop: 12 }}>Formula:</strong>
                        <p className="font-mono text-sm" style={{ opacity: 0.8 }}>SAAG = Serum Albumin - Ascitic Fluid Albumin</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
                            <li>• Portal HTN causes transudative ascites (high gradient).</li>
                            <li>• Non-portal causes are exudative (low gradient).</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
