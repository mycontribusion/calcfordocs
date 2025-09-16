// src/calculators/ECGInterpreter.js
import { useState } from "react";

export default function ECGInterpreter() {
  const [wave, setWave] = useState("pWave");
  const [measurementType, setMeasurementType] = useState("duration");
  const [valueType, setValueType] = useState("seconds");
  const [numericalValue, setNumericalValue] = useState("");
  const [result, setResult] = useState("");

  // Conversion factors
  const durationFactors = {
    seconds: 1,
    smallSquares: 1 / 0.04, // 1 sec = 25 small squares
    largeSquares: 1 / 0.2,  // 1 sec = 5 large squares
  };

  const voltageFactors = {
    millivolts: 1,
    smallSquares: 1 / 0.1, // 1 small square = 0.1 mV
    largeSquares: 1 / 0.5, // 1 large square = 0.5 mV
  };

  // Normal ranges in SECONDS or MILLIVOLTS
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

  function interpretECG() {
    let val = parseFloat(numericalValue);
    if (isNaN(val) || val <= 0) {
      setResult("Please enter a valid numerical value.");
      return;
    }

    if (wave === "heartRate") {
      // Heart Rate Calculation
      let rrSeconds =
        valueType === "seconds"
          ? val
          : valueType === "smallSquares"
          ? val * 0.04
          : val * 0.2;

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

    // For durations or voltages
    let factor =
      measurementType === "duration"
        ? durationFactors[valueType]
        : voltageFactors[valueType];

    // Convert input to base unit (sec or mV)
    let baseValue = val / factor;

    let range = normalRanges[measurementType][wave];
    if (!range) {
      setResult("No normal range defined for this measurement.");
      return;
    }

    // Convert normal range into selected unit
    let displayLow = range[0] * factor;
    let displayHigh = range[1] * factor;

    let interpretation =
      baseValue >= range[0] && baseValue <= range[1]
        ? `${wave.toUpperCase()} is Normal (${displayLow.toFixed(
            2
          )} - ${displayHigh.toFixed(2)} ${valueType})`
        : `${wave.toUpperCase()} is Abnormal (Normal: ${displayLow.toFixed(
            2
          )} - ${displayHigh.toFixed(2)} ${valueType})`;

    setResult(interpretation);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">ECG Interpreter</h2>

      <div className="mb-2">
        <label className="mr-2">Wave/Interval:</label>
        <select
          value={wave}
          onChange={(e) => setWave(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="pWave">P Wave</option>
          <option value="prInterval">PR Interval</option>
          <option value="qrsWave">QRS Complex</option>
          <option value="qtInterval">QT Interval</option>
          <option value="stSegment">ST Segment</option>
          <option value="tWave">T Wave</option>
          <option value="heartRate">Heart Rate (RR Interval)</option>
        </select>
      </div>

      {wave !== "heartRate" && (
        <div className="mb-2">
          <p></p>
          <label className="mr-2">Measurement Type:</label>
          <select
            value={measurementType}
            onChange={(e) => setMeasurementType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="duration">Duration</option>
            <option value="voltage">Voltage</option>
          </select>
        </div>
      )}

      <div className="mb-2">
        <p></p>
        <label className="mr-2">Unit:</label>
        <select
          value={valueType}
          onChange={(e) => setValueType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {wave === "heartRate" || measurementType === "duration" ? (
            <>
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

      <div className="mb-2">
        <p></p>
        <input
          type="number"
          placeholder="Enter value"
          value={numericalValue}
          onChange={(e) => setNumericalValue(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
      <p></p>

      <button
        onClick={interpretECG}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Interpret
      </button>

      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
    </div>
  );
}
