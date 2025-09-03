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



function App() {
  return (
    <div className="App">
      <WeightEstimator/>
      <AxisInterpreter/>
      <BMICalculator/>
      <ECGInterpreter/>
      <GCSCalculator/>
      <GlucoseConverter/>
      <HeartFailureFramingham/>
      <MapCalculator/>
      <FluidCorrection/>
      <HypokalemiaCorrection/>
      <EstimatedBloodVolume/>
      <PediatricTransfusionCalculator/>
      <MilestoneAgeEstimator/>
    </div>
  );
}

export default App;
