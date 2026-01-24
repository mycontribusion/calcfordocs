import { useState } from "react";

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

  const containerStyle = {
    maxWidth: 360,
    margin: "1rem auto",
    padding: 16,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
  };

  const boxStyle = {
    border: "1px solid #aaa",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  };

  const selectStyle = { width: "100%", padding: 6 };

  const reset = () => {
    setEye(4);
    setVerbal(5);
    setMotor(6);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 16, fontSize: "18px" }}>GCS Calculator</h2>

      {/* Eye Response */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Eye Response (E)</div>
        <select value={eye} onChange={(e) => setEye(parseInt(e.target.value))} style={selectStyle}>
          <option value={4}>4 - Spontaneous</option>
          <option value={3}>3 - To speech</option>
          <option value={2}>2 - To pain</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Verbal Response */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Verbal Response (V)</div>
        <select value={verbal} onChange={(e) => setVerbal(parseInt(e.target.value))} style={selectStyle}>
          <option value={5}>5 - Oriented</option>
          <option value={4}>4 - Confused</option>
          <option value={3}>3 - Inappropriate words</option>
          <option value={2}>2 - Incomprehensible sounds</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Motor Response */}
      <div style={boxStyle}>
        <div style={{ fontWeight: "bold", marginBottom: 6 }}>Motor Response (M)</div>
        <select value={motor} onChange={(e) => setMotor(parseInt(e.target.value))} style={selectStyle}>
          <option value={6}>6 - Obeys commands</option>
          <option value={5}>5 - Localizes pain</option>
          <option value={4}>4 - Withdraws to pain</option>
          <option value={3}>3 - Flexion (decorticate)</option>
          <option value={2}>2 - Extension (decerebrate)</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Result */}
      <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 12 }}>
        Total GCS: {total} → {interpretation}
      </div>

      {/* Reset button */}
      <button
        onClick={reset}
        style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #888" }}
      >
        Reset
      </button>
    </div>
  );
}
