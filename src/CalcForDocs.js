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
import CorrectedCalcium from "./calculators/CorrectedCalcium";
import WellsDVTScore from "./calculators/WellsDVTScore";
import WellsScorePE from "./calculators/WellsPEScore";
import ShockIndex from "./ShockIndex";
import CorrectedSodium from "./CorrectedNa";
import AnionGapDeltaRatio from "./AnionGapDeltaRatio";
import CalciumPhosphateProduct from "./CalciumPhosphateProduct";

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
      case "j": return <HypokalemiaCorrection />;
      case "d": return <GlucoseConverter />;
      case "q1": return <AnionGapCalculator/>;
      case "w": return <UreaCrRatio/>;
      case "x": return <CorrectedCalcium/>
      case "n": return <EGFRCalculator/>;
      case "q": return <SerumOsmolalityCalculator/>;
      case "correctna": return <CorrectedSodium/>
      case "agdr": return <AnionGapDeltaRatio/>
      case "cak": return <CalciumPhosphateProduct/>

      case "o": return <DrugDosageCalculator/>;
      case "p": return <IVInfusionCalculator/>;
      case "f": return <EstimatedBloodVolume />;
      case "g": return <FluidCorrection />;
      case "u": return <RateCounter/>;

      case "b": return <AxisInterpreter />;
      case "c": return <ECGInterpreter />;
      case "e": return <MapCalculator />;
      case "h": return <HeartFailureFramingham />;
      case "welldvt": return <WellsDVTScore/>
      case "wellpe": return <WellsScorePE/>
      case "shock": return <ShockIndex/>

      case "k": return <MilestoneAgeEstimator />;
      case "l": return <PediatricTransfusionCalculator />;
      case "m": return <WeightEstimator />;
      case "v": return <BallardScore/>;

      case "r": return <ExpectedGestationalAge/>;
      case "s": return <USSBasedGestationalAge/>;
      case "t": return <LMPFromUSS/>;

      case "a": return <BMICalculator />;
      case "i": return <GCSCalculator />;

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
