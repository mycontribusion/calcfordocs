import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const SOLUTES = {
    NaCl: { stock: 23.4, unit: "%", note: "Hypertonic saline" },
    KCl: { stock: 2, unit: "mmol/mL", note: "Typical 10 mmol/5 mL amp" },
    MgSO4: { stock: 50, unit: "%", note: "50% = 5 g/10 mL" },
    CaGluconate: { stock: 10, unit: "%", note: "10% solution" },
    NaHCO3: { stock: 8.4, unit: "%", note: "8.4% bicarbonate" },
    Dextrose: { stock: 50, unit: "%", note: "D50 standard" },

    Labetalol: { stock: 5, unit: "mg/mL", note: "100 mg/20 mL vial" },
    Hydralazine: { stock: 1, unit: "mg/mL", note: "Common working dilution 20 mg/20 mL" },

    Custom: { stock: "", unit: "", note: "" }
};

const INITIAL_STATE = {
    bagVolume: 500,
    currentConc: 0,
    targetConc: "",
    stockConc: "",
    solute: "Custom",
    mode: "withdraw",
    result: null
};

export default function ElectrolyteBuilder() {
    const { values, updateField: setField, updateFields, reset } =
        useCalculator(INITIAL_STATE);

    // Auto-fill stock concentration when solute changes
    useEffect(() => {
        const selected = SOLUTES[values.solute];
        if (selected && values.solute !== "Custom") {
            updateFields({
                stockConc: selected.stock
            });
        }
        // eslint-disable-next-line
    }, [values.solute]);

    useEffect(() => {
        const {
            bagVolume,
            currentConc,
            targetConc,
            stockConc,
            mode
        } = values;

        if (
            isNaN(bagVolume) ||
            isNaN(currentConc) ||
            isNaN(targetConc) ||
            isNaN(stockConc) ||
            bagVolume <= 0 ||
            targetConc <= currentConc ||
            stockConc <= 0 ||
            (mode === "withdraw" && stockConc <= currentConc)
        ) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        let volumeToAdd;

        if (mode === "withdraw") {
            volumeToAdd =
                (bagVolume * (targetConc - currentConc)) /
                (stockConc - currentConc);
        } else {
            volumeToAdd =
                (bagVolume * (targetConc - currentConc)) /
                stockConc;
        }

        if (volumeToAdd <= 0 || isNaN(volumeToAdd)) {
            updateFields({ result: null });
            return;
        }

        updateFields({
            result: {
                toAdd: volumeToAdd.toFixed(1),
                toWithdraw:
                    mode === "withdraw"
                        ? volumeToAdd.toFixed(1)
                        : 0,
                finalVolume:
                    mode === "withdraw"
                        ? bagVolume
                        : (bagVolume + volumeToAdd).toFixed(1),
                warning:
                    volumeToAdd > bagVolume * 0.5
            }
        });

        // eslint-disable-next-line
    }, [
        values.bagVolume,
        values.currentConc,
        values.targetConc,
        values.stockConc,
        values.mode
    ]);

    const selectedSolute = SOLUTES[values.solute];

    return (
        <div className="calc-container">

            {/* Solute Selector */}
            <div className="calc-box">
                <label className="calc-label">Select Solute</label>
                <select
                    value={values.solute}
                    onChange={(e) => setField("solute", e.target.value)}
                    className="calc-input"
                >
                    <option value="NaCl">NaCl</option>
                    <option value="KCl">KCl</option>
                    <option value="MgSO4">MgSO₄</option>
                    <option value="CaGluconate">Ca Gluconate</option>
                    <option value="NaHCO3">NaHCO₃</option>
                    <option value="Dextrose">Dextrose</option>
                    <option value="Labetalol">Labetalol</option>
                    <option value="Hydralazine">Hydralazine</option>
                    <option value="Custom">Any Solute</option>
                </select>
                {selectedSolute.note && (
                    <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                        {selectedSolute.note}
                    </span>
                )}
            </div>

            {/* Bag Volume */}
            <div className="calc-box">
                <label className="calc-label">Bag Volume (mL)</label>
                <input
                    type="number"
                    value={values.bagVolume}
                    onChange={(e) =>
                        setField("bagVolume", parseFloat(e.target.value) || "")
                    }
                    className="calc-input"
                />
            </div>

            {/* Current Concentration */}
            <div className="calc-box">
                <label className="calc-label">
                    Current Concentration {selectedSolute.unit && `(${selectedSolute.unit})`}
                </label>
                <input
                    type="number"
                    value={values.currentConc}
                    onChange={(e) =>
                        setField("currentConc", parseFloat(e.target.value) || 0)
                    }
                    className="calc-input"
                />
            </div>

            {/* Target */}
            <div className="calc-box">
                <label className="calc-label">
                    Target Concentration {selectedSolute.unit && `(${selectedSolute.unit})`}
                </label>
                <input
                    type="number"
                    value={values.targetConc}
                    onChange={(e) =>
                        setField("targetConc", parseFloat(e.target.value) || "")
                    }
                    className="calc-input"
                />
            </div>

            {/* Stock */}
            <div className="calc-box">
                <label className="calc-label">
                    Stock Concentration {selectedSolute.unit && `(${selectedSolute.unit})`}
                </label>
                <input
                    type="number"
                    value={values.stockConc}
                    onChange={(e) =>
                        setField("stockConc", parseFloat(e.target.value) || "")
                    }
                    className="calc-input"
                    disabled={values.solute !== "Custom"}
                />
            </div>

            {/* Mode */}
            <div className="calc-box">
                <label className="calc-label">Mode</label>
                <select
                    value={values.mode}
                    onChange={(e) => setField("mode", e.target.value)}
                    className="calc-input"
                >
                    <option value="withdraw">
                        Withdraw & Replace
                    </option>
                    <option value="add">
                        Add Only
                    </option>
                </select>
            </div>

            <button onClick={reset} className="calc-btn-reset">
                Reset Calculator
            </button>

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>

                    {values.mode === "withdraw" && (
                        <>
                            <p>
                                Withdraw <strong>{values.result.toWithdraw} mL</strong>
                            </p>
                            <p>
                                Add <strong>{values.result.toAdd} mL</strong> of stock solution
                            </p>
                        </>
                    )}

                    {values.mode === "add" && (
                        <p>
                            Add <strong>{values.result.toAdd} mL</strong> of stock solution
                        </p>
                    )}

                    <div style={{ marginTop: 12 }}>
                        <strong>Final Volume:</strong> {values.result.finalVolume} mL
                    </div>

                    {values.result.warning && (
                        <div
                            style={{
                                marginTop: 10,
                                padding: 8,
                                background: "#fff3cd",
                                borderRadius: 6,
                                fontSize: "0.85rem"
                            }}
                        >
                            ⚠️ Large additive volume. Confirm prescription.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}