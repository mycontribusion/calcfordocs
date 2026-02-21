import React, { useMemo } from "react";
import useCalculator from "./useCalculator";
import "./CalculatorShared.css";

const MILESTONES = {
  headControl: 2, sits: 6, crawls: 9, walksSupport: 12, walksAlone: 15, runs: 24, tricycle: 36, hops: 48, skips: 60,
  reaches: 4, transfers: 6, pincer: 9, blocks2: 12, blocks4: 18, blocks6: 24, circle: 36, cross: 48, square: 60,
  cooing: 2, babbling: 6, mama: 9, firstWords: 12, words20: 18, phrases2: 24, sentences3: 36, story: 48, fluent: 60
};

const INITIAL_STATE = { grossMotor: "", fineMotor: "", language: "" };

export default function MilestoneAgeEstimator() {
  const { values, updateField: setField, reset } = useCalculator(INITIAL_STATE);

  const result = useMemo(() => {
    const selected = [values.grossMotor, values.fineMotor, values.language].filter(Boolean);
    if (!selected.length) return "Select milestones";
    const maxMonths = Math.max(...selected.map(m => MILESTONES[m]));
    return maxMonths < 12 ? `~${maxMonths} months` : `~${Math.floor(maxMonths / 12)} yr ${maxMonths % 12 || ""} mo`;
  }, [values]);

  return (
    <div className="calc-container">
      <div className="calc-box"><label className="calc-label">Gross Motor:</label><select value={values.grossMotor} onChange={e => setField("grossMotor", e.target.value)} className="calc-select"><option value="">Select</option><option value="headControl">Head control (2m)</option><option value="sits">Sits (6m)</option><option value="walksAlone">Walks (15m)</option></select></div>
      <div className="calc-box"><label className="calc-label">Fine Motor:</label><select value={values.fineMotor} onChange={e => setField("fineMotor", e.target.value)} className="calc-select"><option value="">Select</option><option value="reaches">Reaches (4m)</option><option value="pincer">Pincer (9m)</option></select></div>
      <div className="calc-box"><label className="calc-label">Language:</label><select value={values.language} onChange={e => setField("language", e.target.value)} className="calc-select"><option value="">Select</option><option value="babbling">Babbling (6m)</option><option value="firstWords">Words (12m)</option></select></div>
      <button onClick={reset} className="calc-btn-reset">Reset Calculator</button>
      <div className="calc-result" style={{ marginTop: 16 }}><strong>Estimated Age:</strong> {result}</div>
    </div>
  );
}
