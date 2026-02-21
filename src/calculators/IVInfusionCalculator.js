import { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  volume: "",
  time: "",
  timeUnit: "hours",
  setType: "iv",
  result: null,
};

export default function IVInfusionCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);
  const dropFactors = { iv: 20, blood: 15, soluset: 60 };

  useEffect(() => {
    const vol = Number(values.volume);
    const n = Number(values.time);
    const timeInMin = (Number.isFinite(n) && n > 0) ? (values.timeUnit === "hours" ? n * 60 : n) : null;
    const df = dropFactors[values.setType];

    if (!vol || !timeInMin || !df) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const dropsPerMin = Math.round((vol * df) / timeInMin);
    if (values.result !== dropsPerMin) updateFields({ result: dropsPerMin });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.volume, values.time, values.timeUnit, values.setType]);

  return (
    <div className="calc-container">
      <div className="calc-box">
        <label className="calc-label">Volume (mL):</label>
        <input className="calc-input" inputMode="decimal" value={values.volume} onChange={(e) => setField("volume", e.target.value)} placeholder="e.g. 500" />
      </div>
      <div className="calc-box">
        <label className="calc-label">Time:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input className="calc-input" inputMode="decimal" value={values.time} onChange={(e) => setField("time", e.target.value)} placeholder="e.g. 4" style={{ flex: 2 }} />
          <select className="calc-select" value={values.timeUnit} onChange={(e) => setField("timeUnit", e.target.value)} style={{ flex: 1 }}><option value="minutes">minutes</option><option value="hours">hours</option></select>
        </div>
      </div>
      <div className="calc-box">
        <label className="calc-label">Giving Set:</label>
        <select className="calc-select" value={values.setType} onChange={(e) => setField("setType", e.target.value)}><option value="iv">IV set (20 gtt/mL)</option><option value="blood">Blood set (15 gtt/mL)</option><option value="soluset">Soluset (60 gtt/mL)</option></select>
      </div>
      <button className="calc-btn-reset" onClick={reset}>Reset Calculator</button>
      {values.result !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}><strong>Drops/min:</strong> {values.result}</div>
      )}
    </div>
  );
}
