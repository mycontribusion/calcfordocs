// calculators/CalculatorRenderer.jsx

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
import EGFRCalculator from "./EGFRCalculator";
import DrugDosageCalculator from "./DrugDosageCalculator";
import IVInfusionCalculator from "./IVInfusionCalculator";
import SerumOsmolalityCalculator from "./SerumOsmolalityCalculator";
import ExpectedGestationalAge from "./ExpectedGestationalAge";
import USSBasedGestationalAge from "./USSBasedGestationalAge";
import LMPFromUSS from "./LMPFromUSS";
import RateCounter from "./RateCounter";
import BallardScore from "./BallardScore";
import AnionGapCalculator from "./AnionGapCalculator";
import UreaCrRatio from "./UreaCrRatio";
import CorrectedCalcium from "./CorrectedCalcium";
import WellsDVTScore from "./WellsDVTScore";
import WellsScorePE from "./WellsPEScore";
import ShockIndex from "./ShockIndex";
import CorrectedSodium from "./CorrectedNa";
import AnionGapDeltaRatio from "./AnionGapDeltaRatio";
import CalciumPhosphateProduct from "./CalciumPhosphateProduct";
import RuleOfNines from "./RuleOfNines";
import CHA2DS2VASc from "./CHA2DS2VASc";
import SOFA from "./SOFA";
import BishopScore from "./BishopScore";
import HyponatremiaCorrection from "./HyponatremiaCorrection";
import SpO2FiO2Ratio from "./SpO2FiO2Ratio";
import SimpleCalculator from "./SimpleCalculator";
import CURB65Calculator from "./CURB65Calculator";
import SirirajScore from "./SirirajScore";
import DAR2026RiskCalculator from "./DAR2026RiskCalculator";
import MMSECalculator from "./MMSECalculator";
import IPSSCalculator from "./IPSSCalculator";
import UniversalLabConverter from "./UniversalLabConverter";

/* 🔑 Calculator Map */
const CALCULATOR_MAP = {
  labconv: UniversalLabConverter,
  j: HypokalemiaCorrection,
  d: GlucoseConverter,
  q1: AnionGapCalculator,
  w: UreaCrRatio,
  x: CorrectedCalcium,
  n: EGFRCalculator,
  q: SerumOsmolalityCalculator,
  correctna: CorrectedSodium,
  agdr: AnionGapDeltaRatio,
  cak: CalciumPhosphateProduct,
  lowna: HyponatremiaCorrection,
  o: DrugDosageCalculator,
  p: IVInfusionCalculator,
  f: EstimatedBloodVolume,
  g: FluidCorrection,
  u: RateCounter,
  "9rule": RuleOfNines,
  b: AxisInterpreter,
  c: ECGInterpreter,
  e: MapCalculator,
  h: HeartFailureFramingham,
  welldvt: WellsDVTScore,
  wellpe: WellsScorePE,
  afstroke: CHA2DS2VASc,
  shock: ShockIndex,
  k: MilestoneAgeEstimator,
  l: PediatricTransfusionCalculator,
  m: WeightEstimator,
  v: BallardScore,
  r: ExpectedGestationalAge,
  s: USSBasedGestationalAge,
  t: LMPFromUSS,
  bs: BishopScore,
  a: BMICalculator,
  i: GCSCalculator,
  sofa: SOFA,
  sfr: SpO2FiO2Ratio,
  sc: SimpleCalculator,
  curb65: CURB65Calculator,
  siri: SirirajScore,
  dar: DAR2026RiskCalculator,
  mmse: MMSECalculator,
  ipss: IPSSCalculator,
};

export default function CalculatorRenderer({ id }) {
  const Component = CALCULATOR_MAP[id];
  return Component ? <Component /> : null;
}