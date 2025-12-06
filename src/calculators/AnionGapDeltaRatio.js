import { useState } from "react";

export default function AnionGapDeltaRatio() {
  const [sodium, setSodium] = useState("");
  const [potassium, setPotassium] = useState("");
  const [chloride, setChloride] = useState("");
  const [bicarbonate, setBicarbonate] = useState("");
  const [albumin, setAlbumin] = useState(""); // optional
  const [albuminUnit, setAlbuminUnit] = useState("g/dL"); // default unit
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // parse numeric or return null
  function parseNum(v) {
    if (v === "" || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // convert albumin input to g/dL
  function albuminToGdL(val, unit) {
    // Accept common units: g/dL, g/L, g% (alias g/dL), mg/mL
    // g/L -> /10 ; mg/mL -> /100 ; g% treated as g/dL
    if (val === null) return null;
    switch (unit) {
      case "g/dL":
      case "g%":
        return val;
      case "g/L":
        return val / 10;
      case "mg/mL":
        return val / 100;
      default:
        return val;
    }
  }

  function calculate() {
    setError("");
    setResult(null);

    const na = parseNum(sodium);
    const k = parseNum(potassium);
    const cl = parseNum(chloride);
    const hco3 = parseNum(bicarbonate);
    const albRaw = albumin === "" ? null : parseNum(albumin);

    if (na === null) return setError("Enter valid Sodium (Na).");
    if (k === null) return setError("Enter valid Potassium (K).");
    if (cl === null) return setError("Enter valid Chloride (Cl).");
    if (hco3 === null) return setError("Enter valid Bicarbonate (HCO₃⁻).");
    if (albRaw !== null && albRaw === null) return setError("Enter valid Albumin or leave empty.");

    // AG calculation (with K included)
    const ag = na + k - (cl + hco3);
    const agRounded = Number(ag.toFixed(2));

    // albumin corrected AG (only if albumin provided)
    let agCorr = null;
    let albuminGdL = null;
    if (albRaw !== null) {
      albuminGdL = albuminToGdL(albRaw, albuminUnit);
      agCorr = ag + 2.5 * (4 - albuminGdL);
      agCorr = Number(agCorr.toFixed(2));
    }

    // Determine if either AG qualifies for HAGMA (>=12)
    const uncorrectedHigh = ag >= 12;
    const correctedHigh = agCorr !== null && agCorr >= 12;

    let deltaGap = null;
    let deltaRatio = null;
    let deltaInterpretation = null;

    // Only calculate Delta if either AG or AGcorr qualifies
    if (uncorrectedHigh || correctedHigh) {
      // choose which AG to use for delta: prefer corrected if it's provided and high
      const agForDelta = correctedHigh ? agCorr : ag;
      deltaGap = Number((agForDelta - 12).toFixed(2));

      // Avoid division by zero: (24 - HCO3) must not be 0
      if (Math.abs(24 - hco3) < 1e-9) {
        deltaRatio = null;
        deltaInterpretation = "Cannot compute ΔRatio: (24 − HCO₃⁻) is zero.";
      } else {
        deltaRatio = Number((deltaGap / (24 - hco3)).toFixed(2));

        // interpretation per common rules
        if (deltaRatio < 0.4) {
          deltaInterpretation =
            "ΔRatio < 0.4 → Mixed disorder: high AG metabolic acidosis + normal AG acidosis (e.g., concurrent non-AG metabolic acidosis).";
        } else if (deltaRatio > 2) {
          deltaInterpretation =
            "ΔRatio > 2 → Mixed disorder: high AG metabolic acidosis + metabolic alkalosis (or pre-existing high HCO₃⁻).";
        } else {
          deltaInterpretation = "ΔRatio 0.4–2 → Primary high AG metabolic acidosis.";
        }
      }
    }

    setResult({
      ag: agRounded,
      agCorr,
      albuminGdL,
      deltaGap,
      deltaRatio,
      deltaInterpretation,
    });
  }

  function reset() {
    setSodium("");
    setPotassium("");
    setChloride("");
    setBicarbonate("");
    setAlbumin("");
    setAlbuminUnit("g/dL");
    setResult(null);
    setError("");
  }

  return (
    <div>
      <h2>Anion Gap & Delta Gap / Delta Ratio</h2>

      <div>
        <label>
          Sodium (Na⁺, mmol/L)
          <br />
          <input
            inputMode="decimal"
            value={sodium}
            onChange={(e) => setSodium(e.target.value)}
            placeholder="e.g., 140"
          />
        </label>
      </div>
      <p />

      <div>
        <label>
          Potassium (K⁺, mmol/L)
          <br />
          <input
            inputMode="decimal"
            value={potassium}
            onChange={(e) => setPotassium(e.target.value)}
            placeholder="e.g., 4.0"
          />
        </label>
      </div>
      <p />

      <div>
        <label>
          Chloride (Cl⁻, mmol/L)
          <br />
          <input
            inputMode="decimal"
            value={chloride}
            onChange={(e) => setChloride(e.target.value)}
            placeholder="e.g., 100"
          />
        </label>
      </div>
      <p />

      <div>
        <label>
          Bicarbonate (HCO₃⁻, mmol/L)
          <br />
          <input
            inputMode="decimal"
            value={bicarbonate}
            onChange={(e) => setBicarbonate(e.target.value)}
            placeholder="e.g., 18"
          />
        </label>
      </div>
      <p />

      <div>
        <label>
          Albumin (optional)
          <br />
          <input
            inputMode="decimal"
            value={albumin}
            onChange={(e) => setAlbumin(e.target.value)}
            placeholder="e.g., 40 (g/L) or 3.5 (g/dL)"
            style={{ width: "120px", marginRight: "8px" }}
          />
          <select
            value={albuminUnit}
            onChange={(e) => setAlbuminUnit(e.target.value)}
          >
            <option value="g/dL">g/dL</option>
            <option value="g/L">g/L</option>
            <option value="g%">g%</option>
            <option value="mg/mL">mg/mL</option>
          </select>
        </label>
      </div>
      <p />

      <div>
        <button onClick={calculate}>Calculate</button>{" "}
        <button onClick={reset}>Reset</button>
      </div>

      <p />

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div>
          <p />

          {/* RESULTS */}
          <div>
            <strong>Results</strong>
            <br />
            Anion Gap (AG): {result.ag} mmol/L
            <br />
            {result.agCorr !== null && (
              <>
                Albumin (g/dL): {result.albuminGdL !== null ? result.albuminGdL.toFixed(2) : "—"}
                <br />
                Corrected AG: {result.agCorr} mmol/L
                <br />
              </>
            )}
          </div>

          <p />

          {/* DELTA (conditional) */}
          <div>
            <strong>Delta Gap / Delta Ratio</strong>
            <br />
            {result.deltaGap === null ? (
              <span>
                Delta Ratio not applicable — neither AG nor corrected AG meets high-AG threshold (≥ 12 mmol/L).
              </span>
            ) : result.deltaRatio === null ? (
              <span>ΔGap: {result.deltaGap}  — cannot compute ΔRatio (division by zero).</span>
            ) : (
              <>
                ΔGap: {result.deltaGap}
                <br />
                ΔRatio: {result.deltaRatio}
                <br />
                Interpretation: {result.deltaInterpretation}
              </>
            )}
          </div>

          <p />
          {/* FORMULAS */}
          <div>
            <strong>Formulas used:</strong>
            <br />
            • AG = (Na⁺ + K⁺) − (Cl⁻ + HCO₃⁻)
            <br />
            • Albumin-corrected AG = AG + 2.5 × (4 − albumin [g/dL])  (shown only if albumin entered)
            <br />
            • ΔGap = AGused − 12  (AGused = corrected AG if corrected AG ≥ 12, else uncorrected AG)
            <br />
            • ΔRatio = ΔGap ÷ (24 − HCO₃⁻)
          </div>

          {/* REFERENCE */}
          <div style={{ fontSize: "0.95em" }}>
            <strong>Reference / Notes:</strong>
            <br />
            • Normal AG ≈ 8–12 mmol/L (laboratory-dependent).  
            • Albumin correction un-masks HAGMA when albumin is low.  
            • ΔRatio interpretation: &lt;0.4 (mixed AG + non-AG acidosis), 0.4–2 (pure HAGMA), &gt;2 (HAGMA + alkalosis).
          </div>
        </div>
      )}
    </div>
  );
}
