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
import ApgarScore from "./ApgarScore";
import ParklandFormula from "./ParklandFormula";
import DextroseFortifier from "./DextroseFortifier";
import ElectrolyteBuilder from "./ElectrolyteBuilder";
import DrugVolumeCalculator from "./DrugVolumeCalculator";
import ElectrolyteUnitConverter from "./ElectrolyteUnitConverter";

/* 🔑 Calculator Map */
const CALCULATOR_MAP = {
  lab_converter: UniversalLabConverter,
  hypokalemia_correction: HypokalemiaCorrection,
  glucose_converter: GlucoseConverter,
  urea_creatinine_ratio: UreaCrRatio,
  corrected_calcium: CorrectedCalcium,
  egfr_calculator: EGFRCalculator,
  serum_osmolality: SerumOsmolalityCalculator,
  corrected_sodium: CorrectedSodium,
  anion_gap_delta_ratio: AnionGapDeltaRatio,
  calcium_phosphate_product: CalciumPhosphateProduct,
  hyponatremia_correction: HyponatremiaCorrection,
  dosage_calculator: DrugDosageCalculator,
  iv_infusion_rate: IVInfusionCalculator,
  blood_volume_estimator: EstimatedBloodVolume,
  fluid_correction: FluidCorrection,
  timer_calculator: RateCounter,
  rule_of_nines: RuleOfNines,
  cardiac_axis: AxisInterpreter,
  ecg_waveforms: ECGInterpreter,
  map_calculator: MapCalculator,
  heart_failure_framingham: HeartFailureFramingham,
  wells_dvt_score: WellsDVTScore,
  wells_pe_score: WellsScorePE,
  af_stroke_risk_cha2ds2vasc: CHA2DS2VASc,
  shock_index: ShockIndex,
  pediatric_age_estimator: MilestoneAgeEstimator,
  pediatric_anemia_correction: PediatricTransfusionCalculator,
  pediatric_weight_calc: WeightEstimator,
  ballard_score: BallardScore,
  pregnancy_calculator: ExpectedGestationalAge,
  gestational_age_uss: USSBasedGestationalAge,
  pregnancy_lmp_from_uss: LMPFromUSS,
  bishop_score: BishopScore,
  bmi_calculator: BMICalculator,
  gcs_calculator: GCSCalculator,
  sofa_score: SOFA,
  spo2_fio2_ratio: SpO2FiO2Ratio,
  simple_calculator: SimpleCalculator,
  curb65_score: CURB65Calculator,
  stroke_score_siriraj: SirirajScore,
  dar_risk_assessment: DAR2026RiskCalculator,
  mmse_calculator: MMSECalculator,
  ipss_score: IPSSCalculator,
  apgar_score: ApgarScore,
  parkland_formula: ParklandFormula,
  dextrose_fortifier: DextroseFortifier,
  electrolyte_builder: ElectrolyteBuilder,
  drug_volume_calc: DrugVolumeCalculator,
  electrolyte_unit_conv: ElectrolyteUnitConverter,
};

export default function CalculatorRenderer({ id }) {
  const Component = CALCULATOR_MAP[id];
  return Component ? <Component /> : null;
}