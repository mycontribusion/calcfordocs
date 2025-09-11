import { useState } from "react";

function USSBasedGestationalAge() {
  const [ussDate, setUssDate] = useState("");
  const [gaWeeks, setGaWeeks] = useState("");
  const [gaDays, setGaDays] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [result, setResult] = useState(null);

  const calculateGA = () => {
    if (!ussDate || gaWeeks === "" || gaDays === "" || !currentDate) {
      setResult("Please fill in all fields");
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

    setResult({
      ga: `${newWeeks} weeks ${newDays} days`,
      edd: edd.toDateString(),
    });
  };

  return (
    <div className="calc-container">
      <h2>USS-Based Gestational Age Calculator</h2>

      <label>
        USS Date:
        <input
          type="date"
          value={ussDate}
          onChange={(e) => setUssDate(e.target.value)}
        />
      </label>

      <label>
        GA at USS (weeks):
        <input
          type="number"
          value={gaWeeks}
          onChange={(e) => setGaWeeks(e.target.value)}
        />
      </label>

      <label>
        GA at USS (days):
        <input
          type="number"
          value={gaDays}
          onChange={(e) => setGaDays(e.target.value)}
        />
      </label>

      <label>
        Current Date:
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
        />
      </label>

      <button onClick={calculateGA}>Calculate</button>

      {result && typeof result === "string" && (
        <p style={{ color: "red" }}>{result}</p>
      )}
      {result && typeof result === "object" && (
        <div className="result">
          <p><strong>Current GA:</strong> {result.ga}</p>
          <p><strong>EDD:</strong> {result.edd}</p>
        </div>
      )}
    </div>
  );
}

export default USSBasedGestationalAge;
