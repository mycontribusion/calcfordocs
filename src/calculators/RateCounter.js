import { useState, useEffect } from "react";

function TapCounter() {
  const [taps, setTaps] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleTap = () => {
    if (isRunning) {
      setTaps((prev) => prev + 1);
    }
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
        setTimeLeft((prev) => prev - 1);
        setDurationSec((d) => d + 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const ratePerMin =
    taps > 0 && durationSec > 0 ? (taps / durationSec) * 60 : 0;

  return (
    <div
      onClick={handleTap}
      style={{
        cursor: isRunning ? "pointer" : "default",
        fontSize: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        margin: "1rem 0",
        backgroundColor: isRunning ? "#b6f5b6" : "#f9f9f9",
        transition: "0.3s",
      }}
    >
      <h3>Tap Counter</h3>

      {!isRunning && (
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Duration (seconds):{" "}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(Number(e.target.value))}
              onClick={(e) => e.stopPropagation()}  
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </label>
        </div>
      )}

      <p><strong>Taps:</strong> {taps}</p>
      <p><strong>Time left:</strong> {timeLeft} sec</p>
      <p><strong>Rate:</strong> {ratePerMin.toFixed(1)} /min</p>

      <div style={{ marginTop: "0.5rem", fontSize: "30px" }}>
        {!isRunning ? (
          <button
            style={{ fontSize: "30px" }}
            onClick={(e) => {
              e.stopPropagation();   {/* FIXED HERE */}
              startCounter();
            }}
          >
            Start
          </button>
        ) : (
          <button
            style={{ fontSize: "30px" }}
            onClick={(e) => {
              e.stopPropagation();   {/* FIXED HERE */}
              resetCounter();
            }}
          >
            Stop & Reset
          </button>
        )}
      </div>

      <small style={{ display: "block", marginTop: "0.5rem", color: "#555" }}>
        Tap anywhere inside the green card while the timer is running.
      </small>
    </div>
  );
}

export default TapCounter;
