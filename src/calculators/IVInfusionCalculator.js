import { useState, useEffect } from "react";

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
    <div className="iv-card">
      <h2 className="iv-title">IV Infusion Drop Rate</h2>

      <label className="label">Volume (mL):</label><br />
      <input
        className="input-field"
        inputMode="decimal"
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
        placeholder="e.g. 500"
      />

      <p></p>
      <label className="label">Time:</label><br />
      <div className="flex-container">
        <input
          className="input-field flex-grow"
          inputMode="decimal"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 4"
        />
        <select
          className="select-field"
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value)}
        >
          <option value="minutes">minutes</option>
          <option value="hours">hours</option>
        </select>
      </div>
      <p></p>

      <label className="label">Giving Set:</label><br />
      <select
        className="select-field"
        value={setType}
        onChange={(e) => setSetType(e.target.value)}
      >
        <option value="iv">IV set (20 gtt/mL)</option>
        <option value="blood">Blood set (15 gtt/mL)</option>
        <option value="soluset">Soluset (60 gtt/mL)</option>
      </select>
      <p></p>

      <div className="actions">
        <button className="button secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
      <p></p>

      {result !== null && (
        <div className="result-box success">
          <strong>Drops/min:</strong> {result}
        </div>
      )}
    </div>
  );
}
