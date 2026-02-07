import { useState } from "react";

export default function MilestoneAgeEstimator() {
  const [grossMotor, setGrossMotor] = useState("");
  const [fineMotor, setFineMotor] = useState("");
  const [language, setLanguage] = useState("");

  const reset = () => {
    setGrossMotor("");
    setFineMotor("");
    setLanguage("");
  };

  // Map milestones to approximate age in months for comparison
  const milestoneAges = {
    // Gross motor
    headControl: 2, sits: 6, crawls: 9, walksSupport: 12, walksAlone: 15,
    runs: 24, tricycle: 36, hops: 48, skips: 60,
    // Fine motor
    reaches: 4, transfers: 6, pincer: 9, blocks2: 12, blocks4: 18,
    blocks6: 24, circle: 36, cross: 48, square: 60,
    // Language
    cooing: 2, babbling: 6, mama: 9, firstWords: 12, words20: 18,
    phrases2: 24, sentences3: 36, story: 48, fluent: 60
  };

  // Collect all selected milestones
  const selectedMilestones = [grossMotor, fineMotor, language].filter(Boolean);

  // Determine the largest age among them
  const maxAgeMonths = selectedMilestones.length
    ? Math.max(...selectedMilestones.map(m => milestoneAges[m]))
    : null;

  // Convert months to approximate years and months for display
  let result = "⚠️ Please select at least one milestone.";
  if (maxAgeMonths !== null) {
    if (maxAgeMonths < 12) {
      result = `Estimated Age: ~${maxAgeMonths} month${maxAgeMonths > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(maxAgeMonths / 12);
      const months = maxAgeMonths % 12;
      result = months
        ? `Estimated Age: ~${years} yr ${months} mo`
        : `Estimated Age: ~${years} yr`;
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "1rem auto", padding: 16, borderRadius: 8, fontFamily: "Arial, sans-serif" }}>
      <h2>Pediatric Age Estimator</h2>

      <b>Gross Motor:</b>
      <select value={grossMotor} onChange={(e) => setGrossMotor(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 12 }}>
        <option value="">--Select--</option>
        <option value="headControl">Head control</option>
        <option value="sits">Sits without support</option>
        <option value="crawls">Crawls</option>
        <option value="walksSupport">Walks with support</option>
        <option value="walksAlone">Walks alone</option>
        <option value="runs">Runs</option>
        <option value="tricycle">Rides tricycle</option>
        <option value="hops">Hops on one foot</option>
        <option value="skips">Skips</option>
      </select>

      <b>Fine Motor:</b>
      <select value={fineMotor} onChange={(e) => setFineMotor(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 12 }}>
        <option value="">--Select--</option>
        <option value="reaches">Reaches for objects</option>
        <option value="transfers">Transfers object hand-to-hand</option>
        <option value="pincer">Pincer grasp</option>
        <option value="blocks2">Stacks 2 blocks</option>
        <option value="blocks4">Stacks 4 blocks</option>
        <option value="blocks6">Stacks 6 blocks</option>
        <option value="circle">Copies circle</option>
        <option value="cross">Copies cross</option>
        <option value="square">Copies square</option>
      </select>

      <b>Language/Verbal:</b>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: 6, marginBottom: 12 }}>
        <option value="">--Select--</option>
        <option value="cooing">Cooing</option>
        <option value="babbling">Babbling</option>
        <option value="mama">Mama/Dada</option>
        <option value="firstWords">First words</option>
        <option value="words20">10–20 words</option>
        <option value="phrases2">2-word phrases</option>
        <option value="sentences3">3-word sentences</option>
        <option value="story">Tells story</option>
        <option value="fluent">Fluent conversation</option>
      </select>

      <p></p><button onClick={reset} style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #888", marginBottom: 12 }}>Reset</button>

      <p><b>{result}</b></p>
    </div>
  );
}
