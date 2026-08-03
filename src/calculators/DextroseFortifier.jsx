import { useEffect } from "react";
import { useCalc, ResetButton, FormulaBox } from "./CalcFields";

const INITIAL_STATE = {
    bagVolume: 500,        // Default (mL)
    currentConc: 5,        // Start % (often D5)
    targetConc: 10,       // Goal %
    stockConc: 50,        // Source % (D50)
    result: null,
};

export default function DextroseFortifier() {
    const { values, updateField: setField, updateFields, reset } = useCalc(INITIAL_STATE);

    useEffect(() => {
        const { bagVolume, currentConc, targetConc, stockConc } = values;

        if (
            isNaN(bagVolume) || isNaN(currentConc) || isNaN(targetConc) || isNaN(stockConc) ||
            bagVolume <= 0 || targetConc <= currentConc || stockConc <= targetConc
        ) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        const volumeToAdd = (bagVolume * (targetConc - currentConc)) / (stockConc - currentConc);

        updateFields({
            result: {
                toAdd: volumeToAdd.toFixed(1),
                toWithdraw: volumeToAdd.toFixed(1),
                finalVol: bagVolume
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.bagVolume, values.currentConc, values.targetConc, values.stockConc]);

    return (
        <div className="calc-container">
            <FormulaBox title="Dextrose Fortification Formula & Instructions">
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Withdraw & Replace Method (Constant Volume):</p>
                <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>
                    V_replace = [ Bag Vol × (Target % − Current %) ] ÷ (Stock % − Current %)
                </p>
                <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Clinical Indications:</p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
                    <li>Increasing IV glucose delivery (GIR) in neonates or patients with refractory hypoglycemia.</li>
                    <li>Maintains constant total IV bag volume (e.g. 500 mL bag stays exactly 500 mL after fortification).</li>
                </ul>
            </FormulaBox>

            <div className="calc-box">
                <label className="calc-label">Total Volume of Bag (mL)</label>
                <input
                    type="number"
                    value={values.bagVolume}
                    onChange={(e) => setField("bagVolume", parseFloat(e.target.value) || "")}
                    className="calc-input"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Current Dextrose (%)</label>
                <input
                    type="number"
                    value={values.currentConc}
                    onChange={(e) => setField("currentConc", parseFloat(e.target.value) || 0)}
                    className="calc-input"
                />
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(e.g., D5W = 5%, NS = 0%)</span>
            </div>

            <div className="calc-box">
                <label className="calc-label">Target Dextrose (%)</label>
                <input
                    type="number"
                    value={values.targetConc}
                    onChange={(e) => setField("targetConc", parseFloat(e.target.value) || "")}
                    className="calc-input"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Stock Dextrose (D50/D25 %)</label>
                <input
                    type="number"
                    value={values.stockConc}
                    onChange={(e) => setField("stockConc", parseFloat(e.target.value) || "")}
                    className="calc-input"
                />
            </div>

            <ResetButton onClick={reset} />

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 12 }}>
                        <p><strong>Step 1:</strong> Withdraw <strong>{values.result.toWithdraw} mL</strong> from the {values.bagVolume} mL bag.</p>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <p><strong>Step 2:</strong> Add <strong>{values.result.toAdd} mL</strong> of D{values.stockConc} into the bag.</p>
                    </div>
                    <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 12 }}>
                        <p style={{ fontWeight: '500', color: '#0056b3' }}>
                            Final Composition: {values.bagVolume} mL of D{values.targetConc}% Fluid
                        </p>
                        <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>
                            Logic: Volume is replaced to keep the total bag constant.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
