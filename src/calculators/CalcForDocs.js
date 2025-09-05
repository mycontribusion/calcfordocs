import AxisInterpreter from "./AxisInterpreter";
import BMICalculator from "./BMICalculator";
import ECGInterpreter from "./ECGInterpreter";
import FluidCorrection from "./FluidCorrection";
import GCSCalculator from "./GCSCalculator";
import GlucoseConverter from "./GlucoseConverter";
import HeartFailureFramingham from "./HeartFailureFramingham";
import MapCalculator from "./MAPCalculator";
import WeightEstimator from "./WeightEstimator";
import HypokalemiaCorrection from "./HypokalemiaCorrection";
import EstimatedBloodVolume from "./EstimatedBloodVolume";
import PediatricTransfusionCalculator from "./PediatricTransfusionCalculator";
import MilestoneAgeEstimator from "./MilestoneAgeEstimator";
import { useState } from "react";
import calcinfo from "./calcinfo.json";
import "./CalcForDocs.css";

function CalcForDocs() {
  const [calc, setCalc] = useState(null);

  const calcdata = calcinfo;

  const displayCalc = (id) => {
    setCalc(id);
  };

  const calcbuttons = calcdata.map((item) => (
    <div className="button" key={item.id}>
      <button
        value={item.name}
        onClick={() => displayCalc(item.id)}
        className={`calc-btn ${calc === item.id ? "active" : ""}`}
        aria-pressed={calc === item.id}
      >
        {item.name}
      </button>
    </div>
  ));

  const renderCalc = () => {
    switch (calc) {
      case "a":
        return <BMICalculator />;
      case "b":
        return <AxisInterpreter />;
      case "c":
        return <ECGInterpreter />;
      case "d":
        return <GlucoseConverter />;
      case "e":
        return <MapCalculator />;
      case "f":
        return <EstimatedBloodVolume />;
      case "g":
        return <FluidCorrection />;
      case "h":
        return <HeartFailureFramingham />;
      case "i":
        return <GCSCalculator />;
      case "j":
        return <HypokalemiaCorrection />;
      case "k":
        return <MilestoneAgeEstimator />;
      case "l":
        return <PediatricTransfusionCalculator />;
      case "m":
        return <WeightEstimator />;
      default:
        return (
          <div className="placeholder">
            <p className="placeholder-text">Select a calculator to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="calcfordocs">
      <header className="header">
        <h1 className="title">CalcForDocs – Medical Calculators</h1>
      </header>

      <div className="buttons-grid">{calcbuttons}</div>

      <section className="calc-render">{renderCalc()}</section>
    </div>
  );
}

export default CalcForDocs;
