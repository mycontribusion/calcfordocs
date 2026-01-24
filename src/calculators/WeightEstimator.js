import React, { useState, useEffect } from "react";

export default function PediatricWeightEstimator() {
  const [age, setAge] = useState("");
  const [unit, setUnit] = useState("days");
  const [formula, setFormula] = useState("default");
  const [birthWeight, setBirthWeight] = useState("");
  const [weightResult, setWeightResult] = useState("");
  const [formulaResult, setFormulaResult] = useState("");

  // Helper: convert all ages to months
  const ageInMonths = () => {
    if (!age) return 0;
    if (unit === "days") return age / 30.44;
    if (unit === "months") return age;
    if (unit === "years") return age * 12;
    return 0;
  };

  const ageInYears = () => ageInMonths() / 12;

  const calculateWeight = () => {
    const months = ageInMonths();
    const years = ageInYears();

    const showBirthWeight = formula === "default" && months <= 3;

    if (!age || (showBirthWeight && !birthWeight)) {
      setWeightResult("⚠️ Please enter the required input(s).");
      setFormulaResult("");
      return;
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
      if (months < 12) {
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
    } else if (formula === "default") {
      if (months <= 3) {
        weight = (age - 10) * 30 + Number(birthWeight); // age in days
        weight = weight / 1000; // grams → kg
        explanation =
          "Custom Formula: Weight = (Age in days - 10) × 30 + Birth Weight (kg)";
      } else if (months > 3 && months <= 12) {
        weight = (months + 8) / 2;
        explanation = "Custom Formula: Weight = (Age in months + 8) ÷ 2";
      } else if (years >= 1 && years <= 6) {
        weight = 2 * years + 8;
        explanation = "Custom Formula: Weight = (2 × Age in years) + 8";
      } else if (years >= 7 && years <= 12) {
        weight = (7 * years - 5) / 2;
        explanation = "Custom Formula: Weight = (7 × Age in years - 5) ÷ 2";
      } else {
        setWeightResult("Not applicable for this age range (Custom).");
        setFormulaResult("");
        return;
      }
    }

    setWeightResult(`Estimated Weight: ${weight.toFixed(1)} kg`);
    setFormulaResult(explanation);
  };

  // Auto-calculate whenever relevant inputs change
  useEffect(() => {
    if (age && ((formula === "default" && (ageInMonths() > 3 || birthWeight)) || formula !== "default")) {
      calculateWeight();
    } else {
      setWeightResult("");
      setFormulaResult("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, unit, formula, birthWeight]);

  const showBirthWeightInput = formula === "default" && ageInMonths() <= 3;

  const reset = () => {
    setAge("");
    setUnit("days");
    setFormula("default");
    setBirthWeight("");
    setWeightResult("");
    setFormulaResult("");
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
      </label>
      <p></p>

      <label>
        Formula:
        <select value={formula} onChange={(e) => setFormula(e.target.value)}>
          <option value="nelson">Nelson</option>
          <option value="bestGuess">Best Guess</option>
          <option value="default">Default</option>
        </select>
      </label>
      <p></p>

      {showBirthWeightInput && (
        <label>
          Birth Weight (grams): <br />
          <input
            type="number"
            value={birthWeight}
            onChange={(e) => setBirthWeight(Number(e.target.value))}
          />
        </label>
      )}
      {showBirthWeightInput && <p></p>}

      {/* Reset Button */}
      <button onClick={reset}>Reset</button>
      <p></p>

      {weightResult && (
        <div>
          <p>{weightResult}</p>
          {formulaResult && <p>{formulaResult}</p>}
        </div>
      )}
    </div>
  );
}
