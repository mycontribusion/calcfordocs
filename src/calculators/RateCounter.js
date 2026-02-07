import { useState, useEffect } from "react";
import "./CalculatorShared.css";

function TapCounter() {
  const [taps, setTaps] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [blink, setBlink] = useState(false);

  const handleTap = () => {
    if (!isRunning) return;
    setTaps((prev) => prev + 1);
    setBlink(true);
    setTimeout(() => setBlink(false), 120);
  };

  const startCounter = () => {
    setTaps(0);
    setDurationSec(0);
    setTimeLeft(selectedDuration);
    setIsRunning(true);
  };

  const resetCounter = () => {
    setTaps(0);
    setDurationSec(0);
    setTimeLeft(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setDurationSec((d) => d + 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const ratePerMin =
    durationSec > 0 ? (taps / durationSec) * 60 : 0;

  return (
    <div
      className="calc-container"
      onClick={handleTap}
      style={{
        cursor: isRunning ? "pointer" : "default",
        // border: "1px solid #ccc", // handled by calc-container
        // borderRadius: "12px", // handled by calc-container
        padding: "1.5rem",
        // margin: "1rem 0", // handled by calc-container (margin: 1rem auto)

        minHeight: "360px",               // ✅ taller tap area
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        backgroundColor: blink
          ? "#e8ffe8"
          : isRunning
            ? "#dc091e"
            : "#015c9c",

        color: "white",
        userSelect: "none",
        transition: "0.15s",
      }}
    >
      {/* Header */}
      <div>
        <h3 className="calc-title" style={{ marginTop: 0, color: 'white' }}>Tap Counter</h3>

        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Duration:</strong>{" "}
          {isRunning ? (
            <span style={{ opacity: 0.7 }}>
              {selectedDuration} sec
            </span>
          ) : (
            <select
              className="calc-select"
              value={selectedDuration}
              onChange={(e) =>
                setSelectedDuration(Number(e.target.value))
              }
              onClick={(e) => e.stopPropagation()}
              style={{ width: 'auto', display: 'inline-block', marginLeft: 8 }}
            >
              <option value={10}>10 sec</option>
              <option value={15}>15 sec</option>
              <option value={20}>20 sec</option>
              <option value={30}>30 sec</option>
              <option value={60}>60 sec</option>
            </select>
          )}
        </div>
      </div>

      {/* 🔥 Large central tap zone */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          fontSize: "18px",
          lineHeight: "30px",
        }}
      >
        <div><strong>Taps:</strong> {taps}</div>
        <div><strong>Time remaining:</strong> {timeLeft} sec</div>
        <div>
          <strong>Rate:</strong>{" "}
          {ratePerMin.toFixed(1)} / min
        </div>
      </div>

      {/* Controls */}
      <div style={{ textAlign: "center" }}>
        {!isRunning ? (
          <button
            className="calc-btn-reset"
            style={{ fontSize: "18px", width: 'auto', display: 'inline-block', padding: '10px 30px' }}
            onClick={(e) => {
              e.stopPropagation();
              startCounter();
            }}
          >
            ▶ Start
          </button>
        ) : (
          <button
            className="calc-btn-reset"
            style={{ fontSize: "14px", width: 'auto', display: 'inline-block', padding: '10px 30px' }}
            onClick={(e) => {
              e.stopPropagation();
              resetCounter();
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {/* Instruction */}
      {isRunning && (
        <div
          style={{
            marginTop: "0.8rem",
            fontSize: "14px",
            opacity: 0.9,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Tap anywhere inside the red area for each beat or breath.
        </div>
      )}
    </div>
  );
}

export default TapCounter;
