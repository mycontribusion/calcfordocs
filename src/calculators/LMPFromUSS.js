import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  mode: "lmp", // "lmp", "edd", "ega"
  input: "",
  result: null,
};

function PregnancyCalculator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  const calculate = () => {
    if (!values.input) {
      updateFields({ result: "Please enter a value" });
      return;
    }

    const today = new Date();
    let lmp, edd, egaWeeks;

    // 1️⃣ Calculate LMP, EDD, EGA
    if (values.mode === "lmp") {
      lmp = new Date(values.input);
      edd = new Date(lmp);
      edd.setDate(edd.getDate() + 280);
      egaWeeks = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    } else if (values.mode === "edd") {
      edd = new Date(values.input);
      lmp = new Date(edd);
      lmp.setDate(lmp.getDate() - 280);
      egaWeeks = Math.floor((today - lmp) / (7 * 24 * 60 * 60 * 1000));
    } else if (values.mode === "ega") {
      const weeks = Number(values.input);
      if (isNaN(weeks) || weeks < 0) {
        updateFields({ result: "Please enter a valid number of weeks" });
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
    const ancWeeks = [8, 16, 24, 28, 32, 36, 38];
    const nextAncWeek = ancWeeks.find(w => w > egaWeeks) || "No further scheduled ANC";

    // 4️⃣ Expected fetal movement start
    const quickeningRange = "16–20 weeks (primigravida), 14–18 weeks (multigravida)";

    updateFields({
      result: {
        lmp: lmp.toDateString(),
        edd: edd.toDateString(),
        egaWeeks,
        trimester,
        nextAncWeek,
        quickeningRange,
      }
    });
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">Mode:</label>
        <select value={values.mode} onChange={(e) => setField("mode", e.target.value)} className="calc-select">
          <option value="lmp">LMP known → calculate EDD & EGA</option>
          <option value="edd">EDD known → calculate LMP & EGA</option>
          <option value="ega">Current EGA known → calculate LMP & EDD</option>
        </select>
      </div>

      <div className="calc-box">
        <label className="calc-label">
          {values.mode === "lmp" && "LMP"}
          {values.mode === "edd" && "EDD"}
          {values.mode === "ega" && "EGA (weeks)"}:
        </label>
        <input
          type={values.mode === "ega" ? "number" : "date"}
          value={values.input}
          onChange={(e) => setField("input", e.target.value)}
          className="calc-input"
        />
      </div>

      <button onClick={calculate} className="calc-btn-primary">Calculate</button>

      {values.result && typeof values.result === 'string' && (
        <div className="calc-result" style={{ marginTop: 16, color: 'red', borderColor: 'red', background: '#fff0f0' }}>
          {values.result}
        </div>
      )}

      {values.result && typeof values.result === 'object' && (
        <div className="calc-result" style={{ marginTop: 16, textAlign: 'left', fontWeight: 'normal' }}>
          <p><strong>LMP:</strong> {values.result.lmp}</p>
          <p><strong>EDD:</strong> {values.result.edd}</p>
          <p><strong>Current EGA (weeks):</strong> {values.result.egaWeeks}</p>
          <p><strong>Trimester:</strong> {values.result.trimester}</p>
          <p><strong>Next ANC appointment:</strong> {values.result.nextAncWeek} weeks</p>
          <p><strong>Expected fetal movement (quickening):</strong> {values.result.quickeningRange}</p>
        </div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}

export default PregnancyCalculator;
