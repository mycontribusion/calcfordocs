import { useEffect } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    // Global sync keys
    weight: "",
    // Local state
    dryWeight: "",
    duration: "", // Hours
    intakeVolume: "", // mL
    isFirstHD: false,
    heparinFree: false,
    result: null,
};

export default function DialysisPrescription() {
    const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalculator(INITIAL_STATE);

    useEffect(() => {
        const preWeight = parseFloat(values.weight);
        const targetWeight = parseFloat(values.dryWeight);
        const hours = parseFloat(values.duration);
        const intake = parseFloat(values.intakeVolume) || 0; // Default to 0 if empty/invalid

        // Basic validation before calculating
        if (
            !Number.isFinite(preWeight) || !Number.isFinite(targetWeight) || !Number.isFinite(hours) ||
            preWeight <= 0 || targetWeight <= 0 || hours <= 0 || preWeight <= targetWeight
        ) {
            if (values.result !== null) updateFields({ result: null });
            return;
        }

        // Volume to Remove (Liters)
        const weightDiffKg = preWeight - targetWeight;
        const intakeLiters = intake / 1000;
        const totalVolumeToRemove = weightDiffKg + intakeLiters;

        // Hourly UF Rate (mL/hr)
        const hourlyUFRate = (totalVolumeToRemove * 1000) / hours;

        // UF Rate per kg of dry weight (mL/kg/hr)
        const ufRatePerKg = hourlyUFRate / targetWeight;

        let interpretation = "";
        let suggests = "";
        let color = "#16a34a"; // Green by default

        if (ufRatePerKg > 13) {
            interpretation = "High UF Rate (>13 mL/kg/hr)";
            suggests = "Warning: Exceeds safe threshold. Associated with increased mortality and intradialytic hypotension. Consider extending treatment time or adding an extra session.";
            color = "#dc2626"; // Red
        } else if (ufRatePerKg > 10) {
            interpretation = "Moderate/Elevated UF Rate (10-13 mL/kg/hr)";
            suggests = "Monitor closely for cramping or hypotension.";
            color = "#d97706"; // Orange/Amber
        } else {
            interpretation = "Safe UF Rate (<10 mL/kg/hr)";
            suggests = "Within commonly accepted safe parameters.";
        }

        let clinicalConsiderations = [];

        if (values.isFirstHD) {
            clinicalConsiderations.push(
                "First-time HD: Recommend max duration of 2–2.5 hours and slower blood flow rate (Qb ~150–200 mL/min) to prevent Dialysis Disequilibrium Syndrome (DDS)."
            );
        }

        if (values.heparinFree) {
            clinicalConsiderations.push(
                "Heparin-Free Protocol: Indicated for high bleeding risk. Consider regular saline flushes (e.g., 100-200 mL every 15–30 mins). Remember to add flush volumes to Intradialytic Intake."
            );
        }

        updateFields({
            result: {
                totalVolume: totalVolumeToRemove.toFixed(2),
                hourlyRate: Math.round(hourlyUFRate),
                perKgRate: ufRatePerKg.toFixed(1),
                interpretation,
                suggests,
                color,
                clinicalConsiderations
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.weight, values.dryWeight, values.duration, values.intakeVolume]);

    return (
        <div className="calc-container">
            <h3 style={{ textAlign: "center", marginBottom: 16 }}>Ultrafiltration Goal Calculator</h3>

            <div className="calc-box">
                <label className="calc-label">Pre-Dialysis Weight (kg):</label>
                <SyncSuggestion field="weight" suggestion={suggestions.weight} onSync={syncField} />
                <input
                    type="number"
                    value={values.weight}
                    onChange={(e) => setField("weight", e.target.value)}
                    className="calc-input"
                    placeholder="e.g. 72.5"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Target / Dry Weight (kg):</label>
                <input
                    type="number"
                    value={values.dryWeight}
                    onChange={(e) => setField("dryWeight", e.target.value)}
                    className="calc-input"
                    placeholder="e.g. 70.0"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Treatment Time (Hours):</label>
                <input
                    type="number"
                    value={values.duration}
                    onChange={(e) => setField("duration", e.target.value)}
                    className="calc-input"
                    placeholder="e.g. 4"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Intradialytic Intake / Flushes (mL):</label>
                <input
                    type="number"
                    value={values.intakeVolume}
                    onChange={(e) => setField("intakeVolume", e.target.value)}
                    className="calc-input"
                    placeholder="e.g. 250 (Optional)"
                />
            </div>

            <div className="calc-box">
                <label className="calc-label">Clinical Considerations:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                            type="checkbox"
                            checked={values.isFirstHD}
                            onChange={(e) => setField("isFirstHD", e.target.checked)}
                            style={{ marginRight: 8 }}
                        />
                        First-time Hemodialysis
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                            type="checkbox"
                            checked={values.heparinFree}
                            onChange={(e) => setField("heparinFree", e.target.checked)}
                            style={{ marginRight: 8 }}
                        />
                        Indication for Heparin-Free Dialysis
                    </label>
                </div>
            </div>

            <button onClick={reset} className="calc-btn-reset">
                Reset Calculator
            </button>

            {values.result && (
                <div className="calc-result" style={{ marginTop: 16 }}>
                    <p><strong>Total Volume to Remove:</strong> {values.result.totalVolume} L</p>
                    <p style={{ marginTop: 4 }}><strong>Hourly UF Rate:</strong> {values.result.hourlyRate} mL/hr</p>
                    <p style={{ marginTop: 4, fontWeight: "bold", fontSize: "1.05rem" }}>
                        UF Rate per kg: {values.result.perKgRate} mL/kg/hr
                    </p>

                    <p style={{ marginTop: 8, color: values.result.color, fontWeight: 500 }}>
                        {values.result.interpretation}
                    </p>

                    {values.result.clinicalConsiderations.length > 0 && (
                        <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: "#fef3c7", borderLeft: "4px solid #f59e0b", borderRadius: 4 }}>
                            <strong>Clinical Reminders:</strong>
                            <ul style={{ margin: "4px 0 0 0", paddingLeft: 16, fontSize: "0.9rem", color: "#92400e" }}>
                                {values.result.clinicalConsiderations.map((note, idx) => (
                                    <li key={idx} style={{ marginBottom: 4 }}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem' }}>
                        <p style={{ color: '#0056b3', marginTop: 4, fontWeight: 500 }}>{values.result.suggests}</p>
                        <br />
                        <strong>Safety Guidelines:</strong>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', opacity: 0.8 }}>
                            <li>• Maximum safe UF rate is typically &lt; 10 - 13 mL/kg/hr.</li>
                            <li>• Rates &gt; 13 mL/kg/hr are independently associated with higher mortality.</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
