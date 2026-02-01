import React, { useState } from "react";

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
    <div style={{ maxWidth: "400px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>Pregnancy Calculator</h2>

      <button onClick={resetAll} style={{ width: "80%" }}>
        Reset
      </button><p></p>

      {/* LMP */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          LMP:
          <input
            type="date"
            value={lmp}
            onChange={handleLMPChange}
            style={{ marginLeft: "8px" }}
          />
        </label>
      </div>

      {/* EDD */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          EDD:
          <input
            type="date"
            value={edd}
            onChange={handleEDDChange}
            style={{ marginLeft: "8px" }}
          />
        </label>
      </div>

      {/* EGA */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          EGA:
          <input
            type="number"
            value={egaWeeks}
            onChange={(e) => handleEGAChange(e.target.value, egaDays)}
            style={{ width: "50px", marginLeft: "8px" }}
          /> weeks
          <input
            type="number"
            value={egaDays}
            onChange={(e) => handleEGAChange(egaWeeks, e.target.value)}
            style={{ width: "50px", marginLeft: "8px" }}
          /> days
        </label>
      </div>

      {/* Reset Button */}
      

      {/* Clinical Comments */}
      <div style={{ marginTop: "0px",padding: "10px", borderRadius: "6px" }}>
        <p>{getANCComment()}</p>
        <p>{getTrimester()}</p>
        <p>{getQuickening()}</p>
      </div>
    </div>
  );
}
