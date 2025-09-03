// src/calculators/AxisInterpreter.js
import { useState } from "react";

export default function AxisInterpreter() {
  const [lead1, setLead1] = useState("positive");
  const [leadAvf, setLeadAvf] = useState("positive");
  const [result, setResult] = useState("");

  function interpretAxis(lead1, leadAvf) {
    let interpretation = "Normal Axis (0° to +90°).";
    let equiphasicLead = "";

    if (lead1 === "positive" && leadAvf === "positive") {
      interpretation = "Normal Axis (0° to +90°).";
      equiphasicLead = "Lead aVL";
    } else if (lead1 === "positive" && leadAvf === "negative") {
      interpretation = "Left Axis Deviation (-30° to -90°).";
      equiphasicLead = "Lead II";
    } else if (lead1 === "negative" && leadAvf === "positive") {
      interpretation = "Right Axis Deviation (+90° to +180°).";
      equiphasicLead = "Lead III";
    } else if (lead1 === "negative" && leadAvf === "negative") {
      interpretation = "Extreme Axis Deviation (-90° to ±180°).";
      equiphasicLead = "Lead aVR";
    }

    return `Interpretation: ${interpretation}\nEquiphasic Lead: ${equiphasicLead}`;
  }

  function handleInterpret() {
    setResult(interpretAxis(lead1, leadAvf));
  }

  return (
    <div className="p-4 border rounded-xl shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Axis Interpreter</h2>

      <div className="mb-2">
        <label className="mr-2">Lead I:</label>
        <select
          value={lead1}
          onChange={(e) => setLead1(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="mr-2">Lead aVF:</label>
        <select
          value={leadAvf}
          onChange={(e) => setLeadAvf(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <button
        onClick={handleInterpret}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Interpret
      </button>

      {result && (
        <pre className="mt-2 text-sm whitespace-pre-line">{result}</pre>
      )}
    </div>
  );
}
