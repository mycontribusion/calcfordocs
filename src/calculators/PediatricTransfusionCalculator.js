import { useState } from "react";

export default function PediatricTransfusionCalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [observedValue, setObservedValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [method, setMethod] = useState("pcv"); // pcv or hb
  const [pcvOfRBC, setPcvOfRBC] = useState(""); // optional
  const [factor, setFactor] = useState(3); // default factor
  const [result, setResult] = useState(null);

  const formulaUsed =
    "Transfusion Volume = Weight (kg) × (Target Hb – Observed Hb) × 3 ÷ Hct of RBCs";

  const calculateTransfusion = () => {
    const w = weightUnit === "lb" ? Number(weight) * 0.453592 : Number(weight);
    let observed = Number(observedValue);
    let target = Number(targetValue);
    const pcv = pcvOfRBC ? Number(pcvOfRBC) : null;
    const f = Number(factor);

    if (!w || !observed || !target || target <= observed || !f) {
      setResult({ error: "invalid input." });
      return;
    }

    let conversionNote = "";

    // Convert PCV → Hb if method = pcv
    if (method === "pcv") {
      observed = observed / 3;
      target = target / 3;
      conversionNote = `Converted PCV to Hb: Observed Hb = ${observed.toFixed(
        1
      )}, Target Hb = ${target.toFixed(1)}`;
    }

    let transfusionVolume = w * (target - observed) * f;
    if (pcv && f === 3) transfusionVolume = transfusionVolume / pcv;

    setResult({
      volume: `Transfusion Volume: ${transfusionVolume.toFixed(0)} mL`,
      note: conversionNote,
      formula: formulaUsed,
    });
  };

  return (
    <div>
      <h2>Pediatric Transfusion Calculator</h2>

      {/* Weight Input */}
      <label>
        Weight:
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </label>
      <label>
        <select
          value={weightUnit}
          onChange={(e) => setWeightUnit(e.target.value)}
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
        </select>
      </label>
      <p></p>

      {/* Method */}
      <label>
        Method:
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="pcv">PCV</option>
          <option value="hb">Hb</option>
        </select>
      </label>
      <p></p>

      {/* Observed */}
      <label>
        Observed {method.toUpperCase()}:
        <input
          type="number"
          value={observedValue}
          onChange={(e) => setObservedValue(e.target.value)}
        />
      </label>
      <p></p>

      {/* Target */}
      <label>
        Target {method.toUpperCase()}:
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
        />
      </label>
      <p></p>

      {/* Factor */}
      <label>
        Factor:
        <input
          type="number"
          value={factor}
          onChange={(e) => {
            setFactor(e.target.value);
            if (Number(e.target.value) !== 3) setPcvOfRBC("");
          }}
        />
      </label>
      <p></p>

      {/* Hct of RBC - only visible if factor = 3 */}
      {Number(factor) === 3 && (
        <>
          <label>
            Hct of RBCs (optional):
            <input
              type="number"
              placeholder="100% = 1, 50% = 0.5"
              value={pcvOfRBC}
              onChange={(e) => setPcvOfRBC(e.target.value)}
            />
          </label>
          <p></p>
        </>
      )}

      {/* Calculate Button */}
      <button onClick={calculateTransfusion}>Calculate</button>
      <p></p>

      {/* Result */}
      {result && (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>{result.volume}</p>
              {result.note && <p>{result.note}</p>}
              <p>{result.formula}</p>
            </>
          )}
        </div>
      )}

      {/* Extra Note */}
      <p style={{ fontSize: "0.9em", color: "gray" }}>
        Hct of RBCs represents the PCV of the blood to be transfused in decimal
        form. In some low-resource settings, instead of dividing 3 by Hct, the
        Weight and Increment are multiplied by 3 for packed cells, by 4 for
        sedimented cells, and 6 for whole blood.
      </p>
    </div>
  );
}
