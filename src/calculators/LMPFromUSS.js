import { useState } from "react";

function LMPFromUSS() {
  const [edd, setEdd] = useState("");
  const [result, setResult] = useState(null);

  const calculateLMP = () => {
    if (!edd) {
      setResult("Please enter EDD from ultrasound");
      return;
    }

    const eddDate = new Date(edd);

    // Subtract 280 days (40 weeks)
    const lmp = new Date(eddDate);
    lmp.setDate(lmp.getDate() - 280);

    setResult(lmp.toDateString());
  };

  return (
    <div className="calc-container">
      <h2>Calculate LMP from USS EDD</h2>

      <label>
        EDD (from ultrasound):
        <input
          type="date"
          value={edd}
          onChange={(e) => setEdd(e.target.value)}
        />
      </label>

      <button onClick={calculateLMP}>Calculate LMP</button>

      {result && (
        <div className="result">
          <p><strong>Estimated LMP:</strong> {result}</p>
        </div>
      )}
    </div>
  );
}

export default LMPFromUSS;
