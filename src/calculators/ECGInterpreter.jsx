import React, { useEffect } from "react";
import { useCalc, ResetButton, SelectField, FormulaBox } from "./CalcFields";

const INITIAL_STATE = {
  wave: "unitConversion",
  measurementType: "duration",
  valueType: "seconds",
  numericalValue: "",
  rrInterval: "",
  rrUnit: "seconds",
  result: "",
  resultData: null,
};

// Units are only valid for one measurement type — switching type resets the unit
// so the calculator never ends up with e.g. "millivolts" for a duration.
const UNITS_BY_TYPE = {
  duration: [
    { value: "milliseconds", label: "Milliseconds" },
    { value: "seconds", label: "Seconds" },
    { value: "smallSquares", label: "Small Squares" },
    { value: "largeSquares", label: "Large Squares" },
  ],
  voltage: [
    { value: "millivolts", label: "Millivolts" },
    { value: "smallSquares", label: "Small Squares" },
    { value: "largeSquares", label: "Large Squares" },
  ],
};

const VALID_UNITS = {
  duration: UNITS_BY_TYPE.duration.map((u) => u.value),
  voltage: UNITS_BY_TYPE.voltage.map((u) => u.value),
};

// Conversion factors (to base unit: seconds for duration, millivolts for voltage)
const DURATION_FACTORS = {
  milliseconds: 0.001,
  seconds: 1,
  smallSquares: 0.04,
  largeSquares: 0.2,
};

const VOLTAGE_FACTORS = {
  millivolts: 1,
  smallSquares: 0.1,
  largeSquares: 0.5,
};

const WAVE_OPTIONS = [
  { value: "unitConversion", label: "Unit Conversion" },
  { value: "pWave", label: "P Wave" },
  { value: "prInterval", label: "PR Interval" },
  { value: "qrsWave", label: "QRS Complex" },
  { value: "qtInterval", label: "QT Interval" },
  { value: "stSegment", label: "ST Segment" },
  { value: "tWave", label: "T Wave" },
  { value: "heartRate", label: "RR Interval" },
];

// Guide text: where each wave/interval is measured from → to
const WAVE_GUIDES = {
  unitConversion: "Convert between duration and voltage units.",
  pWave: "From start of P wave to end of P wave",
  prInterval: "From start of P wave to start of QRS complex",
  qrsWave: "From start of Q wave to end of S wave",
  qtInterval: "From start of Q wave to end of T wave",
  stSegment: "From end of S wave (J point) to start of T wave",
  tWave: "From start of T wave to end of T wave",
  heartRate: "From one R wave to the next R wave",
};

// Voltage reference guide (for the FormulaBox)
const VOLTAGE_GUIDE = {
  pWave: "P Wave: < 2.5 mm (limb), < 1.5 mm (chest)",
  qrsWave: "QRS Complex: ≥ 5 mm (limb), ≥ 10 mm (chest); < LVH limits",
};

function formatConverted(value) {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.001 || abs >= 10000)) return value.toExponential(4);
  return parseFloat(value.toFixed(4)).toString();
}

// Wrap status keywords (Normal / Abnormal / Bradycardia / Tachycardia)
// with red/green status classes so the entire ECG result is color-coded.
function colorizeResult(text) {
  if (!text) return text;
  return text
    .split("\n")
    .map((line) => {
      const parts = line.split(/(\([^)]*\)|≤[^)]*)/);
      return parts
        .map((part, j) => {
          if (/^\(.*\)$/.test(part) || /^≤/.test(part)) {
            return `<span class="calc-result-range">${part}</span>`;
          }
          return part
            .replace(/\bNormal\b/g, '<span class="calc-status-normal">Normal</span>')
            .replace(/\bAbnormal\b/g, '<span class="calc-status-abnormal">Abnormal</span>')
            .replace(/\bBradycardia\b/g, '<span class="calc-status-abnormal">Bradycardia</span>')
            .replace(/\bTachycardia\b/g, '<span class="calc-status-abnormal">Tachycardia</span>');
        })
        .join("");
    })
    .join("\n");
}

export default function ECGInterpreter() {
  const { values, updateField: setField, updateFields, reset } = useCalc(INITIAL_STATE);

  // Unit conversion, heart rate, and PR interval use duration units only.
  const unitType =
    values.wave === "heartRate" || values.wave === "unitConversion" || values.wave === "prInterval"
      ? "duration"
      : values.measurementType;
  const unitOptions = UNITS_BY_TYPE[unitType];
  const factors = unitType === "duration" ? DURATION_FACTORS : VOLTAGE_FACTORS;

  // Keep the selected unit valid for the current measurement type.
  useEffect(() => {
    if (!VALID_UNITS[unitType].includes(values.valueType)) {
      setField("valueType", unitType === "voltage" ? "millivolts" : "seconds");
    }
  }, [unitType, values.valueType, setField]);

  // PR interval is duration-only — force measurement type back to duration.
  useEffect(() => {
    if (values.wave === "prInterval" && values.measurementType !== "duration") {
      setField("measurementType", "duration");
    }
  }, [values.wave, values.measurementType, setField]);

  // Normal ranges (base units: seconds for duration, millivolts for voltage)
  const normalRanges = {
    duration: {
      pWave: [0, 0.12],
      prInterval: [0.12, 0.20],
      qrsWave: [0.06, 0.10],
      qtInterval: [0.36, 0.44],
      stSegment: [0.08, 0.12],
    },
    voltage: {
      pWave: { limb: [0, 0.25], chest: [0, 0.15] },
      qrsWave: { limb: [0.5, 2.0], chest: [1.0, 2.0] },
      tWave: [0, 0.3],
    },
  };

  useEffect(() => {
    const { wave, measurementType, valueType, numericalValue, rrInterval, rrUnit } = values;
    const val = parseFloat(numericalValue);
    if (isNaN(val)) {
      updateFields({ result: numericalValue ? "Please enter a valid numerical value." : "" });
      return;
    }

    let finalInterp = "";

    if (wave === "unitConversion") {
      const convUnitType = measurementType;
      const convFactors = convUnitType === "duration" ? DURATION_FACTORS : VOLTAGE_FACTORS;
      const factor = convFactors[valueType];
      if (!factor) {
        finalInterp = "Please select a valid unit.";
      } else {
        const base = val * factor;
        finalInterp = unitOptions
          .map((u) => `${formatConverted(base / convFactors[u.value])} ${u.label}`)
          .join(" | ");
      }
    } else if (wave === "heartRate") {
      if (val <= 0) {
        updateFields({ result: "Please enter a valid numerical value." });
        return;
      }
      const rrSeconds =
        valueType === "seconds"
          ? val
          : valueType === "milliseconds"
            ? val * 0.001
            : valueType === "smallSquares"
              ? val * 0.04
              : valueType === "largeSquares"
                ? val * 0.2
                : val;

      const hr = 60 / rrSeconds;
      finalInterp =
        hr < 60
          ? `Heart Rate: ${hr.toFixed(1)} bpm → Bradycardia`
          : hr > 100
            ? `Heart Rate: ${hr.toFixed(1)} bpm → Tachycardia`
            : `Heart Rate: ${hr.toFixed(1)} bpm → Normal`;
    } else {
      if (val <= 0) {
        updateFields({ result: "Please enter a valid numerical value." });
        return;
      }
      const factor = factors[valueType];
      const baseValue = val * factor;
      const waveLabel = WAVE_OPTIONS.find((o) => o.value === wave)?.label || wave;

      // Lead-type-specific voltage ranges for P wave and QRS complex
      const rawRange = normalRanges[measurementType][wave];
      if (!rawRange) {
        finalInterp = "No normal range defined for this measurement.";
      } else if (measurementType === "voltage" && (wave === "pWave" || wave === "qrsWave")) {
        // Show both limb and chest lead interpretations
        const limbRange = rawRange.limb;
        const chestRange = rawRange.chest;
        const limbLow = limbRange[0] / factor;
        const limbHigh = limbRange[1] / factor;
        const chestLow = chestRange[0] / factor;
        const chestHigh = chestRange[1] / factor;

        const limbLabel =
          limbRange[0] === 0
            ? `≤ ${limbHigh.toFixed(2)} ${valueType}`
            : `${limbLow.toFixed(2)} - ${limbHigh.toFixed(2)} ${valueType}`;
        const chestLabel =
          chestRange[0] === 0
            ? `≤ ${chestHigh.toFixed(2)} ${valueType}`
            : `${chestLow.toFixed(2)} - ${chestHigh.toFixed(2)} ${valueType}`;

        const limbNormal = baseValue >= limbRange[0] && baseValue <= limbRange[1];
        const chestNormal = baseValue >= chestRange[0] && baseValue <= chestRange[1];

        finalInterp =
          `${waveLabel}\n` +
          `Limb: ${limbNormal ? "Normal" : "Abnormal"}\n${limbLabel}\n` +
          `Chest: ${chestNormal ? "Normal" : "Abnormal"}\n${chestLabel}`;
        // Store structured data for colored rendering
        var structuredResult = {
          title: waveLabel,
          rows: [
            { label: "Limb", normal: limbNormal, range: limbLabel },
            { label: "Chest", normal: chestNormal, range: chestLabel },
          ],
        };
      } else {
        const range = rawRange;
        const displayLow = range[0] / factor;
        const displayHigh = range[1] / factor;
        const rangeLabel =
          range[0] === 0
            ? `≤ ${displayHigh.toFixed(2)} ${valueType}`
            : `${displayLow.toFixed(2)} - ${displayHigh.toFixed(2)} ${valueType}`;

        finalInterp =
          baseValue >= range[0] && baseValue <= range[1]
            ? `${waveLabel} is Normal\n(${rangeLabel})`
            : `${waveLabel} is Abnormal\n(Normal: ${rangeLabel})`;

        if (wave === "qtInterval") {
          const rrVal = parseFloat(rrInterval);
          if (!isNaN(rrVal) && rrVal > 0) {
            const rrSeconds =
              rrUnit === "seconds"
                ? rrVal
                : rrUnit === "milliseconds"
                  ? rrVal * 0.001
                  : rrUnit === "smallSquares"
                    ? rrVal * 0.04
                    : rrUnit === "largeSquares"
                      ? rrVal * 0.2
                      : rrVal;

            const qtc = baseValue / Math.sqrt(rrSeconds); // Bazett formula
            finalInterp += ` | QTc (Bazett): ${qtc.toFixed(2)} s → ${qtc >= 0.36 && qtc <= 0.44 ? "Normal" : "Abnormal"
              } (Formula: QTc = QT / √RR)`;
          } else {
            finalInterp += " | QTc: Enter valid RR interval";
          }
        }
      }
    }

    if (finalInterp !== values.result || structuredResult !== values.resultData) {
      updateFields({ result: finalInterp, resultData: structuredResult || null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.wave, values.measurementType, values.valueType, values.numericalValue, values.rrInterval, values.rrUnit]);

  return (
    <div className="calc-container">
      <FormulaBox title="ECG Wave Measurement Guide">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Where each wave/interval is measured:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.78rem", lineHeight: 1.5 }}>
          {Object.entries(WAVE_GUIDES).map(([key, text]) => (
            <li key={key}>
              <strong>{WAVE_OPTIONS.find((o) => o.value === key)?.label}:</strong> {text}
            </li>
          ))}
        </ul>
        <p style={{ margin: "8px 0 4px 0", fontWeight: 600 }}>Voltage Reference (limb vs chest leads):</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.78rem", lineHeight: 1.5 }}>
          {Object.entries(VOLTAGE_GUIDE).map(([key, text]) => (
            <li key={key}>{text}</li>
          ))}
        </ul>
      </FormulaBox>

      <SelectField
        label="Wave/Interval:"
        field="wave"
        values={values}
        setField={setField}
        options={WAVE_OPTIONS}
      />

      {WAVE_GUIDES[values.wave] && (
        <p className="calc-guide-text">{WAVE_GUIDES[values.wave]}</p>
      )}

      {values.wave !== "heartRate" && (
        <SelectField
          label="Measurement Type:"
          field="measurementType"
          values={values}
          setField={setField}
          disabled={values.wave === "prInterval"}
          options={
            values.wave === "prInterval"
              ? [{ value: "duration", label: "Duration" }]
              : [
                  { value: "duration", label: "Duration" },
                  { value: "voltage", label: "Voltage" },
                ]
          }
        />
      )}

      <SelectField
        label="Unit:"
        field="valueType"
        values={values}
        setField={setField}
        options={unitOptions}
      />

      <div className="calc-box">
        <input
          type="number"
          placeholder="Enter value"
          value={values.numericalValue}
          onChange={(e) => setField("numericalValue", e.target.value)}
          className="calc-input"
        />
      </div>

      {/* RR interval for QTc */}
      {values.wave === "qtInterval" && (
        <div className="calc-box">
          <label className="calc-label">RR Interval (for QTc):</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder="e.g., 0.8"
              value={values.rrInterval}
              onChange={(e) => setField("rrInterval", e.target.value)}
              className="calc-input"
              style={{ flex: 2 }}
            />
            <select
              value={values.rrUnit}
              onChange={(e) => setField("rrUnit", e.target.value)}
              className="calc-select"
              style={{ flex: 1 }}
            >
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
          {values.resultData ? (
            <>
              <div className="calc-result-title">{values.resultData.title}</div>
              {values.resultData.rows.map((row, i) => (
                <div key={i} className="calc-result-row">
                  <span className="calc-result-lead">{row.label}:</span>{" "}
                  <span className={row.normal ? "calc-status-normal" : "calc-status-abnormal"}>
                    {row.normal ? "Normal" : "Abnormal"}
                  </span>
                  <div className="calc-result-range">{row.range}</div>
                </div>
              ))}
            </>
          ) : (
            <span
              key="ecg-colorized"
              dangerouslySetInnerHTML={{ __html: colorizeResult(values.result) }}
            />
          )}
        </div>
      )}

      <ResetButton onClick={reset} />

      <p className="calc-disclaimer">
        Disclaimer: Interpret ECG measurements alongside the overall ECG and clinical context.
      </p>
    </div>
  );
}
