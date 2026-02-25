import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";
import "./CalculatorShared.css";

const nasalFiO2Map = { 1: 0.24, 2: 0.28, 3: 0.32, 4: 0.36, 5: 0.40, 6: 0.44 };
const venturiFiO2Map = {
  venturi24: 0.24,
  venturi28: 0.28,
  venturi31: 0.31,
  venturi35: 0.35,
  venturi40: 0.40,
  venturi50: 0.50,
};

const devices = [
  { value: "none", label: "None (Room air)" },
  { value: "nasal", label: "Nasal cannula" },
  { value: "simpleMask", label: "Simple face mask" },
  { value: "nrbm", label: "Non-rebreather mask" },
  { value: "venturi24", label: "Venturi 24%" },
  { value: "venturi28", label: "Venturi 28%" },
  { value: "venturi31", label: "Venturi 31%" },
  { value: "venturi35", label: "Venturi 35%" },
  { value: "venturi40", label: "Venturi 40%" },
  { value: "venturi50", label: "Venturi 50%" },
  { value: "ventilator", label: "Ventilator / HFNC" },
];

const deviceFlowConfig = {
  nasal: true,
  simpleMask: true,
  ventilator: true,
  nrbm: false,
  none: false,
  venturi24: false,
  venturi28: false,
  venturi31: false,
  venturi35: false,
  venturi40: false,
  venturi50: false,
};

const deviceEstimators = {
  none: () => 0.21,
  nasal: (f) => (f ? nasalFiO2Map[f] ?? Math.min(0.21 + 0.04 * f, 0.44) : 0.21),
  simpleMask: (f) => {
    if (!f) return 0.35;
    if (f <= 6) return 0.40;
    if (f <= 7) return 0.50;
    return 0.60;
  },
  nrbm: () => 0.80,
  ventilator: (f) => (f > 1 ? f / 100 : f || 0.21),
  ...Object.fromEntries(Object.entries(venturiFiO2Map).map(([k, v]) => [k, () => v])),
};

const estimateFiO2 = (device, flow) => deviceEstimators[device]?.(Number(flow)) ?? 0.21;

const INITIAL_STATE = {
  spo2: "",
  device: "none",
  flow: "",
  // Global Sync Keys
  heartRate: "",
};

export default function SpO2FiO2Ratio() {
  const { values, suggestions, updateField: setField, syncField, reset } = useCalculator(INITIAL_STATE);

  const { fio2, ratio } = useMemo(() => {
    const estimatedFiO2 = estimateFiO2(values.device, values.flow);
    const r = values.spo2 && estimatedFiO2 ? Math.round(Number(values.spo2) / estimatedFiO2) : null;
    return { fio2: estimatedFiO2, ratio: r };
  }, [values.spo2, values.device, values.flow]);

  const breakdown = [
    ["Device", values.device],
    deviceFlowConfig[values.device] && ["Flow / FiO₂ input", values.flow],
    ["Estimated FiO₂", fio2.toFixed(2)],
  ];

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">SpO₂ (%)</label>
        <SyncSuggestion field="spo2" suggestion={suggestions.spo2} onSync={syncField} />
        <input
          type="number"
          value={values.spo2}
          onChange={(e) => setField("spo2", e.target.value)}
          placeholder="e.g. 92"
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">
          Oxygen device:
        </label>
        <select value={values.device} onChange={(e) => setField("device", e.target.value)} className="calc-select">
          {devices.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {deviceFlowConfig[values.device] && (
        <div className="calc-box">
          <label className="calc-label">{values.device === "ventilator" ? "FiO₂ (0.4 or 40)" : "Flow rate (L/min)"}</label>
          <input
            type="number"
            value={values.flow}
            onChange={(e) => setField("flow", e.target.value)}
            className="calc-input"
          />
        </div>
      )}

      <div style={{ marginTop: "12px" }}>
        <p className="calc-label">FiO₂ breakdown</p>
        <div style={{ fontSize: '0.9rem' }}>
          {breakdown.map(
            (item, i) =>
              item && (
                <div key={i}>
                  {item[0]}: <strong>{item[1]}</strong>
                </div>
              )
          )}
        </div>
      </div>

      {ratio && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>SpO₂ / FiO₂ ratio:</strong> {ratio}</p>
          <p><strong>Interpretation:</strong> {interpretSF(ratio)}</p>
        </div>
      )}

      <small style={{ display: 'block', marginTop: 12, color: '#666', fontSize: '0.75rem' }}>
        BTS/ARDSNet approximations
      </small>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}

function interpretSF(ratio) {
  if (!ratio) return "";
  if (ratio > 315) return "Normal oxygenation";
  if (ratio >= 235) return "Mild hypoxemia";
  if (ratio >= 150) return "Moderate hypoxemia";
  return "Severe hypoxemia";
}
