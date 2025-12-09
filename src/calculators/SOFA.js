// src/calculators/SOFA.js
import { useState } from "react";

export default function SOFA() {
  const [mode, setMode] = useState("qsofa"); // default

  /* =======================
     qSOFA STATES
  ======================= */
  const [rr, setRr] = useState("");
  const [sbp, setSbp] = useState("");
  const [gcs, setGcs] = useState("");
  const [qsofa, setQsofa] = useState(null);

  function calcQSOFA() {
    const r = Number(rr);
    const s = Number(sbp);
    const g = Number(gcs);

    if ([r, s, g].some(v => !Number.isFinite(v))) {
      setQsofa({ error: "Enter valid numeric values." });
      return;
    }

    let score = 0;
    if (r >= 22) score++;
    if (s <= 100) score++;
    if (g < 15) score++;

    let interp =
      score >= 2
        ? "High risk of poor outcome → urgent assessment for sepsis required."
        : score === 1
        ? "Intermediate risk → close monitoring advised."
        : "Low immediate risk.";

    setQsofa({ score, interp });
  }

  /* =======================
     MODIFIED SOFA STATES
  ======================= */
  const [spo2, setSpo2] = useState("");
  const [platelets, setPlatelets] = useState("");
  const [bilirubin, setBilirubin] = useState("");
  const [map, setMap] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [msofa, setMsofa] = useState(null);

  function calcMSOFA() {
    const sp = Number(spo2);
    const pl = Number(platelets);
    const bl = Number(bilirubin);
    const mp = Number(map);
    const cr = Number(creatinine);

    let r = null, c = null, l = null, cv = null, rn = null;

    if (!isNaN(sp)) {
      if (sp >= 96) r = 0;
      else if (sp >= 94) r = 1;
      else if (sp >= 90) r = 2;
      else if (sp >= 85) r = 3;
      else r = 4;
    }

    if (!isNaN(pl)) {
      if (pl >= 150) c = 0;
      else if (pl >= 100) c = 1;
      else if (pl >= 50) c = 2;
      else if (pl >= 20) c = 3;
      else c = 4;
    }

    const blMg = bl / 17.1;
    if (!isNaN(bl)) {
      if (blMg < 1.2) l = 0;
      else if (blMg < 2.0) l = 1;
      else if (blMg < 6.0) l = 2;
      else if (blMg < 12.0) l = 3;
      else l = 4;
    }

    if (!isNaN(mp)) {
      if (mp >= 70) cv = 0;
      else cv = 1;
    }

    const crMg = cr / 88.4;
    if (!isNaN(cr)) {
      if (crMg < 1.2) rn = 0;
      else if (crMg < 2.0) rn = 1;
      else if (crMg < 3.5) rn = 2;
      else if (crMg < 5.0) rn = 3;
      else rn = 4;
    }

    const parts = [r, c, l, cv, rn].filter(v => v !== null);
    if (parts.length === 0) {
      setMsofa({ error: "Enter at least one valid parameter." });
      return;
    }

    const total = parts.reduce((a, b) => a + b, 0);

    let interp =
      total <= 4
        ? "Mild organ dysfunction."
        : total <= 9
        ? "Moderate organ dysfunction → increased mortality risk."
        : "Severe organ dysfunction → ICU-level care likely required.";

    setMsofa({ r, c, l, cv, rn, total, interp });
  }

  return (
    <div>
      <h1>SOFA Score</h1>

      <label>
        Select calculator:
        <br />
        <select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="qsofa">qSOFA</option>
          <option value="msofa">Modified SOFA</option>
        </select>
      </label>

      <hr />

      {/* =======================
          qSOFA VIEW
      ======================= */}
      {mode === "qsofa" && (
        <div>
          <h2>qSOFA</h2>
          <p>
            RR ≥ 22/min, SBP ≤ 100 mmHg, GCS &lt; 15 <br />
            <em>Score ≥ 2 suggests high sepsis risk.</em>
          </p>

          <input placeholder="Respiratory Rate" value={rr} onChange={e => setRr(e.target.value)} />{" "}
          <p></p><input placeholder="Systolic BP" value={sbp} onChange={e => setSbp(e.target.value)} />{" "}
          <p></p><input placeholder="GCS Score" value={gcs} onChange={e => setGcs(e.target.value)} />

          <p />
          <button onClick={calcQSOFA}>Calculate</button>

          {qsofa && (
            <div>
              {qsofa.error ? (
                <p>{qsofa.error}</p>
              ) : (
                <>
                  <p><strong>Score:</strong> {qsofa.score} / 3</p>
                  <p><strong>Interpretation:</strong> {qsofa.interp}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* =======================
          MODIFIED SOFA VIEW
      ======================= */}
      {mode === "msofa" && (
        <div>
          <h2>Modified SOFA</h2>

          <input placeholder="SpO₂ (%)" value={spo2} onChange={e => setSpo2(e.target.value)} /><br /><br />
          <input placeholder="Platelets (×10³/µL)" value={platelets} onChange={e => setPlatelets(e.target.value)} /><br /><br />
          <input placeholder="Bilirubin (µmol/L)" value={bilirubin} onChange={e => setBilirubin(e.target.value)} /><br /><br />
          <input placeholder="MAP (mmHg)" value={map} onChange={e => setMap(e.target.value)} /><br /><br />
          <input placeholder="Creatinine (µmol/L)" value={creatinine} onChange={e => setCreatinine(e.target.value)} />

          <p />
          <button onClick={calcMSOFA}>Calculate</button>

          {msofa && (
            <div>
              {msofa.error ? (
                <p>{msofa.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Component scores:</strong><br />
                    Resp: {msofa.r} | Coag: {msofa.c} | Liver: {msofa.l} |
                    CV: {msofa.cv} | Renal: {msofa.rn}
                  </p>
                  <p><strong>Total:</strong> {msofa.total}</p>
                  <p><strong>Interpretation:</strong> {msofa.interp}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
