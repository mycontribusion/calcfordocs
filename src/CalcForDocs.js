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
import Feedback from "./Feedback";

function CalcForDocs() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [feedbackState, setFeedbackState] = useState(false);

  const toggleCalc = (id) => {
    setActiveCalc((prev) => (prev === id ? null : id));
  };

  const toggleContact = () => {
    setFeedbackState(!feedbackState);
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
      default: return null;
    }
  };

  return (
    <div className="calcfordocs">
      <div className="twoheader">
        <h1 className="title">CalcForDocs</h1>
        <div className="contactus" onClick={toggleContact}>
          Contact us
        </div>
      </div>

      <div className="button-grid">
        {calcinfo.map((item) => (
          <div key={item.id} className="button-wrapper">
            <button
              className={`calc-btn ${activeCalc === item.id ? "active" : ""}`}
              onClick={() => toggleCalc(item.id)}
            >
              {item.name}
            </button>

            {activeCalc === item.id && (
              <div className="calc-row">{renderCalc(item.id)}</div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback overlay */}
      {feedbackState && (
        <div className="feedback-overlay">
          <div className="feedback-popup">
            <Feedback />
            <button className="close-btn" onClick={toggleContact}>
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalcForDocs;
