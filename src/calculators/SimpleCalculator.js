import React, { useCallback, useMemo } from 'react';
import useCalculator from './useCalculator';
import './CalculatorShared.css';

const INITIAL_STATE = {
  input: '',
  history: '',
  hasError: false,
  cursorPos: 1
};

export default function SimpleCalculator() {
  const { values, updateFields, reset } = useCalculator(INITIAL_STATE);
  const { input, history, hasError, cursorPos } = values;

  const handleDigit = useCallback((digit) => {
    if (hasError) return;
    const newInput = input.slice(0, cursorPos) + digit + input.slice(cursorPos);
    updateFields({
      input: newInput,
      cursorPos: cursorPos + String(digit).length
    });
  }, [input, cursorPos, hasError, updateFields]);

  const sanitizeExpression = (expr) => {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/%/g, '/100')
      .replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)')
      .replace(/√\(/g, 'Math.sqrt(');
  };

  const handleOperator = useCallback((op) => {
    if (hasError) return;
    // Insert operator at cursor position
    const char = ` ${op} `;
    const newInput = input.slice(0, cursorPos) + char + input.slice(cursorPos);
    updateFields({
      input: newInput,
      cursorPos: cursorPos + char.length
    });
  }, [input, cursorPos, hasError, updateFields]);

  const handleClear = useCallback(() => {
    reset();
  }, [reset]);

  const handleEquals = useCallback(() => {
    if (hasError) return;
    try {
      const expression = sanitizeExpression(input); // Expression is now just input
      // eslint-disable-next-line no-eval
      const result = eval(expression);
      const resStr = String(Number(result).toFixed(2).replace(/\.00$/, ''));
      updateFields({
        input: resStr,
        history: input + ' =', // Store old in history for display
        hasError: false,
        cursorPos: resStr.length
      });
    } catch (e) {
      updateFields({ input: 'Error', hasError: true, cursorPos: 5 });
    }
  }, [input, hasError, updateFields]);

  const handleParentheses = useCallback(() => {
    const combined = history + input;
    const openCount = combined.split('(').length - 1;
    const closeCount = combined.split(')').length - 1;
    const char = openCount > closeCount ? ')' : '(';
    updateFields({
      input: input.slice(0, cursorPos) + char + input.slice(cursorPos),
      cursorPos: cursorPos + 1
    });
  }, [input, history, cursorPos, updateFields]);

  const handleSqrt = useCallback(() => {
    if (hasError) return;
    updateFields({
      input: input.slice(0, cursorPos) + '√' + input.slice(cursorPos),
      cursorPos: cursorPos + 1
    });
  }, [input, cursorPos, hasError, updateFields]);

  const handleBackspace = useCallback(() => {
    if (hasError) return;
    if (cursorPos > 0) {
      const newInput = input.slice(0, cursorPos - 1) + input.slice(cursorPos);
      updateFields({
        input: newInput || (history ? '' : '0'),
        cursorPos: Math.max(0, cursorPos - 1)
      });
    } else if (history.length > 0) {
      const newHistory = history.trimEnd();
      updateFields({
        history: newHistory.slice(0, -1).trimEnd() + (newHistory.slice(0, -1).length > 0 ? ' ' : ''),
        cursorPos: 0
      });
    }
  }, [input, history, cursorPos, hasError, updateFields]);

  const liveResult = useMemo(() => {
    if (hasError) return null;
    try {
      const expression = sanitizeExpression(history + input);
      if (!/[0-9]/.test(expression)) return null;
      // eslint-disable-next-line no-eval
      const res = eval(expression);
      return isFinite(res) ? String(Number(res).toFixed(2).replace(/\.00$/, '')) : null;
    } catch {
      return null;
    }
  }, [input, history, hasError]);

  const displayRef = React.useRef(null);

  const setCursorAt = (index) => {
    updateFields({ cursorPos: index });
  };

  React.useEffect(() => {
    if (displayRef.current) {
      // Find the cursor element and ensure it's visible in the scrolling display
      const cursorEl = displayRef.current.querySelector('.calc-cursor');
      if (cursorEl) {
        cursorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [cursorPos, history, input]);

  return (
    <div className="calc-container simple-calc">
      <div className="calc-display-group" style={{ textAlign: 'right', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="calc-history" style={{ minHeight: '1.2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          {history}
        </div>
        <div
          ref={displayRef}
          className={`calc-main-display ${hasError ? 'error' : ''}`}
          style={{
            transition: 'all 0.2s ease',
            textAlign: 'right',
            fontSize: '1.6rem',
            opacity: 0.9,
            fontWeight: '600',
            direction: 'ltr',
            cursor: 'text',
            display: 'block',
            position: 'relative'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCursorAt(input.length);
            }
          }}
        >
          {input.split('').map((char, i) => (
            <React.Fragment key={i}>
              {i === cursorPos && <span className="calc-cursor"></span>}
              <span
                style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCursorAt(i);
                }}
              >
                {char}
              </span>
            </React.Fragment>
          ))}
          {cursorPos === input.length && <span className="calc-cursor"></span>}
        </div>
        <div style={{
          marginTop: '4px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '4px',
          fontSize: '1.2rem',
          color: '#16a34a',
          fontWeight: '500',
          minHeight: '1.5rem',
          opacity: 0.8
        }}>
          {(history || (input !== '0' && input !== '')) ? liveResult : ''}
        </div>
      </div>

      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="calc-key op"
          onClick={handleBackspace}
          style={{
            width: '25%',
            padding: '10px',
            borderRadius: '6px',
            fontSize: '1.2rem',
          }}
          title="Backspace"
        >
          ⌫
        </button>
      </div>

      <div className="calc-keypad">
        <button className="calc-key op" onClick={handleClear} style={{ background: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none' }}>C</button>
        <button className="calc-key op" onClick={handleParentheses}>()</button>
        <button className="calc-key op" onClick={() => handleOperator('%')}>%</button>
        <button className="calc-key op" onClick={() => handleOperator('÷')}>÷</button>

        <button className="calc-key" onClick={() => handleDigit(7)}>7</button>
        <button className="calc-key" onClick={() => handleDigit(8)}>8</button>
        <button className="calc-key" onClick={() => handleDigit(9)}>9</button>
        <button className="calc-key op" onClick={() => handleOperator('×')}>×</button>

        <button className="calc-key" onClick={() => handleDigit(4)}>4</button>
        <button className="calc-key" onClick={() => handleDigit(5)}>5</button>
        <button className="calc-key" onClick={() => handleDigit(6)}>6</button>
        <button className="calc-key op" onClick={() => handleOperator('-')}>−</button>

        <button className="calc-key" onClick={() => handleDigit(1)}>1</button>
        <button className="calc-key" onClick={() => handleDigit(2)}>2</button>
        <button className="calc-key" onClick={() => handleDigit(3)}>3</button>
        <button className="calc-key op" onClick={() => handleOperator('+')}>+</button>

        <button className="calc-key op" onClick={handleSqrt}>√</button>
        <button className="calc-key" onClick={() => handleDigit(0)}>0</button>
        <button className="calc-key" onClick={() => handleDigit('.')}>.</button>
        <button className="calc-key op" onClick={handleEquals}>=</button>
      </div>
    </div >
  );
}
