import React, { useState } from "react";
import "./CalculatorShared.css";

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [egaWeeks, setEgaWeeks] = useState("");
  const [egaDays, setEgaDays] = useState("");

  const today = new Date();

  // Calculate EDD from LMP
  const calculateEDD = (lmpDate) => {
    const lmpObj = new Date(lmpDate);
    lmpObj.setDate(lmpObj.getDate() + 280);
    return lmpObj.toISOString().split("T")[0];
  };

  // Calculate EGA from LMP
  const calculateEGA = (lmpDate) => {
    const lmpObj = new Date(lmpDate);
    const diffDays = Math.floor((today - lmpObj) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return { weeks, days };
  };

  // Calculate LMP from EDD
  const calculateLMPfromEDD = (eddDate) => {
    const eddObj = new Date(eddDate);
    eddObj.setDate(eddObj.getDate() - 280);
    return eddObj.toISOString().split("T")[0];
  };

  // Calculate LMP from EGA
  const calculateLMPfromEGA = (weeks, days) => {
    const totalDays = weeks * 7 + days;
    const lmpObj = new Date(today);
    lmpObj.setDate(lmpObj.getDate() - totalDays);
    return lmpObj.toISOString().split("T")[0];
  };

  const handleLMPChange = (e) => {
    const value = e.target.value;
    setLmp(value);
    if (value) {
      setEdd(calculateEDD(value));
      const { weeks, days } = calculateEGA(value);
      setEgaWeeks(weeks);
      setEgaDays(days);
    }
  };

  const handleEDDChange = (e) => {
    const value = e.target.value;
    setEdd(value);
    if (value) {
      const lmpDate = calculateLMPfromEDD(value);
      setLmp(lmpDate);
      const { weeks, days } = calculateEGA(lmpDate);
      setEgaWeeks(weeks);
      setEgaDays(days);
    }
  };

  const handleEGAChange = (weeks, days) => {
    setEgaWeeks(weeks);
    setEgaDays(days);
    if (weeks || days) {
      const lmpDate = calculateLMPfromEGA(Number(weeks), Number(days));
      setLmp(lmpDate);
      setEdd(calculateEDD(lmpDate));
    }
  };

  const resetAll = () => {
    setLmp("");
    setEdd("");
    setEgaWeeks("");
    setEgaDays("");
  };

  // Clinical comments
  const getANCComment = () => {
    if (!egaWeeks) return "";
    if (egaWeeks < 28) return "ANC booking: every 4 weeks.";
    if (egaWeeks >= 28 && egaWeeks < 36) return "ANC booking: twice weekly.";
    if (egaWeeks >= 36) return "ANC booking: weekly.";
    return "";
  };

  const getTrimester = () => {
    if (!egaWeeks) return "";
    if (egaWeeks < 13) return "Trimester: First";
    if (egaWeeks < 28) return "Trimester: Second";
    return "Trimester: Third";
  };

  const getQuickening = () => {
    if (!egaWeeks) return "";
    if (egaWeeks >= 16 && egaWeeks <= 20) return "Possibility of quickening (first fetal movements).";
    return "";
  };

  return (
    <div className="calc-container">
      <h2 className="calc-title">Pregnancy Calculator</h2>

      <div className="calc-box">
        <label className="calc-label">LMP:</label>
        <input
          type="date"
          value={lmp}
          onChange={handleLMPChange}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">EDD:</label>
        <input
          type="date"
          value={edd}
          onChange={handleEDDChange}
          className="calc-input"
        />
      </div>

      <div className="calc-box">
        <label className="calc-label">EGA:</label>
        <div className="calc-ega-group">
          <div className="calc-ega-field">
            <input
              type="number"
              value={egaWeeks}
              onChange={(e) => handleEGAChange(e.target.value, egaDays)}
              className="calc-input"
            />
            <span className="calc-unit-label">weeks</span>
          </div>
          <div className="calc-ega-field">
            <input
              type="number"
              value={egaDays}
              onChange={(e) => handleEGAChange(egaWeeks, e.target.value)}
              className="calc-input"
            />
            <span className="calc-unit-label">days</span>
          </div>
        </div>
      </div>

      <button onClick={resetAll} className="calc-btn-reset">
        Reset
      </button>

      {/* Clinical Comments */}
      {(egaWeeks !== "") && (
        <div className="calc-result" style={{ marginTop: 16 }}>
          <p>{getANCComment()}</p>
          <p>{getTrimester()}</p>
          <p>{getQuickening()}</p>
        </div>
      )}
    </div>
  );
}
