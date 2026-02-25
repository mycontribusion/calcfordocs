import React, { useMemo, useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
    pregnancy: false,
    diabetesType: "type2",
    duration: "<10",
    treatment: "diet",
    hypo: "none",
    a1c: "<7.5",
    monitoring: "done",
    emergency: "none",
    macro: "none",
    egfr: ">60",
    microComp: "0",
    frailty: "normal",
    labor: "low",
    education: true,
    fastHours: "<16",
    // Global Sync Keys
    age: "",
    sex: "male",
};

export default function DAR2026RiskCalculator() {
    const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

    // Auto-sync logic
    useEffect(() => {
        const ageVal = parseFloat(values.age);
        const updates = {};

        if (!isNaN(ageVal) && ageVal >= 70 && values.frailty === "normal") {
            updates.frailty = "age70";
        }

        if (Object.keys(updates).length > 0) {
            updateFields(updates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.age, values.sex]);

    // --- 2. SCORING ENGINE ---
    const score = useMemo(() => {
        let total = 0;
        const {
            pregnancy, diabetesType, duration, treatment, hypo, a1c, monitoring,
            emergency, macro, egfr, microComp, frailty, labor,
            education, fastHours
        } = values;

        // 1. Pregnancy
        if (pregnancy) total += 6.5;

        // 2. Type
        if (diabetesType === "type1") total += 1;

        // 3. Duration
        if (duration === ">20") total += 1;
        if (duration === "10-20") total += 0.5;

        // 4. Treatment
        if (treatment === "mix_daily") total += 2;
        if (treatment === "mix_once" || treatment === "pump") total += 1.5;
        if (treatment === "basal" || treatment === "automated") total += 1;
        if (treatment === "short" || treatment === "ultra_long" || treatment === "gliben") total += 0.75;
        if (treatment === "modern_su") total += 0.5;
        if (treatment === "multiple_oral") total += 0.25;

        // 5. Hypoglycemia
        if (hypo === "impaired") total += 6.5;
        if (hypo === "severe") total += 5;
        if (hypo === "daily") total += 4;
        if (hypo === "6-7") total += 3;
        if (hypo === "3-5") total += 2;
        if (hypo === "1-2") total += 1;
        if (hypo === "<1") total += 0.5;

        // 6. A1c
        if (a1c === ">9") total += 1;
        if (a1c === "7.5-9") total += 0.5;

        // 7. Monitoring
        if (monitoring === "not") total += 2;
        if (monitoring === "suboptimal") total += 1;
        if (monitoring === "cgm") total -= 0.5;

        // 8. Emergencies
        if (emergency === "1m") total += 3.5;
        if (emergency === "3m") total += 2;
        if (emergency === "6m") total += 1;

        // 9. Macrovascular
        if (macro === "unstable") total += 6.5;
        if (macro === "stable") total += 2;

        // 10a. Renal
        if (egfr === "<30") total += 6.5;
        if (egfr === "30-45") total += 4;
        if (egfr === "45-60") total += 2;

        // 10b. Microvascular
        if (microComp === "3") total += 3;
        if (microComp === "2") total += 2;
        if (microComp === "1") total += 1;

        // 11. Frailty
        if (frailty === "impaired" || frailty === "advanced") total += 6.5;
        if (frailty === "moderate") total += 4;
        if (frailty === "age70") total += 1;

        // 12. Labor
        if (labor === "high") total += 4;
        if (labor === "moderate") total += 2;

        // 13. Education
        if (!education) total += 1;

        // 14. Fasting Hours
        if (fastHours === ">=16") total += 1;

        return total;
    }, [values]);

    // Risk Color Logic
    const getRiskLevel = (s) => {
        if (s <= 3) return { text: "LOW RISK", color: "#16a34a" }; // Green
        if (s <= 6) return { text: "MODERATE RISK", color: "#d97706" }; // Amber
        return { text: "HIGH RISK - DO NOT FAST", color: "#dc2626" }; // Red
    };

    const result = getRiskLevel(score);

    return (
        <div className="calc-container">
            <div className="ballard-grid">

                {/* 1. Pregnancy */}
                <div className="calc-box">
                    <label className="calc-label">1. Pregnancy with Diabetes</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                        <input type="checkbox" checked={values.pregnancy} onChange={e => setField("pregnancy", e.target.checked)} />
                        <span style={{ fontSize: "0.9rem" }}>Yes</span>
                    </div>
                </div>

                {/* 2. Type */}
                <div className="calc-box">
                    <label className="calc-label">2. Diabetes Type</label>
                    <select className="calc-select" value={values.diabetesType} onChange={e => setField("diabetesType", e.target.value)}>
                        <option value="type2">Type 2 / Other</option>
                        <option value="type1">Type 1 / LADA</option>
                    </select>
                </div>

                {/* 3. Duration */}
                <div className="calc-box">
                    <label className="calc-label">3. Duration of Diabetes</label>
                    <select className="calc-select" value={values.duration} onChange={e => setField("duration", e.target.value)}>
                        <option value="<10">&lt; 10 years</option>
                        <option value="10-20">10–20 years</option>
                        <option value=">20">&gt; 20 years</option>
                    </select>
                </div>

                {/* 4. Treatment */}
                <div className="calc-box">
                    <label className="calc-label">4. Treatment Type</label>
                    <select className="calc-select" value={values.treatment} onChange={e => setField("treatment", e.target.value)}>
                        <option value="diet">Nutrition / Metformin / SGLT2 / GLP1</option>
                        <option value="multiple_oral">≥2 Glucose lowering meds (non-insulin)</option>
                        <option value="modern_su">Modern SU (Gliclazide) / Repaglinide</option>
                        <option value="gliben">Glibenclamide / Glipizide</option>
                        <option value="short">Short acting insulin</option>
                        <option value="ultra_long">Ultra long-acting basal (Glargine 300)</option>
                        <option value="basal">Standard Basal (NPH, Lantus)</option>
                        <option value="automated">Automated insulin delivery</option>
                        <option value="pump">Open loop insulin pump</option>
                        <option value="mix_once">Once daily premixed insulin</option>
                        <option value="mix_daily">Multiple daily premixed injections</option>
                    </select>
                </div>

                {/* 5. Hypoglycemia */}
                <div className="calc-box">
                    <label className="calc-label">5. Hypoglycemia History</label>
                    <select className="calc-select" value={values.hypo} onChange={e => setField("hypo", e.target.value)}>
                        <option value="none">None / No recent</option>
                        <option value="<1">&lt; 1 time per week</option>
                        <option value="1-2">1–2 times/week</option>
                        <option value="3-5">3–5 times/week</option>
                        <option value="6-7">6–7 times/week</option>
                        <option value="daily">More than once daily</option>
                        <option value="severe">Severe in last 4 weeks</option>
                        <option value="impaired">Impaired awareness</option>
                    </select>
                </div>

                {/* 6. HbA1c */}
                <div className="calc-box">
                    <label className="calc-label">6. HbA1c Level</label>
                    <select className="calc-select" value={values.a1c} onChange={e => setField("a1c", e.target.value)}>
                        <option value="<7.5">&lt; 7.5% (&lt;58 mmol)</option>
                        <option value="7.5-9">7.5 – 9% (58-75 mmol)</option>
                        <option value=">9">&gt; 9% (&gt;75 mmol)</option>
                    </select>
                </div>

                {/* 7. Monitoring */}
                <div className="calc-box">
                    <label className="calc-label">7. Glucose Monitoring</label>
                    <select className="calc-select" value={values.monitoring} onChange={e => setField("monitoring", e.target.value)}>
                        <option value="cgm">Using CGM (Sensor)</option>
                        <option value="done">Done as indicated</option>
                        <option value="suboptimal">Suboptimally done</option>
                        <option value="not">Not done</option>
                    </select>
                </div>

                {/* 8. Emergencies */}
                <div className="calc-box">
                    <label className="calc-label">8. DKA/HHS History</label>
                    <select className="calc-select" value={values.emergency} onChange={e => setField("emergency", e.target.value)}>
                        <option value="none">None in last 6 months</option>
                        <option value="6m">Last 4-6 months</option>
                        <option value="3m">Last 2-3 months</option>
                        <option value="1m">In the last month</option>
                    </select>
                </div>

                {/* 9. Macrovascular */}
                <div className="calc-box">
                    <label className="calc-label">9. Macrovascular Disease</label>
                    <select className="calc-select" value={values.macro} onChange={e => setField("macro", e.target.value)}>
                        <option value="none">No history</option>
                        <option value="stable">Stable (Heart disease/Stroke)</option>
                        <option value="unstable">Unstable (Recent event/Angina)</option>
                    </select>
                </div>

                {/* 10a. eGFR */}
                <div className="calc-box">
                    <label className="calc-label">10a. DM Nephropathy (eGFR)</label>
                    <select className="calc-select" value={values.egfr} onChange={e => setField("egfr", e.target.value)}>
                        <option value=">60">&gt; 60 mL/min</option>
                        <option value="45-60">45 – 60 mL/min</option>
                        <option value="30-45">30 – 45 mL/min</option>
                        <option value="<30">&lt; 30 mL/min</option>
                    </select>
                </div>

                {/* 10b. Microvascular */}
                <div className="calc-box">
                    <label className="calc-label">10b. Other Microvascular Disease</label>
                    <select className="calc-select" value={values.microComp} onChange={e => setField("microComp", e.target.value)}>
                        <option value="0">0 complications</option>
                        <option value="1">1 complication</option>
                        <option value="2">2 complications</option>
                        <option value="3">3 complications</option>
                    </select>
                </div>

                {/* 11. Frailty */}
                <div className="calc-box">
                    <label className="calc-label">11. Cognitive / Frailty</label>
                    <select className="calc-select" value={values.frailty} onChange={e => setField("frailty", e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="age70">Age &gt;70 (no home support)</option>
                        <option value="moderate">Mild to Moderate Frailty</option>
                        <option value="advanced">Advanced Frailty / Impaired Cognitive</option>
                    </select>
                </div>

                {/* 12. Labor */}
                <div className="calc-box">
                    <label className="calc-label">12. Physical Labor</label>
                    <select className="calc-select" value={values.labor} onChange={e => setField("labor", e.target.value)}>
                        <option value="low">Low intensity</option>
                        <option value="moderate">Moderate intensity</option>
                        <option value="high">High intensity</option>
                    </select>
                </div>

                {/* 13. Education */}
                <div className="calc-box">
                    <label className="calc-label">13. Fasting Focused Education</label>
                    <select className="calc-select" value={values.education} onChange={e => setField("education", e.target.value === "true")}>
                        <option value="true">Yes, received education</option>
                        <option value="false">No</option>
                    </select>
                </div>

                {/* 14. Fasting Hours */}
                <div className="calc-box" style={{ gridColumn: "span 2" }}>
                    <label className="calc-label">14. Fasting Hours</label>
                    <select className="calc-select" value={values.fastHours} onChange={e => setField("fastHours", e.target.value)}>
                        <option value="<16">&lt; 16 hours</option>
                        <option value=">=16">≥ 16 hours</option>
                    </select>
                </div>

            </div>

            {/* SCORE DISPLAY */}
            <div
                className="calc-result"
                style={{
                    borderColor: result.color,
                    color: result.color,
                    backgroundColor: result.color + '15', // Adds slight transparency
                    borderStyle: "solid",
                    marginTop: "16px"
                }}
            >
                <p style={{ margin: "0 0 4px", fontSize: "0.85rem", opacity: 0.8 }}>Total Risk Score</p>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {score.toFixed(1)}
                </div>
                <div style={{ fontWeight: "600", marginTop: "4px" }}>
                    {result.text}
                </div>
                <p style={{ margin: "8px 0 0", fontSize: "0.85rem" }}>
                    {score > 6
                        ? "Fasting is likely unsafe. Medical supervision required."
                        : "Fasting may be permissible with medication adjustment."}
                </p>
            </div>
            <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
        </div>
    );
}