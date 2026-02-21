import React, { useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const INITIAL_STATE = {
  calcium: "",
  phosphate: "",
  caUnit: "mmol",
  phUnit: "mmol",
  result: null,
};

export default function CalciumPhosphateProduct() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  useEffect(() => {
    const ca = parseFloat(values.calcium);
    const ph = parseFloat(values.phosphate);

    if (isNaN(ca) || isNaN(ph) || ca <= 0 || ph <= 0) {
      if (values.result !== null) updateFields({ result: null });
      return;
    }

    const caMg = values.caUnit === "mmol" ? ca / 0.2495 : ca;
    const phMg = values.phUnit === "mmol" ? ph / 0.3229 : ph;
    const product = caMg * phMg;

    let interp = product < 55 ? "Low risk of calcification" : product <= 70 ? "Moderate risk" : "High risk";
    updateFields({ result: { product: product.toFixed(2), interp } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.calcium, values.phosphate, values.caUnit, values.phUnit]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Calcium:</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" value={values.calcium} onChange={(e) => setField("calcium", e.target.value)} className="calc-input" style={{ flex: 2 }} /><select value={values.caUnit} onChange={(e) => setField("caUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mmol">mmol/L</option><option value="mg">mg/dL</option></select></div></div>
      <div className="calc-box"><label className="calc-label">Phosphate:</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" value={values.phosphate} onChange={(e) => setField("phosphate", e.target.value)} className="calc-input" style={{ flex: 2 }} /><select value={values.phUnit} onChange={(e) => setField("phUnit", e.target.value)} className="calc-select" style={{ flex: 1 }}><option value="mmol">mmol/L</option><option value="mg">mg/dL</option></select></div></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      {values.result && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p><strong>Product:</strong> {values.result.product} mg²/dL²</p>
          <p>{values.result.interp}</p>
        </div>
      )}
    </div>
  );
}
