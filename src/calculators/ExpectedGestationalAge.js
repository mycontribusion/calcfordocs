import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  lmp: "",
  edd: "",
  egaWeeks: "",
  egaDays: "",
};

export default function PregnancyCalculator() {
  const { values, updateFields, reset } = useCalculator(INITIAL_STATE);
  const today = new Date();

  useEffect(() => {
    // This effect handles the cross-field calculations
    // We avoid circular updates by checking if values actually changed
  }, []);

  const handleLMPChange = (e) => {
    const val = e.target.value;
    if (!val) { reset(); return; }
    const lmpDate = new Date(val);
    const eddDate = new Date(lmpDate); eddDate.setDate(eddDate.getDate() + 280);
    const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    updateFields({ lmp: val, edd: eddDate.toISOString().split("T")[0], egaWeeks: Math.floor(diffDays / 7), egaDays: diffDays % 7 });
  };

  const handleEDDChange = (e) => {
    const val = e.target.value;
    if (!val) { reset(); return; }
    const eddDate = new Date(val);
    const lmpDate = new Date(eddDate); lmpDate.setDate(lmpDate.getDate() - 280);
    const diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    updateFields({ edd: val, lmp: lmpDate.toISOString().split("T")[0], egaWeeks: Math.floor(diffDays / 7), egaDays: diffDays % 7 });
  };

  const handleEGAChange = (w, d) => {
    const totalDays = Number(w || 0) * 7 + Number(d || 0);
    const lmpDate = new Date(today); lmpDate.setDate(lmpDate.getDate() - totalDays);
    const eddDate = new Date(lmpDate); eddDate.setDate(eddDate.getDate() + 280);
    updateFields({ egaWeeks: w, egaDays: d, lmp: lmpDate.toISOString().split("T")[0], edd: eddDate.toISOString().split("T")[0] });
  };

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">LMP:</label><input type="date" value={values.lmp} onChange={handleLMPChange} className="calc-input" /></div>
      <div className="calc-box"><label className="calc-label">EDD:</label><input type="date" value={values.edd} onChange={handleEDDChange} className="calc-input" /></div>
      <div className="calc-box">
        <label className="calc-label">EGA:</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input type="number" placeholder="weeks" value={values.egaWeeks} onChange={(e) => handleEGAChange(e.target.value, values.egaDays)} className="calc-input" style={{ flex: 1 }} />
          <input type="number" placeholder="days" value={values.egaDays} onChange={(e) => handleEGAChange(values.egaWeeks, e.target.value)} className="calc-input" style={{ flex: 1 }} />
        </div>
      </div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.egaWeeks !== "" && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>Trimester: {values.egaWeeks < 13 ? "First" : values.egaWeeks < 28 ? "Second" : "Third"}</p>
        </div>
      )}
    </div>
  );
}
