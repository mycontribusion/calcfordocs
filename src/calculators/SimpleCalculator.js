import { useState, useRef, useEffect } from "react";
import "./CalculatorShared.css";

export default function SmartCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const textareaRef = useRef(null);

  // Evaluate input dynamically
  useEffect(() => {
    try {
      if (!input) {
        setResult("");
        return;
      }

      let sanitized = input.replace(/×/g, "*").replace(/÷/g, "/");

      if (!/^[0-9+\-*/().√]*$/.test(sanitized)) {
        setResult("Error");
        return;
      }

      sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");

      // eslint-disable-next-line no-new-func
      const evalResult = Function(`"use strict"; return (${sanitized})`)();
      setResult(evalResult);
    } catch {
      setResult("Error");
    }
  }, [input]);

  // Insert value at cursor
  const insertAtCursor = (value) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = input.slice(0, start) + value + input.slice(end);
    setInput(newValue);

    setTimeout(() => {
      textarea.setSelectionRange(start + value.length, start + value.length);
      textarea.focus();
    }, 0);
  };

  // Clear everything
  const handleClear = () => {
    setInput("");
    setResult("");
  };

  // Backspace
  const handleBackspace = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === 0 && end === 0) return;

    const newValue = input.slice(0, start - 1) + input.slice(end);
    setInput(newValue);

    setTimeout(() => {
      textarea.setSelectionRange(start - 1, start - 1);
      textarea.focus();
    }, 0);
  };

  // Square root insert
  const handleSquareRoot = () => {
    insertAtCursor("√");
  };

  // Smart parentheses insert
  const handleParentheses = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const inputBeforeCursor = input.slice(0, start);

    // Count open and close brackets
    const openCount = (inputBeforeCursor.match(/\(/g) || []).length;
    const closeCount = (inputBeforeCursor.match(/\)/g) || []).length;

    if (openCount > closeCount) {
      insertAtCursor(")");
    } else {
      insertAtCursor("(");
    }
  };

  // Transfer result to replace input
  const transferResultToInput = () => {
    if (result === "Error" || result === "") return;
    setInput(String(result));
    setTimeout(() => {
      const textarea = textareaRef.current;
      textarea.setSelectionRange(result.toString().length, result.toString().length);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="calc-container" style={{ maxWidth: "280px" }}>

      <textarea
        ref={textareaRef}
        value={input}
        readOnly
        onKeyDown={(e) => e.preventDefault()} // disable keyboard input
        rows={2}
        className="calc-grid-display"
      />

      <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: "6px" }}>
        {result !== "" && <span>= {result}</span>}
      </div>

      <div className="calc-keypad" style={{ height: "300px" }}>
        <button className="calc-key" onClick={handleClear}>C</button>
        <button className="calc-key" onClick={handleBackspace}>⌫</button>
        <button className="calc-key" onClick={handleSquareRoot}>√</button>
        <button className="calc-key" onClick={() => insertAtCursor("÷")}>÷</button>

        <button className="calc-key" onClick={() => insertAtCursor("7")}>7</button>
        <button className="calc-key" onClick={() => insertAtCursor("8")}>8</button>
        <button className="calc-key" onClick={() => insertAtCursor("9")}>9</button>
        <button className="calc-key" onClick={() => insertAtCursor("×")}>×</button>

        <button className="calc-key" onClick={() => insertAtCursor("4")}>4</button>
        <button className="calc-key" onClick={() => insertAtCursor("5")}>5</button>
        <button className="calc-key" onClick={() => insertAtCursor("6")}>6</button>
        <button className="calc-key" onClick={() => insertAtCursor("-")}>−</button>

        <button className="calc-key" onClick={() => insertAtCursor("1")}>1</button>
        <button className="calc-key" onClick={() => insertAtCursor("2")}>2</button>
        <button className="calc-key" onClick={() => insertAtCursor("3")}>3</button>
        <button className="calc-key" onClick={() => insertAtCursor("+")}>+</button>

        <button className="calc-key" onClick={() => insertAtCursor("0")}>0</button>
        <button className="calc-key" onClick={() => insertAtCursor(".")}>.</button>
        <button className="calc-key" onClick={handleParentheses}>()</button>
        <button className="calc-key" onClick={transferResultToInput}>→</button>
      </div>
    </div>
  );
}
