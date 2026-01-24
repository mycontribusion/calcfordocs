import { useState } from "react";

export default function CURB65Calculator() {
  // Confusion components
  const [confTime, setConfTime] = useState(false);
  const [confPlace, setConfPlace] = useState(false);
  const [confPerson, setConfPerson] = useState(false);

  const [sbp, setSbp] = useState("");
  const [dbp, setDbp] = useState("");

  const [nitrogenType, setNitrogenType] = useState("urea_mg");
  const [value, setValue] = useState("");

  const [respRate, setRespRate] = useState("");
  const [age65, setAge65] = useState(false);

  // BUN conversion
  const bunMg = (() => {
    if (value === "") return 0;
    const v = Number(value);
    switch (nitrogenType) {
      case "urea_mmol":
        return v * 2.8;
      case "urea_mg":
        return v;
      case "bun_mmol":
        return v * 2.8;
      case "bun_mg":
        return v;
      default:
        return 0;
    }
  })();

  // Confusion score: any of time/place/person ticked → 1 point
  const confusionScore = confTime || confPlace || confPerson ? 1 : 0;

  // Low BP score
  const lowBPScore =
    sbp !== "" && dbp !== "" && (Number(sbp) < 90 || Number(dbp) <= 60)
      ? 1
      : 0;

  // CURB-65 scoring
  const score =
    confusionScore +
    lowBPScore +
    (bunMg >= 20 ? 1 : 0) +
    (respRate !== "" && Number(respRate) >= 30 ? 1 : 0) +
    (age65 ? 1 : 0);

  const containerStyle = {
    maxWidth: 360,
    margin: "1rem auto",
    padding: 16,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
  };

  const boxStyle = {
    border: "1px solid #aaa",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  };

  const labelStyle = { display: "block", marginBottom: 6 };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 16, fontSize: "18px" }}>CURB-65 Calculator</h2>

      {/* Confusion */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Confusion (Orientation)</div>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={confTime}
            onChange={(e) => setConfTime(e.target.checked)}
          />{" "}
          Disoriented to Time
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={confPlace}
            onChange={(e) => setConfPlace(e.target.checked)}
          />{" "}
          Disoriented to Place
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={confPerson}
            onChange={(e) => setConfPerson(e.target.checked)}
          />{" "}
          Disoriented to Person
        </label>
        <div style={{ fontSize: "12px", color: "#555" }}>
          (1 point if any disorientation)
        </div>
      </div>

      {/* Urea / BUN */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Urea / BUN</div>
        <select
          value={nitrogenType}
          onChange={(e) => setNitrogenType(e.target.value)}
          style={{ width: "100%", padding: 6, marginBottom: 4 }}
        >
          <option value="urea_mmol">Urea mmol/L</option>
          <option value="urea_mg">Urea mg/dL</option>
          <option value="bun_mmol">BUN mmol/L</option>
          <option value="bun_mg">BUN mg/dL</option>
        </select>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Urea / BUN"
          style={{ width: "100%", padding: 6 }}
        />
        <div style={{ fontSize: "12px", color: "#555" }}>
          (1 point if BUN ≥ 20 mg/dL)
        </div>
      </div>


      {/* Respiratory rate */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Respiratory Rate</div>
        <input
          type="number"
          value={respRate}
          onChange={(e) => setRespRate(e.target.value)}
          placeholder="Respiratory Rate (breaths/min)"
          style={{ width: "100%", padding: 6 }}
        />
        <div style={{ fontSize: "12px", color: "#555" }}>
          (1 point if RR ≥ 30)
        </div>
      </div>

      {/* Blood pressure */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Blood Pressure</div>
        <input
          type="number"
          value={sbp}
          onChange={(e) => setSbp(e.target.value)}
          placeholder="Systolic BP (mmHg)"
          style={{ width: "48%", padding: 6, marginRight: "4%" }}
        />
        <input
          type="number"
          value={dbp}
          onChange={(e) => setDbp(e.target.value)}
          placeholder="Diastolic BP (mmHg)"
          style={{ width: "48%", padding: 6 }}
        />
        <div style={{ fontSize: "12px", color: "#555" }}>
          (1 point if SBP &lt; 90 or DBP ≤ 60)
        </div>
      </div>

      {/* Age ≥65 */}
      <div style={boxStyle}>
        <label>
          <input
            type="checkbox"
            checked={age65}
            onChange={(e) => setAge65(e.target.checked)}
          />{" "}
          Age ≥ 65
        </label>
      </div>

      {/* Score display */}
      <div style={{ marginTop: 12, fontSize: "14px" }}>
        <strong>Score:</strong> {score} / 5
      </div>
      <div style={{ fontSize: "12px", color: "#555" }}>
        {score <= 1
          ? "0–1: Mild to moderate CAP. Consider outpatient care."
          : "≥2: Severe CAP. Recommend hospitalization."}
      </div>
    </div>
  );
}
