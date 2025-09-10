import { useState } from "react";
//import "./IVInfusionCalculator.css";

export default function IVInfusionCalculator() {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState("minutes"); // default
  const [setType, setSetType] = useState("iv"); // default IV giving set
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // mapping set type to drop factor
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

  function handleCalculate(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const vol = Number(volume);
    const timeInMin = convertTimeToMinutes(time, timeUnit);
    const df = dropFactors[setType];

    if (!vol || !timeInMin || !df) {
      setError("Enter valid values.");
      return;
    }

    const dropsPerMin = (vol * df) / timeInMin;
    setResult(Math.round(dropsPerMin));
  }

  function handleReset() {
    setVolume("");
    setTime("");
    setTimeUnit("minutes");
    setSetType("iv");
    setResult(null);
    setError("");
  }

  return (
    <div className="iv-card">
      <h2 className="iv-title">IV Infusion Drop Rate Calculator</h2>

      <form className="iv-form" onSubmit={handleCalculate}>
        <label className="label">Volume (mL)</label>
        <input
          className="input-field"
          inputMode="decimal"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          placeholder="e.g., 500"
        />

        <label className="label">Time</label>
        <div className="flex-container">
          <input
            className="input-field flex-grow"
            inputMode="decimal"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g., 4"
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

        <label className="label">Giving Set Type</label>
        <select
          className="select-field"
          value={setType}
          onChange={(e) => setSetType(e.target.value)}
        >
          <option value="iv">IV giving set (20 gtt/mL)</option>
          <option value="blood">Blood giving set (15 gtt/mL)</option>
          <option value="soluset">Soluset (60 gtt/mL)</option>
        </select>

        <div className="actions">
          <button type="submit" className="button">Calculate</button>
          <button type="button" className="button secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {error && <div className="result-box danger">{error}</div>}

      {result !== null && (
        <div className="result-box success">
          <strong>Drops/min:</strong> {result}
        </div>
      )}
    </div>
  );
}
