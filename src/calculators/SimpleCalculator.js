import { useState, useRef, useEffect } from "react";

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
    <div style={{ maxWidth: "280px", border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
      <h3 style={{ textAlign: "center" }}>Calculator</h3>

      <textarea
        ref={textareaRef}
        value={input}
        readOnly
        onKeyDown={(e) => e.preventDefault()} // disable keyboard input
        rows={2}
        style={{ width: "100%", fontSize: "1rem", textAlign: "right", marginBottom: "6px", cursor: "text" }}
      />

      <div style={{ textAlign: "right", fontWeight: "bold", marginBottom: "6px" }}>
        {result !== "" && <span>= {result}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
        <button onClick={handleClear}>C</button>
        <button onClick={handleBackspace}>⌫</button>
        <button onClick={handleSquareRoot}>√</button>
        <button onClick={() => insertAtCursor("÷")}>÷</button>

        <button onClick={() => insertAtCursor("7")}>7</button>
        <button onClick={() => insertAtCursor("8")}>8</button>
        <button onClick={() => insertAtCursor("9")}>9</button>
        <button onClick={() => insertAtCursor("×")}>×</button>

        <button onClick={() => insertAtCursor("4")}>4</button>
        <button onClick={() => insertAtCursor("5")}>5</button>
        <button onClick={() => insertAtCursor("6")}>6</button>
        <button onClick={() => insertAtCursor("-")}>−</button>

        <button onClick={() => insertAtCursor("1")}>1</button>
        <button onClick={() => insertAtCursor("2")}>2</button>
        <button onClick={() => insertAtCursor("3")}>3</button>
        <button onClick={() => insertAtCursor("+")}>+</button>

        <button onClick={() => insertAtCursor("0")}>0</button>
        <button onClick={() => insertAtCursor(".")}>.</button>
        <button onClick={handleParentheses}>()</button>
        <button onClick={transferResultToInput}>→</button>
      </div>
    </div>
  );
}
