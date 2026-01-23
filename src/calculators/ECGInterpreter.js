import React, { useState, useEffect } from "react";

export default function ECGInterpreter() {
  const [wave, setWave] = useState("pWave");
  const [measurementType, setMeasurementType] = useState("duration");
  const [valueType, setValueType] = useState("seconds"); // for main wave
  const [numericalValue, setNumericalValue] = useState("");
  const [rrInterval, setRrInterval] = useState(""); // for QTc
  const [rrUnit, setRrUnit] = useState("seconds");
  const [result, setResult] = useState("");

  // Conversion factors
  const durationFactors = {
    milliseconds: 0.001,
    seconds: 1,
    smallSquares: 0.04,
    largeSquares: 0.2,
  };

  const voltageFactors = {
    millivolts: 1,
    smallSquares: 0.1,
    largeSquares: 0.5,
  };

  // Normal ranges (base units)
  const normalRanges = {
    duration: {
      pWave: [0.08, 0.12],
      prInterval: [0.12, 0.20],
      qrsWave: [0.06, 0.10],
      qtInterval: [0.36, 0.44],
      stSegment: [0.08, 0.12],
    },
    voltage: {
      pWave: [0.1, 0.3],
      qrsWave: [0.5, 2.0],
      tWave: [0.1, 0.3],
    },
  };

  // Main auto-calc function
  const calculate = () => {
    let val = parseFloat(numericalValue);
    if (isNaN(val) || val <= 0) {
      setResult("Please enter a valid numerical value.");
      return;
    }

    // Heart Rate
    if (wave === "heartRate") {
      let rrSeconds =
        valueType === "seconds"
          ? val
          : valueType === "milliseconds"
          ? val * 0.001
          : valueType === "smallSquares"
          ? val * 0.04
          : valueType === "largeSquares"
          ? val * 0.2
          : val;

      let hr = 60 / rrSeconds;
      let interpretation =
        hr < 60
          ? `Heart Rate: ${hr.toFixed(1)} bpm → Bradycardia`
          : hr > 100
          ? `Heart Rate: ${hr.toFixed(1)} bpm → Tachycardia`
          : `Heart Rate: ${hr.toFixed(1)} bpm → Normal`;
      setResult(interpretation);
      return;
    }

    // Duration or Voltage
    let factor =
      measurementType === "duration" ? durationFactors[valueType] : voltageFactors[valueType];
    let baseValue = val * factor;

    let range = normalRanges[measurementType][wave];
    if (!range) {
      setResult("No normal range defined for this measurement.");
      return;
    }

    let displayLow = range[0] / factor;
    let displayHigh = range[1] / factor;

    let interp =
      baseValue >= range[0] && baseValue <= range[1]
        ? `${wave.toUpperCase()} is Normal (${displayLow.toFixed(2)} - ${displayHigh.toFixed(2)} ${valueType})`
        : `${wave.toUpperCase()} is Abnormal (Normal: ${displayLow.toFixed(2)} - ${displayHigh.toFixed(2)} ${valueType})`;

    // QTc calculation
    if (wave === "qtInterval") {
      let rrVal = parseFloat(rrInterval);
      if (!isNaN(rrVal) && rrVal > 0) {
        let rrSeconds =
          rrUnit === "seconds"
            ? rrVal
            : rrUnit === "milliseconds"
            ? rrVal * 0.001
            : rrUnit === "smallSquares"
            ? rrVal * 0.04
            : rrUnit === "largeSquares"
            ? rrVal * 0.2
            : rrVal;

        let qtc = baseValue / Math.sqrt(rrSeconds); // Bazett formula
        interp += ` | QTc (Bazett): ${qtc.toFixed(2)} s → ${
          qtc >= 0.36 && qtc <= 0.44 ? "Normal" : "Abnormal"
        } (Formula: QTc = QT / √RR)`;
      } else {
        interp += " | QTc: Enter valid RR interval";
      }
    }

    setResult(interp);
  };

  // Auto-calc on any input change
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wave, measurementType, valueType, numericalValue, rrInterval, rrUnit]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8, marginBottom: "1rem", fontFamily: "Arial, sans-serif" }}>
      <h2>ECG Interpreter</h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Wave/Interval:</label><br />
        <select value={wave} onChange={(e) => setWave(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          <option value="pWave">P Wave</option>
          <option value="prInterval">PR Interval</option>
          <option value="qrsWave">QRS Complex</option>
          <option value="qtInterval">QT Interval</option>
          <option value="stSegment">ST Segment</option>
          <option value="tWave">T Wave</option>
          <option value="heartRate">RR Interval</option>
        </select>
      </div>

      {wave !== "heartRate" && (
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Measurement Type:</label><br />
          <select value={measurementType} onChange={(e) => setMeasurementType(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
            <option value="duration">Duration</option>
            <option value="voltage">Voltage</option>
          </select>
        </div>
      )}

      <div style={{ marginBottom: "0.5rem" }}>
        <label>Unit:</label><br />
        <select value={valueType} onChange={(e) => setValueType(e.target.value)} style={{ width: "100%", padding: "0.25rem" }}>
          {wave === "heartRate" || measurementType === "duration" ? (
            <>
              <option value="milliseconds">Milliseconds</option>
              <option value="seconds">Seconds</option>
              <option value="smallSquares">Small Squares</option>
              <option value="largeSquares">Large Squares</option>
            </>
          ) : (
            <>
              <option value="millivolts">Millivolts</option>
              <option value="smallSquares">Small Squares</option>
              <option value="largeSquares">Large Squares</option>
            </>
          )}
        </select>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <input type="number" placeholder="Enter value" value={numericalValue} onChange={(e) => setNumericalValue(e.target.value)} style={{ width: "100%", padding: "0.25rem" }} />
      </div>

      {/* RR interval for QTc */}
      {wave === "qtInterval" && (
        <div style={{ marginBottom: "0.5rem" }}>
          <label>RR Interval (for QTc):</label><br />
          <input
            type="number"
            placeholder="e.g., 0.8"
            value={rrInterval}
            onChange={(e) => setRrInterval(e.target.value)}
            style={{ width: "60%", padding: "0.25rem", marginRight: "0.5rem" }}
          />
          <select value={rrUnit} onChange={(e) => setRrUnit(e.target.value)} style={{ width: "35%", padding: "0.25rem" }}>
            <option value="milliseconds">Milliseconds</option>
            <option value="seconds">Seconds</option>
            <option value="smallSquares">Small Squares</option>
            <option value="largeSquares">Large Squares</option>
          </select>
        </div>
      )}

      {result && (
        <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{result}</p>
      )}
    </div>
  );
}
