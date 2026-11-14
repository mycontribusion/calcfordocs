import React, { useEffect } from "react";
import { useCalc, ResetButton, SyncSuggestion, FormulaBox } from "./CalcFields";
import { toBunMgdl, toCrMgdl } from "../utils/unitConversion";

const INITIAL_STATE = {
  urea: "",
  ureaUnit: "mmol/L",
  creatinine: "",
  creatinineUnit: "µmol/L",
  ratio: null,
  interpretation: "",
  marker: "urea",
};

/** Reference cut-offs differ by whether the numerator is BUN or Urea. */
const REFERENCE = {
  bun: {
    label: "BUN:Creatinine Ratio",
    numeratorLabel: "BUN",
    numeratorUnit: "mg/dL",
    ratioUnit: "BUN (mg/dL) : Creatinine (mg/dL)",
    ranges: [
      { range: "> 20:1", text: "Prerenal (e.g., severe dehydration)" },
      { range: "10–20:1", text: "Normal or Postrenal" },
      { range: "< 10:1", text: "Intrarenal (e.g., acute tubular necrosis)" },
    ],
  },
  urea: {
    label: "Urea:Creatinine Ratio",
    numeratorLabel: "Urea",
    numeratorUnit: "mmol/L",
    ratioUnit: "Urea (mmol/L) : Creatinine (mmol/L)",
    ranges: [
      { range: "> 100:1", text: "Prerenal (e.g., severe dehydration)" },
      { range: "40–100:1", text: "Normal or Postrenal" },
      { range: "< 40:1", text: "Intrarenal (e.g., acute tubular necrosis)" },
    ],
  },
};

export default function UreaCrRatio() {
  const { values, suggestions, updateField: setField, updateFields, syncField, reset } = useCalc(INITIAL_STATE);

  useEffect(() => {
    const ureaVal = parseFloat(values.urea);
    const crVal = parseFloat(values.creatinine);

    if (isNaN(ureaVal) || isNaN(crVal) || crVal === 0) {
      if (values.ratio !== null) updateFields({ ratio: null, interpretation: "" });
      return;
    }

    // The numerator marker decides which reference set applies.
    const marker = values.ureaUnit === "BUN (mg/dL)" ? "bun" : "urea";

    const bunMgdl = toBunMgdl(ureaVal, values.ureaUnit);
    const crMgdl  = toCrMgdl(crVal, values.creatinineUnit);

    // Both markers are normalised to BUN/Cr so a single ratio is computed,
    // then expressed in the unit system the user selected.
    const bunRatio = bunMgdl / crMgdl;
    const ratio = marker === "bun" ? bunRatio : bunRatio * 4.04;

    // Each marker has its own validated cut-offs.
    const highCut = marker === "bun" ? 20 : 100;
    const lowCut = marker === "bun" ? 10 : 40;

    const interp = ratio > highCut
      ? "Prerenal"
      : ratio < lowCut
        ? "Intrarenal"
        : "Normal/Postrenal";

    const suggests = ratio > highCut
      ? "Suggests pre-renal cause (e.g., severe dehydration)"
      : ratio < lowCut
        ? "Suggests intra-renal cause (e.g., acute tubular necrosis)"
        : "Normal or post-renal cause";

    updateFields({ ratio: ratio.toFixed(1), interpretation: interp, suggests, marker });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.urea, values.ureaUnit, values.creatinine, values.creatinineUnit]);

  return (
    <div className="calc-container">
      <FormulaBox title="BUN/Cr & Urea/Cr Ratio Guide">
        <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>Formulas:</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 2px 0", fontSize: '0.78rem' }}>BUN Ratio = BUN (mg/dL) ÷ Creatinine (mg/dL)</p>
        <p style={{ fontFamily: "monospace", margin: "0 0 6px 0", fontSize: '0.78rem' }}>Urea Ratio = Urea (mmol/L) ÷ Creatinine (mmol/L)</p>

        <p style={{ margin: "4px 0 2px 0", fontWeight: 600 }}>Unit Conversions:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li>Urea (mmol/L) → BUN (mg/dL): × 2.8</li>
          <li>Urea (mg/dL) → BUN (mg/dL): × 0.467 (or ÷ 2.14)</li>
          <li>Creatinine (µmol/L) → (mg/dL): ÷ 88.4</li>
          <li>Creatinine (mmol/L) → (mg/dL): × 1000 ÷ 88.4</li>
        </ul>

        <p style={{ margin: "8px 0 2px 0", fontWeight: 600 }}>BUN/Cr Ratio <span style={{ fontWeight: 400, opacity: 0.7 }}>(BUN mg/dL : Creatinine mg/dL)</span>:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>&gt; 20:1: Prerenal</strong> (e.g., severe dehydration)</li>
          <li><strong>10–20:1: Normal or Postrenal</strong></li>
          <li><strong>&lt; 10:1: Intrarenal</strong> (e.g., acute tubular necrosis)</li>
        </ul>

        <p style={{ margin: "8px 0 2px 0", fontWeight: 600 }}>Urea/Cr Ratio <span style={{ fontWeight: 400, opacity: 0.7 }}>(Urea mmol/L : Creatinine mmol/L)</span>:</p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.75rem' }}>
          <li><strong>&gt; 100:1: Prerenal</strong> (e.g., severe dehydration)</li>
          <li><strong>40–100:1: Normal or Postrenal</strong></li>
          <li><strong>&lt; 40:1: Intrarenal</strong> (e.g., acute tubular necrosis)</li>
        </ul>
      </FormulaBox>

      <div className="calc-box">
        <label className="calc-label">Urea / BUN:</label>
        <SyncSuggestion field="urea" suggestion={suggestions.urea} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.urea}
            onChange={(e) => setField("urea", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.ureaUnit} onChange={(e) => setField("ureaUnit", e.target.value)} className="calc-select" style={{ flex: 1.5 }}>
            <option value="mmol/L">Urea (mmol/L)</option>
            <option value="mg/dL">Urea (mg/dL)</option>
            <option value="BUN (mg/dL)">BUN (mg/dL)</option>
          </select>
        </div>
      </div>

      <div className="calc-box">
        <label className="calc-label">Creatinine:</label>
        <SyncSuggestion field="creatinine" suggestion={suggestions.creatinine} onSync={syncField} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            value={values.creatinine}
            onChange={(e) => setField("creatinine", e.target.value)}
            className="calc-input"
            style={{ flex: 2 }}
          />
          <select value={values.creatinineUnit} onChange={(e) => setField("creatinineUnit", e.target.value)} className="calc-select" style={{ flex: 1.5 }}>
            <option value="µmol/L">µmol/L</option>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
          </select>
        </div>
      </div>

      <ResetButton onClick={reset} />

      {values.ratio !== null && (() => {
        const ref = REFERENCE[values.marker] || REFERENCE.bun;
        return (
          <div className="calc-result" style={{ marginTop: 16 }}>
            <p><strong>{ref.label}:</strong> {values.ratio} : 1</p>
            <p style={{ marginTop: 4, color: '#0056b3' }}>{values.interpretation}</p>
            <div style={{ marginTop: 12, borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: 8, fontSize: '0.85rem', opacity: 0.8 }}>
              <p style={{ color: '#0056b3', marginBottom: 8, opacity: 1, fontWeight: 500 }}>{values.suggests}</p>
              <strong>{ref.label} Reference Ranges:</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
                {ref.ranges.map((r) => (
                  <li key={r.range}>• {r.range}: {r.text}</li>
                ))}
              </ul>
              <p style={{ fontSize: '0.75rem', marginTop: 8, fontStyle: 'italic' }}>
                {ref.numeratorLabel} ({ref.numeratorUnit}) : Creatinine ({ref === REFERENCE.bun ? "mg/dL" : "mmol/L"})
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
