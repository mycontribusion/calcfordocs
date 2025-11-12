import "./CalcForDocs.css";
import { useState } from "react";
import calcinfo from "./calculators/calcinfo.json";

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

function CalcForDocs() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  const toggleCalc = (id) => {
    setActiveCalc((prev) => (prev === id ? null : id));
  };

  const renderCalc = (id) => {
    switch (id) {
      case "a": return <BMICalculator />;
      case "b": return <AxisInterpreter />;
      case "c": return <ECGInterpreter />;
      case "d": return <GlucoseConverter />;
      case "e": return <MapCalculator />;
      case "f": return <EstimatedBloodVolume />;
      case "g": return <FluidCorrection />;
      case "h": return <HeartFailureFramingham />;
      case "i": return <GCSCalculator />;
      case "j": return <HypokalemiaCorrection />;
      case "k": return <MilestoneAgeEstimator />;
      case "l": return <PediatricTransfusionCalculator />;
      case "m": return <WeightEstimator />;
      case "n": return <EGFRCalculator/>;
      case "o": return <DrugDosageCalculator/>;
      case "p": return <IVInfusionCalculator/>;
      case "q": return <SerumOsmolalityCalculator/>;
      case "r": return <ExpectedGestationalAge/>;
      case "s": return <USSBasedGestationalAge/>;
      case "t": return <LMPFromUSS/>;
      case "u": return <RateCounter/>;
      case "v": return <BallardScore/>;
      case "q1": return <AnionGapCalculator/>;
      case "w":return <UreaCrRatio/>;

      default: return null;
    }
  };

  return (
    <div className="calcfordocs">
      <div className="head-contact">
      <h1 className="title">CalcForDocs</h1>
      <div className="contactus" onClick={toggleFeedback}>
          Contact-us
        </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div className="feedback-overlay">
          <div className="feedback-popup">
            <Feedback />
            <button className="close-btn" onClick={toggleFeedback}>
              ✖ Close
            </button>
          </div>
        </div>
      )}
      </div>

      <div className="button-grid">
        {calcinfo.map((item) => (
          <>
            {/* button in grid cell */}
            <div id={item.id} key={item.id} className="button-wrapper">
              <button
                className={`calc-btn ${activeCalc === item.id ? "active" : ""}`}
                onClick={() => toggleCalc(item.id)}
              >
                {item.name}
              </button>
            </div>

            {/* ✅ calculator gets its own full-width row */}
            {activeCalc === item.id && (
              <div className="calc-row">{renderCalc(item.id)}</div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default CalcForDocs;
