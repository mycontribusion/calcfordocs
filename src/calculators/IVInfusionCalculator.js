import { useState, useEffect } from "react";
import "./CalculatorShared.css";

export default function IVInfusionCalculator() {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState("hours");
  const [setType, setSetType] = useState("iv");
  const [result, setResult] = useState(null);

  // Drop factors (constant, does not change)
  const dropFactors = {
    iv: 20,
    blood: 15,
    soluset: 60,
  };

  // Convert time to minutes
  function convertTimeToMinutes(value, unit) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;
    return unit === "hours" ? n * 60 : n;
  }

  // 🔄 AUTO CALCULATION
  useEffect(() => {
    setResult(null);

    const vol = Number(volume);
    const timeInMin = convertTimeToMinutes(time, timeUnit);
    const df = dropFactors[setType];

    if (!vol || !timeInMin || !df) return;

    const dropsPerMin = (vol * df) / timeInMin;
    setResult(Math.round(dropsPerMin));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, time, timeUnit, setType]); // dropFactors is constant, so safe to exclude

  // Reset all fields
  function handleReset() {
    setVolume("");
    setTime("");
    setTimeUnit("hours");
    setSetType("iv");
    setResult(null);
  }

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Volume (mL):</label>
        <input
          className="calc-input"
          inputMode="decimal"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          placeholder="e.g. 500"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">Time:</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className="calc-input"
            inputMode="decimal"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 4"
            style={{ flex: 2 }}
          />
          <select
            className="calc-select"
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Giving Set:</label>
        <select
          className="calc-select"
          value={setType}
          onChange={(e) => setSetType(e.target.value)}
        >
          <option value="iv">IV set (20 gtt/mL)</option>
          <option value="blood">Blood set (15 gtt/mL)</option>
          <option value="soluset">Soluset (60 gtt/mL)</option>
        </select>
      </div>

      <button className="calc-btn-reset" onClick={handleReset}>
        Reset
      </button>

      {result !== null && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <strong>Drops/min:</strong> {result}
        </div>
      )}
    </div>
  );
}
