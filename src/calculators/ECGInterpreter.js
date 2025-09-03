// src/calculators/ECGInterpreter.js
import { useState } from "react";

export default function ECGInterpreter() {
  const [wave, setWave] = useState("pWave");
  const [measurementType, setMeasurementType] = useState("duration");
  const [valueType, setValueType] = useState("seconds");
  const [numericalValue, setNumericalValue] = useState("");
  const [result, setResult] = useState("");

  function interpretECG() {
    let val = parseFloat(numericalValue);

    if (isNaN(val) || val <= 0) {
      setResult("Please enter a valid numerical value.");
      return;
    }

    // Convert small & large squares
    if (valueType === "smallSquares") {
      if (measurementType === "duration") val *= 0.04;
      if (measurementType === "voltage") val *= 0.1;
    }
    if (valueType === "largeSquares") {
      if (measurementType === "duration") val *= 0.20;
      if (measurementType === "voltage") val *= 0.5;
    }

    let interpretation = "";

    if (measurementType === "duration") {
      if (wave === "pWave") {
        interpretation =
          val >= 0.08 && val <= 0.12
            ? `P Wave Duration: Normal (0.08 - 0.12 sec)`
            : "P Wave Duration: Abnormal";
      } else if (wave === "qrsWave") {
        interpretation =
          val >= 0.06 && val <= 0.10
            ? `QRS Duration: Normal (0.06 - 0.10 sec)`
            : "QRS Duration: Abnormal";
      } else if (wave === "qtInterval") {
        interpretation =
          val >= 0.36 && val <= 0.44
            ? `QT Interval: Normal (0.36 - 0.44 sec)`
            : "QT Interval: Abnormal";
      }
    } else if (measurementType === "voltage") {
      if (wave === "pWave") {
        interpretation =
          val >= 0.1 && val <= 0.3
            ? `P Wave Amplitude: Normal (0.1 - 0.3 mV)`
            : "P Wave Amplitude: Abnormal";
      } else if (wave === "qrsWave") {
        interpretation =
          val >= 0.5 && val <= 2.0
            ? `QRS Amplitude: Normal (0.5 - 2.0 mV)`
            : "QRS Amplitude: Abnormal";
      } else if (wave === "tWave") {
        interpretation =
          val >= 0.1 && val <= 0.3
            ? `T Wave Amplitude: Normal (0.1 - 0.3 mV)`
            : "T Wave Amplitude: Abnormal";
      }
    }

    setResult(interpretation);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">ECG Interpreter</h2>

      <div className="mb-2">
        <label className="mr-2">Wave:</label>
        <select
          value={wave}
          onChange={(e) => setWave(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="pWave">P Wave</option>
          <option value="qrsWave">QRS Complex</option>
          <option value="tWave">T Wave</option>
          <option value="qtInterval">QT Interval</option>
        </select>
      </div>

      <div className="mb-2">
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

      <div className="mb-2">
        <label className="mr-2">Unit:</label>
        <select
          value={valueType}
          onChange={(e) => setValueType(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {measurementType === "duration" ? (
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
        <input
          type="number"
          placeholder="Enter value"
          value={numericalValue}
          onChange={(e) => setNumericalValue(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

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
