import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  wave: "pWave",
  measurementType: "duration",
  valueType: "seconds",
  numericalValue: "",
  rrInterval: "",
  rrUnit: "seconds",
  result: "",
};

export default function ECGInterpreter() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

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

  // Main calc logic inside useMemo or useEffect
  useEffect(() => {
    const { wave, measurementType, valueType, numericalValue, rrInterval, rrUnit } = values;
    let val = parseFloat(numericalValue);
    if (isNaN(val) || val <= 0) {
      updateFields({ result: numericalValue ? "Please enter a valid numerical value." : "" });
      return;
    }

    let finalInterp = "";

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
      finalInterp =
        hr < 60
          ? `Heart Rate: ${hr.toFixed(1)} bpm → Bradycardia`
          : hr > 100
            ? `Heart Rate: ${hr.toFixed(1)} bpm → Tachycardia`
            : `Heart Rate: ${hr.toFixed(1)} bpm → Normal`;
    } else {
      // Duration or Voltage
      let factor =
        measurementType === "duration" ? durationFactors[valueType] : voltageFactors[valueType];
      let baseValue = val * factor;

      let range = normalRanges[measurementType][wave];
      if (!range) {
        finalInterp = "No normal range defined for this measurement.";
      } else {
        let displayLow = range[0] / factor;
        let displayHigh = range[1] / factor;

        finalInterp =
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
            finalInterp += ` | QTc (Bazett): ${qtc.toFixed(2)} s → ${qtc >= 0.36 && qtc <= 0.44 ? "Normal" : "Abnormal"
              } (Formula: QTc = QT / √RR)`;
          } else {
            finalInterp += " | QTc: Enter valid RR interval";
          }
        }
      }
    }

    if (finalInterp !== values.result) {
      updateFields({ result: finalInterp });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.wave, values.measurementType, values.valueType, values.numericalValue, values.rrInterval, values.rrUnit]);

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Wave/Interval:</label>
        <select value={values.wave} onChange={(e) => setField("wave", e.target.value)} className="calc-select">
          <option value="pWave">P Wave</option>
          <option value="prInterval">PR Interval</option>
          <option value="qrsWave">QRS Complex</option>
          <option value="qtInterval">QT Interval</option>
          <option value="stSegment">ST Segment</option>
          <option value="tWave">T Wave</option>
          <option value="heartRate">RR Interval</option>
        </select>
      </div>

      {values.wave !== "heartRate" && (
        <div className="calc-box">
          <label className="calc-label">Measurement Type:</label>
          <select value={values.measurementType} onChange={(e) => setField("measurementType", e.target.value)} className="calc-select">
            <option value="duration">Duration</option>
            <option value="voltage">Voltage</option>
          </select>
        </div>
      )}

      <div className="calc-box">
        <label className="calc-label">Unit:</label>
        <select value={values.valueType} onChange={(e) => setField("valueType", e.target.value)} className="calc-select">
          {values.wave === "heartRate" || values.measurementType === "duration" ? (
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

      <div className="calc-box">
        <input type="number" placeholder="Enter value" value={values.numericalValue} onChange={(e) => setField("numericalValue", e.target.value)} className="calc-input" />
      </div>

      {/* RR interval for QTc */}
      {values.wave === "qtInterval" && (
        <div className="calc-box">
          <label className="calc-label">RR Interval (for QTc):</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              placeholder="e.g., 0.8"
              value={values.rrInterval}
              onChange={(e) => setField("rrInterval", e.target.value)}
              className="calc-input"
              style={{ flex: 2 }}
            />
            <select value={values.rrUnit} onChange={(e) => setField("rrUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}>
              <option value="milliseconds">Milliseconds</option>
              <option value="seconds">Seconds</option>
              <option value="smallSquares">Small Squares</option>
              <option value="largeSquares">Large Squares</option>
            </select>
          </div>
        </div>
      )}

      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          {values.result}
        </div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}
