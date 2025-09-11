import { useState } from "react";
//import "./ExpectedGestationalAge.css";

function daysBetween(a, b) {
  // difference in whole days (b - a)
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
  const [method, setMethod] = useState("lmp"); // lmp | conception | ultrasound
  const [lmp, setLmp] = useState("");
  const [conception, setConception] = useState("");
  const [usDate, setUsDate] = useState("");
  const [usWeeks, setUsWeeks] = useState("");
  const [usDays, setUsDays] = useState("");
  const [refDate, setRefDate] = useState(""); // to compute GA on specific date; default is today
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const compute = (e) => {
    if (e) e.preventDefault();
    setError("");
    setResult(null);

    const today = new Date();
    const reference = refDate ? new Date(refDate) : new Date();

    let edd = null;
    let gaDaysAtRef = null; // gestational age in days at reference date
    let source = "";

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
      } else if (method === "conception") {
        if (!conception) {
          setError("Please enter conception date.");
          return;
        }
        const cDate = new Date(conception);
        if (isNaN(cDate)) { setError("Invalid conception date."); return; }

        edd = addDays(cDate, 266);
        source = "Conception date";
        // gestational age counts from LMP normally; if using conception, add ~14 days to compare
        gaDaysAtRef = daysBetween(cDate, reference) + 14;
      } else if (method === "ultrasound") {
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
        source = `Ultrasound (GA ${w}w ${d}d on ${formatDate(uDate)})`;
        // gestational age at reference = usGADays + (reference - usDate)
        gaDaysAtRef = usGADays + daysBetween(uDate, reference);
      } else {
        setError("Unknown method.");
        return;
      }
    } catch (err) {
      setError("Unexpected error - please check input dates.");
      return;
    }

    if (!edd) {
      setError("Could not calculate EDD.");
      return;
    }

    // If GA days negative (reference before LMP/conception/us), allow negative -> show as "not yet pregnant"
    const gaDays = gaDaysAtRef;
    const ga = weeksAndDaysFromDays(Math.max(0, gaDays));
    const daysUntilDue = daysBetween(reference, edd);
    const dueIn = weeksAndDaysFromDays(Math.max(0, daysUntilDue));

    // trimester
    let trimester = "Unknown";
    if (gaDays < 0) trimester = "Pre-embryonic (before dating reference)";
    else if (gaDays < 14) trimester = "Very early pregnancy";
    else if (gaDays < 14 + 13 * 7) trimester = "1st trimester";
    else if (gaDays < 14 + 27 * 7) trimester = "2nd trimester";
    else trimester = "3rd trimester";

    setResult({
      edd,
      source,
      reference: reference,
      gaDays,
      ga,
      daysUntilDue,
      dueIn,
      trimester,
      today,
    });
  };

  return (
    <div className="ega-card">
      <h2>Expected Gestational Age & EDD</h2>

      <form className="ega-form" onSubmit={compute}>
        <label>Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="select-field">
          <option value="lmp">LMP (Naegele's rule) — default</option>
          <option value="conception">Conception date</option>
          <option value="ultrasound">Ultrasound (enter GA on scan date)</option>
        </select>

        {method === "lmp" && (
          <>
            <label>Last Menstrual Period (LMP)</label>
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="input-field" />
          </>
        )}

        {method === "conception" && (
          <>
            <label>Conception date</label>
            <input type="date" value={conception} onChange={(e) => setConception(e.target.value)} className="input-field" />
          </>
        )}

        {method === "ultrasound" && (
          <>
            <label>Ultrasound date</label>
            <input type="date" value={usDate} onChange={(e) => setUsDate(e.target.value)} className="input-field" />

            <div className="row">
              <div style={{flex:1}}>
                <label>US GA — weeks</label>
                <input type="number" min="0" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} className="input-field" placeholder="e.g., 12" />
              </div>
              <div style={{width: '90px', marginLeft:8}}>
                <label>days</label>
                <input type="number" min="0" max="6" value={usDays} onChange={(e) => setUsDays(e.target.value)} className="input-field" placeholder="0–6" />
              </div>
            </div>
          </>
        )}

        <label>Reference date for GA (optional; default = today)</label>
        <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} className="input-field" />

        <div className="actions">
          <button type="submit" className="button">Calculate</button>
          <button type="button" className="button secondary" onClick={() => {
            setLmp(""); setConception(""); setUsDate(""); setUsWeeks(""); setUsDays(""); setRefDate(""); setResult(null); setError("");
          }}>Reset</button>
        </div>
      </form>

      {error && <div className="result danger">{error}</div>}

      {result && (
        <div className="result success">
          <div><strong>Method:</strong> {result.source}</div>
          <div style={{marginTop:6}}><strong>Estimated Due Date (EDD):</strong> {formatDate(result.edd)}</div>
          <div style={{marginTop:6}}>
            <strong>Gestational age on {formatDate(result.reference)}:</strong>{" "}
            {result.gaDays < 0 ? `Not yet — ${Math.abs(result.gaDays)} day(s) before reference` :
              `${result.ga.weeks} week(s) and ${result.ga.days} day(s)` }
          </div>
          <div style={{marginTop:6}}>
            <strong>Time until due:</strong> {result.daysUntilDue < 0 ? `Past due by ${Math.abs(result.daysUntilDue)} day(s)` : `${result.dueIn.weeks} week(s) and ${result.dueIn.days} day(s)` }
          </div>
          <div style={{marginTop:8}}><strong>Trimester:</strong> {result.trimester}</div>

          <details style={{marginTop:10}}>
            <summary>Notes / Calculation details</summary>
            <ul>
              <li>Naegele's rule: EDD = LMP + 280 days.</li>
              <li>Conception-based EDD uses 266 days after conception (≈ LMP + 280).</li>
              <li>Ultrasound: EDD = ultrasound date + (280 − ultrasound GA days).</li>
              <li>Gestational age is displayed in completed weeks and days.</li>
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
