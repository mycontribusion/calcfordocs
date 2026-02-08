import { useState } from "react";
import "./CalculatorShared.css";

export default function GCSCalculator() {
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);

  // Total and interpretation auto-calculated
  const total = eye + verbal + motor;

  let interpretation = "";
  if (total <= 8) interpretation = "Severe head injury (GCS ≤ 8)";
  else if (total <= 12) interpretation = "Moderate head injury (GCS 9 - 12)";
  else interpretation = "Mild head injury (GCS 13 - 15)";

  const reset = () => {
    setEye(4);
    setVerbal(5);
    setMotor(6);
  };

  return (
    <div className="calc-container">

      {/* Eye Response */}
      <div className="calc-box">
        <label className="calc-label">Eye Response (E)</label>
        <select value={eye} onChange={(e) => setEye(parseInt(e.target.value))} className="calc-select">
          <option value={4}>4 - Spontaneous</option>
          <option value={3}>3 - To speech</option>
          <option value={2}>2 - To pain</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Verbal Response */}
      <div className="calc-box">
        <label className="calc-label">Verbal Response (V)</label>
        <select value={verbal} onChange={(e) => setVerbal(parseInt(e.target.value))} className="calc-select">
          <option value={5}>5 - Oriented</option>
          <option value={4}>4 - Confused</option>
          <option value={3}>3 - Inappropriate words</option>
          <option value={2}>2 - Incomprehensible sounds</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Motor Response */}
      <div className="calc-box">
        <label className="calc-label">Motor Response (M)</label>
        <select value={motor} onChange={(e) => setMotor(parseInt(e.target.value))} className="calc-select">
          <option value={6}>6 - Obeys commands</option>
          <option value={5}>5 - Localizes pain</option>
          <option value={4}>4 - Withdraws to pain</option>
          <option value={3}>3 - Flexion (decorticate)</option>
          <option value={2}>2 - Extension (decerebrate)</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Result */}
      <div className="calc-result">
        Total GCS: {total} → {interpretation}
      </div>

      {/* Reset button */}
      <button onClick={reset} className="calc-btn-reset">
        Reset
      </button>
    </div>
  );
}
