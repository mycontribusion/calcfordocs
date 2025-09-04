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
import calcinfo from './calcinfo.json';



function CalcForDocs() {

    const[calc, setCalc] = useState(null)

    let calcdata = calcinfo

    let calcbuttons = calcdata.map((item) => (
        <div className="button" key={item.id}>
            <button value={item.name} onClick={() => displayCalc(item.id)}>{item.name}</button>
        </div>
    ))

    const displayCalc = (id) => {
        setCalc(id)
    }

    const renderCalc = () => {
        switch (calc) {
            case 'a':
                return <BMICalculator />;
            case 'b':
                return <AxisInterpreter />;
            case 'c':
                return <ECGInterpreter />;
            case 'd':
                return <GlucoseConverter />;
            case 'e':
                return <MapCalculator />;
            case 'f':
                return <EstimatedBloodVolume />;
            case 'g':
                return <FluidCorrection />;
            case 'h':
                return <HeartFailureFramingham />;
            case 'i':
                return <GCSCalculator />;
            case 'j':
                return <HypokalemiaCorrection />;
            case 'k':
                return <MilestoneAgeEstimator />;
            case 'l':
                return <PediatricTransfusionCalculator />;
            case 'm':
                return <WeightEstimator />;
            default:
                return (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-xl">Select a calculator to get started.</p>
                    </div>
                );}}


    /*const displayCalc = (id) => {
        setCalc(id)
    }*/

    return(
        <div>
            {calcbuttons}
        <div>{renderCalc()}</div>
        </div>
    )

 /* return (
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
  );*/

}

export default CalcForDocs;
