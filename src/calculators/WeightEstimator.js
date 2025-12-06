import React, { useState } from "react";

export default function PediatricWeightEstimator() {
  const [age, setAge] = useState("");
  const [unit, setUnit] = useState("days");
  const [formula, setFormula] = useState("nelson");
  const [weightResult, setWeightResult] = useState("");
  const [formulaResult, setFormulaResult] = useState("");

  const calculateWeight = () => {
    let years = 0;
    let months = 0;

    // Convert entered age
    if (unit === "days") {
      if (age >= 365) {
        years = age / 365;
      } else {
        months = age / 30.44;
      }
    } else if (unit === "months") {
      if (age >= 12) {
        years = age / 12;
      } else {
        months = age;
      }
    } else if (unit === "years") {
      years = age;
    }

    let weight = null;
    let explanation = "";

    if (formula === "nelson") {
      if (months >= 3 && months <= 11) {
        weight = (months + 9) / 2;
        explanation = "Nelson Formula: Weight = (Age in months + 9) ÷ 2";
      } else if (years >= 1 && years <= 6) {
        weight = 2 * years + 8;
        explanation = "Nelson Formula: Weight = (2 × Age in years) + 8";
      } else if (years >= 7 && years <= 12) {
        weight = 7 * years - 5;
        explanation = "Nelson Formula: Weight = (7 × Age in years) - 5";
      } else {
        setWeightResult("Not applicable for this age range (Nelson).");
        setFormulaResult("");
        return;
      }
    } else if (formula === "bestGuess") {
      if (unit === "days" && age < 365) {
        weight = age * 0.02 + 3;
        explanation = "Best Guess: Weight = (Age in days × 0.02) + 3";
      } else if (months >= 1 && months <= 11) {
        weight = (months + 9) / 2;
        explanation = "Best Guess: Weight = (Age in months + 9) ÷ 2";
      } else if (years >= 1 && years <= 5) {
        weight = 2 * years + 5;
        explanation = "Best Guess: Weight = (2 × Age in years) + 5";
      } else if (years >= 5 && years <= 14) {
        weight = 4 * years;
        explanation = "Best Guess: Weight = 4 × Age in years";
      } else {
        setWeightResult("Not applicable for this age range (Best Guess).");
        setFormulaResult("");
        return;
      }
    }

    setWeightResult(`Estimated Weight: ${weight.toFixed(1)} kg`);
    setFormulaResult(explanation);
  };

  return (
    <div>
      <h2>Pediatric Weight Estimator</h2>

      <label>
        Age: <br />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </label>

      <label>
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </label><p></p>

      <label>
        Formula:
        <select value={formula} onChange={(e) => setFormula(e.target.value)}>
          <option value="nelson">Nelson</option>
          <option value="bestGuess">Best Guess</option>
        </select>
      </label><p></p>

      <button onClick={calculateWeight}>Calculate</button>

      {weightResult && (
        <div>
          <p>{weightResult}</p>
          {formulaResult && <p>{formulaResult}</p>}
        </div>
      )}
    </div>
  );
}
