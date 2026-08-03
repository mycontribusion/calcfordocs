import { useEffect } from "react";
import { useCalc, SyncSuggestion, FormulaBox, ResetButton } from "./CalcFields";

const INITIAL_STATE = {
    albumin: "",
    ascitesAlbumin: "",
    albuminUnit: "g/L",
    result: null,
};

export default function SAAGCalculator() {
    const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

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
            <FormulaBox title="SAAG Formula & Differential Diagnosis">
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formula:</p>
                <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>SAAG = Serum Albumin − Ascitic Fluid Albumin</p>
                <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Interpretation:</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
                    <li><strong>High SAAG (≥ 1.1 g/dL):</strong> Portal Hypertension<br/><span style={{ opacity: 0.75 }}>→ Cirrhosis, Alcoholic Hepatitis, Cardiac Failure, Budd-Chiari Syndrome</span></li>
                    <li style={{ marginTop: 4 }}><strong>Low SAAG (&lt; 1.1 g/dL):</strong> Non-Portal cause<br/><span style={{ opacity: 0.75 }}>→ Peritoneal Carcinomatosis, TB Peritonitis, Pancreatitis, Nephrotic Syndrome</span></li>
                </ul>
            </FormulaBox>

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
                        onChange={(e) => setField("albuminUnit", e.target.value)}
                        className="calc-select"
                        style={{ flex: 1 }}
                    >
                        <option value="g/dL">g/dL</option>
                        <option value="g/L">g/L</option>
                    </select>
                </div>
            </div>

            <ResetButton onClick={reset} />

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p><strong>SAAG:</strong> {values.result.value}</p>
                    <p style={{ marginTop: 4, color: values.result.value.split(' ')[0] >= (values.albuminUnit === "g/dL" ? 1.1 : 11) ? '#b30000' : '#0056b3' }}>
                        {values.result.interpretation}
                    </p>
                    <p style={{ marginTop: 8, fontSize: '0.85rem', color: values.result.value.split(' ')[0] >= (values.albuminUnit === "g/dL" ? 1.1 : 11) ? '#b30000' : '#0056b3' }}>
                        {values.result.suggests}
                    </p>
                </div>
            )}
        </div>
    );
}
