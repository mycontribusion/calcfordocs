import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  ussDate: "",
  gaWeeks: "",
  gaDays: "",
  currentDate: "",
  result: null,
};

function USSBasedGestationalAge() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  const calculateGA = () => {
    const { ussDate, gaWeeks, gaDays, currentDate } = values;
    if (!ussDate || gaWeeks === "" || gaDays === "" || !currentDate) {
      updateFields({ result: "Please fill in all fields" });
      return;
    }

    // Convert inputs
    const uss = new Date(ussDate);
    const now = new Date(currentDate);

    // Calculate days difference
    const diffDays = Math.floor((now - uss) / (1000 * 60 * 60 * 24));

    // Total GA in days
    const totalGADays = parseInt(gaWeeks) * 7 + parseInt(gaDays) + diffDays;

    // Convert back to weeks + days
    const newWeeks = Math.floor(totalGADays / 7);
    const newDays = totalGADays % 7;

    // EDD = USS Date + (280 - GA at USS days)
    const edd = new Date(uss);
    const gaAtUssDays = parseInt(gaWeeks) * 7 + parseInt(gaDays);
    edd.setDate(edd.getDate() + (280 - gaAtUssDays));

    updateFields({
      result: {
        ga: `${newWeeks} weeks ${newDays} days`,
        edd: edd.toDateString(),
      }
    });
  };

  return (
    <div className="calc-container">

      <div className="calc-box">
        <label className="calc-label">
          USS Date:
          <input
            type="date"
            value={values.ussDate}
            onChange={(e) => setField("ussDate", e.target.value)}
            className="calc-input"
          />
        </label>
      </div>

      <div className="calc-box">
        <label className="calc-label">
          GA at USS (weeks):
          <input
            type="number"
            value={values.gaWeeks}
            onChange={(e) => setField("gaWeeks", e.target.value)}
            className="calc-input"
          />
        </label>
      </div>

      <div className="calc-box">
        <label className="calc-label">
          GA at USS (days):
          <input
            type="number"
            value={values.gaDays}
            onChange={(e) => setField("gaDays", e.target.value)}
            className="calc-input"
          />
        </label>
      </div>

      <div className="calc-box">
        <label className="calc-label">
          Current Date:
          <input
            type="date"
            value={values.currentDate}
            onChange={(e) => setField("currentDate", e.target.value)}
            className="calc-input"
          />
        </label>
      </div>

      <button onClick={calculateGA} className="calc-btn-primary">Calculate</button>

      {values.result && typeof values.result === "string" && (
        <p className="calc-result" style={{ color: "#d9534f", borderColor: "#ebccd1", background: "#f2dede" }}>{values.result}</p>
      )}
      {values.result && typeof values.result === "object" && (
        <div className="calc-result">
          <p><strong>Current GA:</strong> {values.result.ga}</p>
          <p><strong>EDD:</strong> {values.result.edd}</p>
        </div>
      )}
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
    </div>
  );
}

export default USSBasedGestationalAge;
