import React, { useMemo, useEffect } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const MILESTONES = {
  // Gross Motor
  headControl: { m: 3, label: "Head control (steady)" },
  sitsSupport: { m: 6, label: "Sits with support" },
  sitsAlone: { m: 8, label: "Sits without support" },
  pullsStand: { m: 9, label: "Pulls to stand" },
  walksSupport: { m: 12, label: "Walks with support" },
  walksAlone: { m: 15, label: "Walks alone" },
  runs: { m: 24, label: "Runs well" },
  tricycle: { m: 36, label: "Rides tricycle" },
  hops: { m: 48, label: "Hops on one foot" },
  skips: { m: 60, label: "Skips" },

  // Fine Motor
  reaches: { m: 4, label: "Reaches for objects" },
  transfers: { m: 6, label: "Transfers hand-to-hand" },
  pincer: { m: 9, label: "Pincer grasp" },
  blocks2: { m: 15, label: "Tower of 2 blocks" },
  blocks3: { m: 18, label: "Tower of 3 blocks" },
  blocks6: { m: 24, label: "Tower of 6 blocks" },
  circle: { m: 36, label: "Copies circle" },
  cross: { m: 48, label: "Copies cross" },
  square: { m: 60, label: "Copies square" },

  // Language
  cooing: { m: 2, label: "Cooing" },
  laughing: { m: 4, label: "Squeals / Laughs" },
  babbling: { m: 6, label: "Babbling" },
  mamaPapa: { m: 10, label: "Mama/Papa (specific)" },
  words10: { m: 18, label: "Uses 10 words" },
  phrases2: { m: 24, label: "2-word phrases" },
  sentences3: { m: 36, label: "3-word sentences" },
  story: { m: 48, label: "Tells stories" },

  // Social/Personal
  smile: { m: 1.5, label: "Social smile" },
  stranger: { m: 9, label: "Stranger anxiety" },
  bye: { m: 12, label: "Waves bye-bye" },
  spoon: { m: 18, label: "Uses spoon" },
  parallel: { m: 24, label: "Parallel play" },
  coop: { m: 36, label: "Cooperative play" }
};

const INITIAL_STATE = {
  grossMotor: "",
  fineMotor: "",
  language: "",
  social: "",
  // SYNC KEYS
  age: "",
  ageUnit: "months"
};

export default function MilestoneAgeEstimator() {
  const { values, updateField: setField, updateFields, reset } = useCalculator(INITIAL_STATE);

  const estimation = useMemo(() => {
    const selected = [values.grossMotor, values.fineMotor, values.language, values.social].filter(Boolean);
    if (!selected.length) return null;

    const maxMonths = Math.max(...selected.map(m => MILESTONES[m].m));
    return maxMonths;
  }, [values.grossMotor, values.fineMotor, values.language, values.social]);

  const displayResult = useMemo(() => {
    if (estimation === null) return "Select milestones to estimate age";

    if (estimation < 1) return "~ weeks";
    if (estimation < 12) return `~${estimation} months`;

    const years = Math.floor(estimation / 12);
    const months = estimation % 12;
    return `~${years} yr ${months ? months + " mo" : ""}`;
  }, [estimation]);

  // SYNC: Update global age when estimation changes
  useEffect(() => {
    if (estimation !== null) {
      if (estimation >= 12) {
        updateFields({ age: (estimation / 12).toFixed(1), ageUnit: "years" });
      } else {
        updateFields({ age: estimation, ageUnit: "months" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimation]);

  const renderSelect = (label, field, keys) => (
    <div className="calc-box">
      <label className="calc-label">{label}</label>
      <select
        value={values[field]}
        onChange={e => setField(field, e.target.value)}
        className="calc-select"
      >
        <option value="">Select Milestone</option>
        {keys.map(key => (
          <option key={key} value={key}>{MILESTONES[key].label} ({MILESTONES[key].m}m)</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="calc-container">
      {renderSelect("Gross Motor", "grossMotor", ["headControl", "sitsSupport", "sitsAlone", "pullsStand", "walksSupport", "walksAlone", "runs", "tricycle", "hops", "skips"])}
      {renderSelect("Fine Motor", "fineMotor", ["reaches", "transfers", "pincer", "blocks2", "blocks3", "blocks6", "circle", "cross", "square"])}
      {renderSelect("Language", "language", ["cooing", "laughing", "babbling", "mamaPapa", "words10", "phrases2", "sentences3", "story"])}
      {renderSelect("Social & Personal", "social", ["smile", "stranger", "bye", "spoon", "parallel", "coop"])}

      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>

      <div className="calc-result" style={{ marginTop: 16 }}>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Estimated Developmental Age:</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0056b3', margin: '4px 0' }}>{displayResult}</p>
        <p style={{ fontSize: '0.7rem', fontStyle: 'italic', marginTop: 8 }}>
          *Estimation based on highest achieved milestone.
        </p>
      </div>
    </div>
  );
}
