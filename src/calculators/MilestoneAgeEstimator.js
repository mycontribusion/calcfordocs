import { useState } from "react";

export default function MilestoneAgeEstimator() {
  const [grossMotor, setGrossMotor] = useState("");
  const [fineMotor, setFineMotor] = useState("");
  const [language, setLanguage] = useState("");
  const [result, setResult] = useState("");

  const estimateAge = () => {
    if (!grossMotor && !fineMotor && !language) {
      setResult("⚠️ Please select at least one milestone.");
      return;
    }

    let ageEstimates = [];

    // Gross motor
    switch (grossMotor) {
      case "headControl":
        ageEstimates.push("~2 months");
        break;
      case "sits":
        ageEstimates.push("~6 months");
        break;
      case "crawls":
        ageEstimates.push("~9 months");
        break;
      case "walksSupport":
        ageEstimates.push("~12 months");
        break;
      case "walksAlone":
        ageEstimates.push("~15 months");
        break;
      case "runs":
        ageEstimates.push("~2 years");
        break;
      case "tricycle":
        ageEstimates.push("~3 years");
        break;
      case "hops":
        ageEstimates.push("~4 years");
        break;
      case "skips":
        ageEstimates.push("~5 years");
        break;
      default:
        break;
    }

    // Fine motor
    switch (fineMotor) {
      case "reaches":
        ageEstimates.push("~4 months");
        break;
      case "transfers":
        ageEstimates.push("~6 months");
        break;
      case "pincer":
        ageEstimates.push("~9 months");
        break;
      case "blocks2":
        ageEstimates.push("~12 months");
        break;
      case "blocks4":
        ageEstimates.push("~18 months");
        break;
      case "blocks6":
        ageEstimates.push("~2 years");
        break;
      case "circle":
        ageEstimates.push("~3 years");
        break;
      case "cross":
        ageEstimates.push("~4 years");
        break;
      case "square":
        ageEstimates.push("~5 years");
        break;
      default:
        break;
    }

    // Language
    switch (language) {
      case "cooing":
        ageEstimates.push("~2 months");
        break;
      case "babbling":
        ageEstimates.push("~6 months");
        break;
      case "mama":
        ageEstimates.push("~9 months");
        break;
      case "firstWords":
        ageEstimates.push("~12 months");
        break;
      case "words20":
        ageEstimates.push("~18 months");
        break;
      case "phrases2":
        ageEstimates.push("~2 years");
        break;
      case "sentences3":
        ageEstimates.push("~3 years");
        break;
      case "story":
        ageEstimates.push("~4 years");
        break;
      case "fluent":
        ageEstimates.push("~5 years");
        break;
      default:
        break;
    }

    setResult(`Estimated Age Range: ${[...new Set(ageEstimates)].join(", ")}`);
  };

  return (
    <div>
      <h2>Pediatric Age Estimator (Milestones)</h2>

      <p><b>Gross Motor:</b></p>
      <select value={grossMotor} onChange={(e) => setGrossMotor(e.target.value)}>
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

      <p><b>Fine Motor:</b></p>
      <select value={fineMotor} onChange={(e) => setFineMotor(e.target.value)}>
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

      <p><b>Language/Verbal:</b></p>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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

      <br /><br />
      <button onClick={estimateAge}>Estimate Age</button>

      {result && (
        <p>
          <b>{result}</b>
        </p>
      )}

      <p>
      </p>
    </div>
  );
}
