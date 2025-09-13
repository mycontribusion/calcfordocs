import { useState, useEffect } from "react";

function RateCounter() {
  const [taps, setTaps] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [durationSec, setDurationSec] = useState(0);

  const handleTap = () => {
    const now = Date.now();

    if (taps === 0) {
      setStartTime(now);
      setEndTime(null);
      setDurationSec(0);
    } else {
      setEndTime(now);
    }

    setTaps((prev) => prev + 1);
  };

  const resetCounter = (e) => {
    e.stopPropagation(); // ✅ prevents reset from being counted as tap
    setTaps(0);
    setStartTime(null);
    setEndTime(null);
    setDurationSec(0);
  };

  // ⏱ Update duration as time passes
  useEffect(() => {
    let timer;
    if (taps > 0 && !endTime) {
      timer = setInterval(() => {
        setDurationSec((Date.now() - startTime) / 1000);
      }, 200);
    } else if (endTime && startTime) {
      setDurationSec((endTime - startTime) / 1000);
    }

    return () => clearInterval(timer);
  }, [taps, startTime, endTime]);

  const ratePerMin =
    taps > 1 && durationSec > 0 ? (taps / durationSec) * 60 : 0;

  return (
    <div className="tap-area" onClick={handleTap}>
      <h2>Tap Counter</h2>
      <p><strong>Taps:</strong> {taps}</p>
      <p><strong>Duration:</strong> {durationSec.toFixed(1)} sec</p>
      <p><strong>Rate:</strong> {ratePerMin.toFixed(1)} per min</p>

      <button className="button" onClick={resetCounter}>
        Reset
      </button>
    </div>
  );
}

export default RateCounter;
