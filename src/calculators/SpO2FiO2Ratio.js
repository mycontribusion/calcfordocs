import React, { useState, useEffect } from "react";

/* ================= FiO₂ Maps (Guideline-aligned) ================= */
const nasalFiO2Map = { 1: 0.24, 2: 0.28, 3: 0.32, 4: 0.36, 5: 0.40, 6: 0.44 };
const venturiFiO2Map = {
  venturi24: 0.24,
  venturi28: 0.28,
  venturi31: 0.31,
  venturi35: 0.35,
  venturi40: 0.40,
  venturi50: 0.50,
};

/* ================= Device Configs ================= */
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

// Which devices need flow input
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

/* ================= FiO₂ Estimators ================= */
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

/* ================= Custom Hook ================= */
function useSpO2FiO2Ratio(spo2, device, flow) {
  const [fio2, setFio2] = useState(0.21);
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    const estimatedFiO2 = estimateFiO2(device, flow);
    setFio2(estimatedFiO2);
    setRatio(spo2 && estimatedFiO2 ? Math.round(Number(spo2) / estimatedFiO2) : null);
  }, [spo2, device, flow]);

  return { fio2, ratio };
}

/* ================= Reusable Input ================= */
function LabeledInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "block", margin: "8px 0" }}>
      {label}:
      <br />
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </label>
  );
}

/* ================= Main Component ================= */
export default function SpO2FiO2Ratio() {
  const [spo2, setSpo2] = useState("");
  const [device, setDevice] = useState("none");
  const [flow, setFlow] = useState("");

  const { fio2, ratio } = useSpO2FiO2Ratio(spo2, device, flow);

  /* ================= Breakdown for display ================= */
  const breakdown = [
    ["Device", device],
    deviceFlowConfig[device] && ["Flow / FiO₂ input", flow],
    ["Estimated FiO₂", fio2.toFixed(2)],
  ];

  return (
    <div>
      <h4>SpO₂ / FiO₂ Ratio</h4>

      <LabeledInput
        label="SpO₂ (%)"
        value={spo2}
        onChange={(e) => setSpo2(e.target.value)}
        type="number"
        placeholder="e.g. 92"
      />

      <label>
        Oxygen device:
        <br />
        <select value={device} onChange={(e) => setDevice(e.target.value)}>
          {devices.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      {deviceFlowConfig[device] && (
        <LabeledInput
          label={device === "ventilator" ? "FiO₂ (0.4 or 40)" : "Flow rate (L/min)"}
          value={flow}
          onChange={(e) => setFlow(e.target.value)}
          type="number"
        />
      )}

      <div style={{ marginTop: "12px" }}>
        <p>
          <strong>FiO₂ breakdown</strong>
        </p>
        {breakdown.map(
          (item, i) =>
            item && (
              <div key={i}>
                {item[0]}: <strong>{item[1]}</strong>
              </div>
            )
        )}
      </div>

      {ratio && (
        <p style={{ marginTop: "8px" }}>
          <strong>SpO₂ / FiO₂ ratio:</strong> {ratio}
        </p>
      )}

      <small>
        FiO₂ values are estimated using standard BTS/ARDSNet approximations. Actual FiO₂ may vary
        with patient factors.
      </small>
    </div>
  );
}
