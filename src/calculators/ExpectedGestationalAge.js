import { useState } from "react";

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b - a) / msPerDay);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d) {
  if (!d) return "";
  return d.toLocaleDateString();
}

function weeksAndDaysFromDays(days) {
  const w = Math.floor(days / 7);
  const d = days % 7;
  return { weeks: w, days: d };
}

export default function ExpectedGestationalAge() {
  const [method, setMethod] = useState("lmp"); 
  const [lmp, setLmp] = useState("");
  const [conception, setConception] = useState("");
  const [usDate, setUsDate] = useState("");
  const [usWeeks, setUsWeeks] = useState("");
  const [usDays, setUsDays] = useState("");
  const [refDate, setRefDate] = useState(""); 
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const compute = (e) => {
    if (e) e.preventDefault();
    setError("");
    setResult(null);

    const reference = refDate ? new Date(refDate) : new Date();

    let edd = null;
    let gaDaysAtRef = null; 
    let source = "";
    let backCalculatedLMP = null;
    let lmpEdd = null;

    try {
      if (method === "lmp") {
        if (!lmp) {
          setError("Please enter LMP date.");
          return;
        }
        const lmpDate = new Date(lmp);
        if (isNaN(lmpDate)) { setError("Invalid LMP date."); return; }

        edd = addDays(lmpDate, 280);
        source = "LMP (Naegele's rule)";
        gaDaysAtRef = daysBetween(lmpDate, reference);
      } 
      else if (method === "conception") {
        if (!conception) {
          setError("Please enter conception date.");
          return;
        }
        const cDate = new Date(conception);
        if (isNaN(cDate)) { setError("Invalid conception date."); return; }

        edd = addDays(cDate, 266);
        source = "Conception date";
        gaDaysAtRef = daysBetween(cDate, reference) + 14; 
      } 
      else if (method === "ultrasound") {
        if (!usDate) { setError("Please enter ultrasound date."); return; }
        const uDate = new Date(usDate);
        if (isNaN(uDate)) { setError("Invalid ultrasound date."); return; }

        const w = parseInt(usWeeks, 10);
        const d = parseInt(usDays, 10);
        if (!Number.isFinite(w) || w < 0 || !Number.isFinite(d) || d < 0 || d > 6) {
          setError("Enter valid ultrasound GA (weeks and 0–6 days).");
          return;
        }

        const usGADays = w * 7 + d;
        const daysToEDD = 280 - usGADays;
        edd = addDays(uDate, daysToEDD);
        source = `Ultrasound (${w}w ${d}d on ${formatDate(uDate)})`;
        gaDaysAtRef = usGADays + daysBetween(uDate, reference);

        // back-calculate LMP equivalent
        backCalculatedLMP = addDays(uDate, -usGADays);
        lmpEdd = addDays(backCalculatedLMP, 280);
      } 
      else {
        setError("Unknown method.");
        return;
      }
    } catch (err) {
      setError("Unexpected error - please check input dates.");
      return;
    }

    const ga = weeksAndDaysFromDays(Math.max(0, gaDaysAtRef));
    const daysUntilDue = daysBetween(reference, edd);
    const dueIn = weeksAndDaysFromDays(Math.max(0, daysUntilDue));

    let trimester = "Unknown";
    if (gaDaysAtRef < 0) trimester = "Pre-embryonic";
    else if (gaDaysAtRef < 14) trimester = "Very early pregnancy";
    else if (gaDaysAtRef < 14 + 13 * 7) trimester = "1st trimester";
    else if (gaDaysAtRef < 14 + 27 * 7) trimester = "2nd trimester";
    else trimester = "3rd trimester";

    setResult({
      edd,
      source,
      reference,
      gaDays: gaDaysAtRef,
      ga,
      daysUntilDue,
      dueIn,
      trimester,
      backCalculatedLMP,
      lmpEdd,
    });
  };

  return (
    <div>
      <h2>Expected Gestational Age & EDD</h2>

      <form onSubmit={compute}>
        <label>Method:</label><br />
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="lmp">LMP (Naegele's rule)</option>
          <option value="conception">Conception date</option>
          <option value="ultrasound">Ultrasound</option>
        </select>

        {method === "lmp" && (
          <>
          <p></p>
            <label>LMP:</label><br />
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
          </>
        )}

        {method === "conception" && (
          <>
          <p></p>
            <label>Conception date</label>
            <input type="date" value={conception} onChange={(e) => setConception(e.target.value)} />
          </>
        )}

        {method === "ultrasound" && (
          <><p></p>
            <label>Ultrasound date</label>
            <input type="date" value={usDate} onChange={(e) => setUsDate(e.target.value)} />
            <p></p><label>US GA — weeks</label>
            <input type="number" min="0" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} />
            <label>days</label>
            <input type="number" min="0" max="6" value={usDays} onChange={(e) => setUsDays(e.target.value)} />
          </>
        )}
<p></p>
        <label>Reference date (optional):</label><br />
        <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} />

        <div>
          <p></p>
          <button type="submit">Calculate</button>
          <button type="button" onClick={() => {
            setLmp(""); setConception(""); setUsDate(""); setUsWeeks(""); setUsDays(""); setRefDate(""); setResult(null); setError("");
          }}>Reset</button><p></p>
        </div>
      </form>

      {error && <div>{error}</div>}

      {result && (
        <div>
          <div><strong>Method:</strong> {result.source}</div>
          <div><strong>EDD:</strong> {formatDate(result.edd)}</div>
          <div><strong>Gestational age on {formatDate(result.reference)}:</strong> {result.ga.weeks}w {result.ga.days}d</div>
          <div><strong>Time until due:</strong> {result.dueIn.weeks}w {result.dueIn.days}d</div>
          <div><strong>Trimester:</strong> {result.trimester}</div>

          {method === "ultrasound" && result.backCalculatedLMP && (
            <>
              <hr />
              <div><strong>Back-calculated LMP:</strong> {formatDate(result.backCalculatedLMP)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
