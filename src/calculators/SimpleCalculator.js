import { useState } from "react";

export default function SimpleCalculator() {
  const [display, setDisplay] = useState("");

  function append(value) {
    setDisplay((prev) => prev + value);
  }

  function clearDisplay() {
    setDisplay("");
  }

  function calculate() {
    try {
      const sanitized = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      const result = Function(`return ${sanitized}`)();
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
      } else {
        setDisplay(String(result));
      }
    } catch {
      setDisplay("Error");
    }
  }

  function squareRoot() {
    const value = parseFloat(display);
    if (isNaN(value) || value < 0) {
      setDisplay("Error");
    } else {
      setDisplay(String(Math.sqrt(value)));
    }
  }

  return (
    <div style={{ maxWidth: "220px", border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
      <h3 style={{ textAlign: "center" }}>Calculator</h3>

      <input
        type="text"
        value={display}
        readOnly
        style={{
          width: "100%",
          marginBottom: "8px",
          padding: "6px",
          fontSize: "1rem",
          textAlign: "right"
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
        <button onClick={clearDisplay}>C</button>
        <button onClick={squareRoot}>√</button>
        <button onClick={() => append("÷")}>÷</button>
        <button onClick={() => append("×")}>×</button>

        <button onClick={() => append("7")}>7</button>
        <button onClick={() => append("8")}>8</button>
        <button onClick={() => append("9")}>9</button>
        <button onClick={() => append("-")}>−</button>

        <button onClick={() => append("4")}>4</button>
        <button onClick={() => append("5")}>5</button>
        <button onClick={() => append("6")}>6</button>
        <button onClick={() => append("+")}>+</button>

        <button onClick={() => append("1")}>1</button>
        <button onClick={() => append("2")}>2</button>
        <button onClick={() => append("3")}>3</button>
        <button onClick={calculate}>=</button>

        <button onClick={() => append("0")}>0</button>
        <button onClick={() => append(".")}>.</button>
      </div>
    </div>
  );
}
