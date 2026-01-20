import React, { useState, useEffect } from "react";

export default function SpO2FiO2Ratio() {
  const [spo2, setSpo2] = useState("");
  const [device, setDevice] = useState("none");
  const [flow, setFlow] = useState("");
  const [fio2, setFio2] = useState(0.21);
  const [ratio, setRatio] = useState(null);

  /* ================= FiO₂ Estimation ================= */
  const estimateFiO2 = (device, flow) => {
    const f = Number(flow);

    switch (device) {
      case "none":
        return 0.21;

      case "nasal":
        if (!f || f <= 0) return 0.21;
        return Math.min(0.21 + 0.04 * f, 0.44);

      case "simpleMask":
        if (f <= 6) return 0.40;
        if (f <= 7) return 0.50;
        return 0.60;

      case "nrbm":
        return 0.80;

      case "venturi24":
        return 0.24;
      case "venturi28":
        return 0.28;
      case "venturi31":
        return 0.31;
      case "venturi35":
        return 0.35;
      case "venturi40":
        return 0.40;
      case "venturi50":
        return 0.50;

      case "ventilator":
        if (!f) return 0.21;
        return f > 1 ? f / 100 : f;

      default:
        return 0.21;
    }
  };

  /* ================= Live Calculation ================= */
  useEffect(() => {
    const estimatedFiO2 = estimateFiO2(device, flow);
    setFio2(estimatedFiO2);

    if (!spo2 || !estimatedFiO2) {
      setRatio(null);
      return;
    }

    setRatio(Math.round(Number(spo2) / estimatedFiO2));
  }, [spo2, device, flow]);

  return (
    <div>
      <h4>SpO₂ / FiO₂ Ratio</h4>

      <label>SpO2:<br /><input
        type="number"
        placeholder="SpO₂ (%)"
        value={spo2}
        onChange={(e) => setSpo2(e.target.value)}
      /></label>
<p></p>
      <label>
        Oxygen device:
        <br /><select value={device} onChange={(e) => setDevice(e.target.value)}>
          <option value="none">None</option>
          <option value="nasal">Nasal cannula</option>
          <option value="simpleMask">Simple face mask</option>
          <option value="nrbm">Non-rebreather mask</option>
          <option value="venturi24">Venturi 24%</option>
          <option value="venturi28">Venturi 28%</option>
          <option value="venturi31">Venturi 31%</option>
          <option value="venturi35">Venturi 35%</option>
          <option value="venturi40">Venturi 40%</option>
          <option value="venturi50">Venturi 50%</option>
          <option value="ventilator">Ventilator / HFNC</option>
        </select><p></p>
      </label>

      {device !== "none" &&
        device !== "nrbm" &&
        !device.startsWith("venturi") && (
          <input
            type="number"
            placeholder={
              device === "ventilator"
                ? "FiO₂ (0.4 or 40)"
                : "Flow rate (L/min)"
            }
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
          />
        )}

      {/* ================= Breakdown ================= */}
      <div>
        <p>
          FiO₂ breakdown:
          <br />
          Device: <strong>{device}</strong>
          {flow && (
            <>
              <br />
              Flow: <strong>{flow}</strong>
            </>
          )}
          <br />
          Estimated FiO₂: <strong>{fio2.toFixed(2)}</strong>
        </p>
      </div>

      {ratio && (
        <p>
          SpO₂ / FiO₂ ratio: <strong>{ratio}</strong>
        </p>
      )}
    </div>
  );
}
