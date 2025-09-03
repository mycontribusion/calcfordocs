// src/calculators/GCSCalculator.js
import { useState } from "react";

export default function GCSCalculator() {
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const [result, setResult] = useState("");

  function calculateGCS() {
    const total = eye + verbal + motor;

    let interpretation = "";
    if (total <= 8) {
      interpretation = "Severe head injury (GCS ≤ 8)";
    } else if (total >= 9 && total <= 12) {
      interpretation = "Moderate head injury (GCS 9 - 12)";
    } else {
      interpretation = "Mild head injury (GCS 13 - 15)";
    }

    setResult(`Total GCS: ${total} ➝ ${interpretation}`);
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">GCS Calculator</h2>

      {/* Eye Response */}
      <div className="mb-2">
        <label className="block font-medium mb-1">Eye Response (E)</label>
        <select
          value={eye}
          onChange={(e) => setEye(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        >
          <option value={4}>4 - Spontaneous</option>
          <option value={3}>3 - To speech</option>
          <option value={2}>2 - To pain</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Verbal Response */}
      <div className="mb-2">
        <label className="block font-medium mb-1">Verbal Response (V)</label>
        <select
          value={verbal}
          onChange={(e) => setVerbal(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        >
          <option value={5}>5 - Oriented</option>
          <option value={4}>4 - Confused</option>
          <option value={3}>3 - Inappropriate words</option>
          <option value={2}>2 - Incomprehensible sounds</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Motor Response */}
      <div className="mb-2">
        <label className="block font-medium mb-1">Motor Response (M)</label>
        <select
          value={motor}
          onChange={(e) => setMotor(parseInt(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        >
          <option value={6}>6 - Obeys commands</option>
          <option value={5}>5 - Localizes pain</option>
          <option value={4}>4 - Withdraws to pain</option>
          <option value={3}>3 - Flexion (decorticate)</option>
          <option value={2}>2 - Extension (decerebrate)</option>
          <option value={1}>1 - None</option>
        </select>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateGCS}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Calculate
      </button>

      {/* Result */}
      {result && <p className="mt-2 text-sm font-medium">{result}</p>}
    </div>
  );
}
