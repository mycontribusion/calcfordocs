import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    dose: "",
    supplyAmount: "",
    supplyVolume: 1, // Default to 1 for "per mL" compatibility
    unit: "mg",
    result: null
};

export default function DrugVolumeCalculator() {
    const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const d = parseFloat(values.dose);
        const sa = parseFloat(values.supplyAmount);
        const sv = parseFloat(values.supplyVolume);

        if (isNaN(d) || isNaN(sa) || isNaN(sv) || d <= 0 || sa <= 0 || sv <= 0) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        // Formula: Volume (mL) = Dose * (Supply Volume / Supply Amount)
        const volume = d * (sv / sa);

        updateFields({
            result: volume.toFixed(2)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.dose, values.supplyAmount, values.supplyVolume]);

    return (
        <div className="calc-container">
            <div className="calc-box">
                <label className="calc-label">Desired Dose</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="number"
                        inputMode="decimal"
                        value={values.dose}
                        onChange={(e) => setField("dose", e.target.value)}
                        placeholder="e.g., 5"
                        className="calc-input"
                        style={{ flex: 1 }}
                    />
                    <select
                        value={values.unit}
                        onChange={(e) => setField("unit", e.target.value)}
                        className="calc-select"
                        style={{ width: '100px' }}
                    >
                        <option value="mg">mg</option>
                        <option value="mcg">mcg</option>
                        <option value="Units">Units</option>
                        <option value="grams">grams</option>
                        <option value="mmol">mmol</option>
                    </select>
                </div>
            </div>

            <div className="calc-box">
                <label className="calc-label">Available Supply (Vial / Ampoule)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                        type="number"
                        inputMode="decimal"
                        value={values.supplyAmount}
                        onChange={(e) => setField("supplyAmount", e.target.value)}
                        placeholder="Amount"
                        className="calc-input"
                        style={{ flex: '1 1 80px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{values.unit}</span>
                    <span style={{ margin: '0 4px' }}>in</span>
                    <input
                        type="number"
                        inputMode="decimal"
                        value={values.supplyVolume}
                        onChange={(e) => setField("supplyVolume", e.target.value)}
                        placeholder="Vol"
                        className="calc-input"
                        style={{ flex: '1 1 80px' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>mL</span>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '8px', display: 'block' }}>
                    Example: 10 mg in 2 mL ampoule
                </span>
            </div>

            <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p style={{ fontSize: '1.1rem' }}>Dose to Administer:</p>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#01579b', margin: '8px 0' }}>
                        {values.result} mL
                    </p>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '8px' }}>
                        <strong>Calculation:</strong> {values.dose} {values.unit} ÷ ({values.supplyAmount} {values.unit} / {values.supplyVolume} mL)
                    </div>
                </div>
            )}
        </div>
    );
}
