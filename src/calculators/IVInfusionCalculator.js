import { useState, useEffect } from "react";

export default function IVInfusionCalculator() {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState("hours");
  const [setType, setSetType] = useState("iv");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const dropFactors = {
    iv: 20,
    blood: 15,
    soluset: 60,
  };

  function convertTimeToMinutes(value, unit) {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;
    return unit === "hours" ? n * 60 : n;
  }

  // 🔄 AUTO CALCULATION
  useEffect(() => {
    setError("");
    setResult(null);

    const vol = Number(volume);
    const timeInMin = convertTimeToMinutes(time, timeUnit);
    const df = dropFactors[setType];

    if (!vol || !timeInMin || !df) return;

    const dropsPerMin = (vol * df) / timeInMin;
    setResult(Math.round(dropsPerMin));
  }, [volume, time, timeUnit, setType]);

  function handleReset() {
    setVolume("");
    setTime("");
    setTimeUnit("hours");
    setSetType("iv");
    setResult(null);
    setError("");
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

      <p></p><label className="label">Time:</label><br />
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
      </div><p></p>

      <label className="label">Giving Set:</label><br />
      <select
        className="select-field"
        value={setType}
        onChange={(e) => setSetType(e.target.value)}
      >
        <option value="iv">IV set (20 gtt/mL)</option>
        <option value="blood">Blood set (15 gtt/mL)</option>
        <option value="soluset">Soluset (60 gtt/mL)</option>
      </select><p></p>

      <div className="actions">
        <button className="button secondary" onClick={handleReset}>
          Reset
        </button>
      </div><p></p>

      {result !== null && (
        <div className="result-box success">
          <strong>Drops/min:</strong> {result}
        </div>
      )}
    </div>
  );
}
