import { useState } from "react";
import "./CalculatorShared.css";

function PregnancyCalculator() {
  const [mode, setMode] = useState("lmp"); // "lmp", "edd", "ega"
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    if (!input) {
      setResult("Please enter a value");
      return;
    }

    const today = new Date();
    let lmp, edd, egaWeeks;

    // 1️⃣ Calculate LMP, EDD, EGA
    if (mode === "lmp") {
      lmp = new Date(input);
      edd = new Date(lmp);
      edd.setDate(edd.getDate() + 280);
      egaWeeks = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    } else if (mode === "edd") {
      edd = new Date(input);
      lmp = new Date(edd);
      lmp.setDate(lmp.getDate() - 280);
      egaWeeks = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    } else if (mode === "ega") {
      const weeks = Number(input);
      if (isNaN(weeks) || weeks < 0) {
        setResult("Please enter a valid number of weeks");
        return;
      }
      egaWeeks = weeks;
      lmp = new Date(today);
      lmp.setDate(lmp.getDate() - weeks * 7);
      edd = new Date(lmp);
      edd.setDate(edd.getDate() + 280);
    }

    // 2️⃣ Determine trimester
    let trimester;
    if (egaWeeks < 14) trimester = "First trimester";
    else if (egaWeeks < 28) trimester = "Second trimester";
    else trimester = "Third trimester";

    // 3️⃣ ANC appointment suggestion (weeks)
    // Simplified schedule: 1st visit 8–12 w, 2nd ~16 w, 3rd ~24 w, 4th ~28 w, 5th ~32 w, 6th ~36 w, 7th ~38–40 w
    const ancWeeks = [8, 16, 24, 28, 32, 36, 38];
    const nextAncWeek = ancWeeks.find(w => w > egaWeeks) || "No further scheduled ANC";

    // 4️⃣ Expected fetal movement start
    // Usually 16–20 w for first-time mothers, 14–18 w for multigravida
    const quickeningRange = "16–20 weeks (primigravida), 14–18 weeks (multigravida)";

    setResult({
      lmp: lmp.toDateString(),
      edd: edd.toDateString(),
      egaWeeks,
      trimester,
      nextAncWeek,
      quickeningRange,
    });
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="calc-select">
          <option value="lmp">LMP known → calculate EDD & EGA</option>
          <option value="edd">EDD known → calculate LMP & EGA</option>
          <option value="ega">Current EGA known → calculate LMP & EDD</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">
          {mode === "lmp" && "LMP"}
          {mode === "edd" && "EDD"}
          {mode === "ega" && "EGA (weeks)"}:
        </label>
        <input
          type={mode === "ega" ? "number" : "date"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="calc-input"
        />
      </div>

      <button onClick={calculate} className="calc-btn-primary">Calculate</button>

      {result && typeof result === 'string' && (
        <div className="calc-result" style={{ marginTop: 16, color: 'red', borderColor: 'red', background: '#fff0f0' }}>
          {result}
        </div>
      )}

      {result && typeof result === 'object' && (
        <div className="calc-result" style={{ marginTop: 16, textAlign: 'left', fontWeight: 'normal' }}>
          <p><strong>LMP:</strong> {result.lmp}</p>
          <p><strong>EDD:</strong> {result.edd}</p>
          <p><strong>Current EGA (weeks):</strong> {result.egaWeeks}</p>
          <p><strong>Trimester:</strong> {result.trimester}</p>
          <p><strong>Next ANC appointment:</strong> {result.nextAncWeek} weeks</p>
          <p><strong>Expected fetal movement (quickening):</strong> {result.quickeningRange}</p>
        </div>
      )}
    </div>
  );
}

export default PregnancyCalculator;
