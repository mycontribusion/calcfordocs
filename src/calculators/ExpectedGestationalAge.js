import { useState, useEffect } from "react";

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

  const compute = () => {
    setResult(null);

    const reference = refDate ? new Date(refDate) : new Date();

    let edd = null;
    let gaDaysAtRef = null;
    let source = "";
    let backCalculatedLMP = null;

    try {
      if (method === "lmp") {
        if (!lmp) return;
        const lmpDate = new Date(lmp);
        if (isNaN(lmpDate)) return;

        edd = addDays(lmpDate, 280);
        source = "LMP (Naegele's rule)";
        gaDaysAtRef = daysBetween(lmpDate, reference);
      }

      if (method === "conception") {
        if (!conception) return;
        const cDate = new Date(conception);
        if (isNaN(cDate)) return;

        edd = addDays(cDate, 266);
        source = "Conception date";
        gaDaysAtRef = daysBetween(cDate, reference) + 14;
      }

      if (method === "ultrasound") {
        if (!usDate || usWeeks === "" || usDays === "") return;
        const uDate = new Date(usDate);
        if (isNaN(uDate)) return;

        const w = Number(usWeeks);
        const d = Number(usDays);
        if (w < 0 || d < 0 || d > 6) return;

        const usGADays = w * 7 + d;
        edd = addDays(uDate, 280 - usGADays);
        source = `Ultrasound (${w}w ${d}d on ${formatDate(uDate)})`;
        gaDaysAtRef = usGADays + daysBetween(uDate, reference);

        backCalculatedLMP = addDays(uDate, -usGADays);
      }
    } catch {
      return;
    }

    if (!edd || gaDaysAtRef === null) return;

    const ga = weeksAndDaysFromDays(Math.max(0, gaDaysAtRef));
    const dueIn = weeksAndDaysFromDays(
      Math.max(0, daysBetween(reference, edd))
    );

    let trimester = "3rd trimester";
    if (gaDaysAtRef < 14) trimester = "Very early pregnancy";
    else if (gaDaysAtRef < 14 + 13 * 7) trimester = "1st trimester";
    else if (gaDaysAtRef < 14 + 27 * 7) trimester = "2nd trimester";

    setResult({
      edd,
      source,
      reference,
      ga,
      dueIn,
      trimester,
      backCalculatedLMP,
    });
  };

  // 🔁 Auto-calculate
  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, lmp, conception, usDate, usWeeks, usDays, refDate]);

  const reset = () => {
    setMethod("lmp");
    setLmp("");
    setConception("");
    setUsDate("");
    setUsWeeks("");
    setUsDays("");
    setRefDate("");
    setResult(null);
  };

  return (
    <div>
      <h2>EGA, EDD & LMP</h2>

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
        <>
          <p></p>
          <label>Ultrasound date</label>
          <input type="date" value={usDate} onChange={(e) => setUsDate(e.target.value)} />
          <p></p>
          <label>US GA — weeks</label>
          <input type="number" min="0" value={usWeeks} onChange={(e) => setUsWeeks(e.target.value)} />
          <label> days</label>
          <input type="number" min="0" max="6" value={usDays} onChange={(e) => setUsDays(e.target.value)} />
        </>
      )}

      <p></p>
      <label>Reference date (optional):</label><br />
      <input type="date" value={refDate} onChange={(e) => setRefDate(e.target.value)} />

      <p></p>
      <button type="button" onClick={reset}>Reset</button>

      {result && (
        <div>
          <p><strong>Method:</strong> {result.source}</p>
          <p><strong>EDD:</strong> {formatDate(result.edd)}</p>
          <p>
            <strong>Gestational age on {formatDate(result.reference)}:</strong>{" "}
            {result.ga.weeks}w {result.ga.days}d
          </p>
          <p>
            <strong>Time until due:</strong> {result.dueIn.weeks}w {result.dueIn.days}d
          </p>
          <p><strong>Trimester:</strong> {result.trimester}</p>

          {method === "ultrasound" && result.backCalculatedLMP && (
            <>
              <hr />
              <p><strong>Back-calculated LMP:</strong> {formatDate(result.backCalculatedLMP)}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
