import "./CalcForDocs.css";
import { useState, useEffect } from "react";
import calcinfo from "./calculators/calcinfo.json";

// Calculator Imports
import AxisInterpreter from "./calculators/AxisInterpreter";
import BMICalculator from "./calculators/BMICalculator";
import ECGInterpreter from "./calculators/ECGInterpreter";
import FluidCorrection from "./calculators/FluidCorrection";
import GCSCalculator from "./calculators/GCSCalculator";
import GlucoseConverter from "./calculators/GlucoseConverter";
import HeartFailureFramingham from "./calculators/HeartFailureFramingham";
import MapCalculator from "./calculators/MAPCalculator";
import WeightEstimator from "./calculators/WeightEstimator";
import HypokalemiaCorrection from "./calculators/HypokalemiaCorrection";
import EstimatedBloodVolume from "./calculators/EstimatedBloodVolume";
import PediatricTransfusionCalculator from "./calculators/PediatricTransfusionCalculator";
import MilestoneAgeEstimator from "./calculators/MilestoneAgeEstimator";
import EGFRCalculator from "./calculators/EGFRCalculator";
import Feedback from "./Feedback";
import DrugDosageCalculator from "./calculators/DrugDosageCalculator";
import IVInfusionCalculator from "./calculators/IVInfusionCalculator";
import SerumOsmolalityCalculator from "./calculators/SerumOsmolalityCalculator";
import ExpectedGestationalAge from "./calculators/ExpectedGestationalAge";
import USSBasedGestationalAge from "./calculators/USSBasedGestationalAge";
import LMPFromUSS from "./calculators/LMPFromUSS";
import RateCounter from "./calculators/RateCounter";
import BallardScore from "./calculators/BallardScore";
import AnionGapCalculator from "./calculators/AnionGapCalculator";
import UreaCrRatio from "./calculators/UreaCrRatio";
import CorrectedCalcium from "./calculators/CorrectedCalcium";
import WellsDVTScore from "./calculators/WellsDVTScore";
import WellsScorePE from "./calculators/WellsPEScore";
import ShockIndex from "./calculators/ShockIndex";
import CorrectedSodium from "./calculators/CorrectedNa";
import AnionGapDeltaRatio from "./calculators/AnionGapDeltaRatio";
import CalciumPhosphateProduct from "./calculators/CalciumPhosphateProduct";
import RuleOfNines from "./calculators/RuleOfNines";
import CHA2DS2VASc from "./calculators/CHA2DS2VASc";
import SOFA from "./calculators/SOFA";
import BishopScore from "./calculators/BishopScore";
import HyponatremiaCorrection from "./calculators/HyponatremiaCorrection";
import SpO2FiO2Ratio from "./calculators/SpO2FiO2Ratio";
import SimpleCalculator from "./calculators/SimpleCalculator";

function CalcForDocs() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [theme, setTheme] = useState("light");

  /* 🔄 UPDATE STATES */
  const [updateWaiting, setUpdateWaiting] = useState(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  /* Detect System Theme & Listen for SW Updates */
  useEffect(() => {
    // Theme Detection
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");

    // Listen for the custom "swUpdateAvailable" event from index.js
    const handleUpdateFound = (event) => {
      setUpdateWaiting(event.detail.waiting);
      setShowUpdateBanner(true);
    };

    window.addEventListener("swUpdateAvailable", handleUpdateFound);
    return () => window.removeEventListener("swUpdateAvailable", handleUpdateFound);
  }, []);

  /* 🛠️ HANDLERS */
  const handleUpdateNow = () => {
    if (updateWaiting) {
      updateWaiting.postMessage({ type: "SKIP_WAITING" });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  };

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));
  const toggleFeedback = () => setShowFeedback(!showFeedback);
  const toggleUpdate = () => setShowUpdate(!showUpdate);
  const toggleCalc = (id) => setActiveCalc((prev) => (prev === id ? null : id));

  const renderCalc = (id) => {
    switch (id) {
      case "j": return <HypokalemiaCorrection />;
      case "d": return <GlucoseConverter />;
      case "q1": return <AnionGapCalculator />;
      case "w": return <UreaCrRatio />;
      case "x": return <CorrectedCalcium />;
      case "n": return <EGFRCalculator />;
      case "q": return <SerumOsmolalityCalculator />;
      case "correctna": return <CorrectedSodium />;
      case "agdr": return <AnionGapDeltaRatio />;
      case "cak": return <CalciumPhosphateProduct />;
      case "lowna": return <HyponatremiaCorrection />;
      case "o": return <DrugDosageCalculator />;
      case "p": return <IVInfusionCalculator />;
      case "f": return <EstimatedBloodVolume />;
      case "g": return <FluidCorrection />;
      case "u": return <RateCounter />;
      case "9rule": return <RuleOfNines />;
      case "b": return <AxisInterpreter />;
      case "c": return <ECGInterpreter />;
      case "e": return <MapCalculator />;
      case "h": return <HeartFailureFramingham />;
      case "welldvt": return <WellsDVTScore />;
      case "wellpe": return <WellsScorePE />;
      case "afstroke": return <CHA2DS2VASc />;
      case "shock": return <ShockIndex />;
      case "k": return <MilestoneAgeEstimator />;
      case "l": return <PediatricTransfusionCalculator />;
      case "m": return <WeightEstimator />;
      case "v": return <BallardScore />;
      case "r": return <ExpectedGestationalAge />;
      case "s": return <USSBasedGestationalAge />;
      case "t": return <LMPFromUSS />;
      case "bs": return <BishopScore />;
      case "a": return <BMICalculator />;
      case "i": return <GCSCalculator />;
      case "sofa": return <SOFA />;
      case "sfr": return <SpO2FiO2Ratio />;
      case "sc": return <SimpleCalculator />;
      default: return null;
    }
  };

  return (
    <div className={`calcfordocs ${theme}`}>
      
      {/* 🔔 AUTOMATIC UPDATE BANNER */}
      {showUpdateBanner && (
        <div className="update-banner">
          <div className="update-content">
            <p><strong>Update Available!</strong> New features are ready.</p>
            <div className="update-btns">
              <button className="update-confirm" onClick={handleUpdateNow}>Update Now</button>
              <button className="update-cancel" onClick={() => setShowUpdateBanner(false)}>Later</button>
            </div>
          </div>
        </div>
      )}

      <div className="head-contact">
        <h2 className="title">CalcForDocs</h2>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            style={{ height: "10px", width: "10px", fontSize: "8px" }}
            className="calc-btn"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div className="contactus" onClick={toggleUpdate} style={{ fontSize: "9px", opacity: 0.7, cursor: "pointer" }}>
              Update
            </div>
            <div className="contactus" onClick={toggleFeedback}>
              Contact-us
            </div>
          </div>
        </div>

        {/* Feedback Popup */}
        {showFeedback && (
          <div className="feedback-overlay">
            <div className="feedback-popup">
              <Feedback />
              <button className="close-btn" onClick={toggleFeedback}>✖ Close</button>
            </div>
          </div>
        )}

        {/* Manual/Hard Update Modal */}
        {showUpdate && (
          <div className="feedback-overlay">
            <div className="feedback-popup">
              <h3>🔄 Hard Reset CalcForDocs</h3>
              <p style={{fontSize: '12px', marginBottom: '10px'}}>Use this if the app is stuck or not showing new features.</p>
              <ol style={{ textAlign: "left", lineHeight: "1.6", fontSize: '13px' }}>
                <li>Uninstall CalcForDocs and close all tabs</li>
                <li>Open device <b>Settings</b> &gt; <b>Site settings</b></li>
                <li>Locate <b>calcfordocs.vercel.app</b></li>
                <li>Tap <b>Clear data / Delete files</b></li>
                <li>Reopen the website</li>
              </ol>
              <button className="close-btn" onClick={toggleUpdate}>✖ Close</button>
            </div>
          </div>
        )}
      </div>

      <div className="button-grid">
        {calcinfo.map((item) => (
          <div key={item.id} className="button-wrapper-container">
            <div className="button-wrapper">
              <button
                className={`calc-btn ${activeCalc === item.id ? "active" : ""}`}
                onClick={() => toggleCalc(item.id)}
              >
                {item.name}
              </button>
            </div>
            {activeCalc === item.id && (
              <div className="calc-row">{renderCalc(item.id)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalcForDocs;