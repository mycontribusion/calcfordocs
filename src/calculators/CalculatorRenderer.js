import { Suspense, lazy } from "react";
import ChunkErrorBoundary from "../components/ChunkErrorBoundary";
// calculators/CalculatorRenderer.jsx

const AxisInterpreter = lazy(() => import("./AxisInterpreter"));
const BMICalculator = lazy(() => import("./BMICalculator"));
const ECGInterpreter = lazy(() => import("./ECGInterpreter"));
const FluidCorrection = lazy(() => import("./FluidCorrection"));
const GCSCalculator = lazy(() => import("./GCSCalculator"));
const GlucoseConverter = lazy(() => import("./GlucoseConverter"));
const HeartFailureFramingham = lazy(() => import("./HeartFailureFramingham"));
const MapCalculator = lazy(() => import("./MAPCalculator"));
const WeightEstimator = lazy(() => import("./WeightEstimator"));
const HypokalemiaCorrection = lazy(() => import("./HypokalemiaCorrection"));
const EstimatedBloodVolume = lazy(() => import("./EstimatedBloodVolume"));
const PediatricTransfusionCalculator = lazy(() => import("./PediatricTransfusionCalculator"));
const MilestoneAgeEstimator = lazy(() => import("./MilestoneAgeEstimator"));
const EGFRCalculator = lazy(() => import("./EGFRCalculator"));
const DrugDosageCalculator = lazy(() => import("./DrugDosageCalculator"));
const IVInfusionCalculator = lazy(() => import("./IVInfusionCalculator"));
const SerumOsmolalityCalculator = lazy(() => import("./SerumOsmolalityCalculator"));
const ExpectedGestationalAge = lazy(() => import("./ExpectedGestationalAge"));
const RateCounter = lazy(() => import("./RateCounter"));
const BallardScore = lazy(() => import("./BallardScore"));
const UreaCrRatio = lazy(() => import("./UreaCrRatio"));
const CorrectedCalcium = lazy(() => import("./CorrectedCalcium"));
const WellsDVTScore = lazy(() => import("./WellsDVTScore"));
const WellsScorePE = lazy(() => import("./WellsPEScore"));
const ShockIndex = lazy(() => import("./ShockIndex"));
const CorrectedSodium = lazy(() => import("./CorrectedNa"));
const AnionGapDeltaRatio = lazy(() => import("./AnionGapDeltaRatio"));
const CalciumPhosphateProduct = lazy(() => import("./CalciumPhosphateProduct"));
const RuleOfNines = lazy(() => import("./RuleOfNines"));
const CHA2DS2VASc = lazy(() => import("./CHA2DS2VASc"));
const SOFA = lazy(() => import("./SOFA"));
const BishopScore = lazy(() => import("./BishopScore"));
const HyponatremiaCorrection = lazy(() => import("./HyponatremiaCorrection"));
const SpO2FiO2Ratio = lazy(() => import("./SpO2FiO2Ratio"));
const SimpleCalculator = lazy(() => import("./SimpleCalculator"));
const CURB65Calculator = lazy(() => import("./CURB65Calculator"));
const SirirajScore = lazy(() => import("./SirirajScore"));
const DAR2026RiskCalculator = lazy(() => import("./DAR2026RiskCalculator"));
const MMSECalculator = lazy(() => import("./MMSECalculator"));
const IPSSCalculator = lazy(() => import("./IPSSCalculator"));
const UniversalLabConverter = lazy(() => import("./UniversalLabConverter"));
const ApgarScore = lazy(() => import("./ApgarScore"));
const ParklandFormula = lazy(() => import("./ParklandFormula"));
const DextroseFortifier = lazy(() => import("./DextroseFortifier"));
const DrugVolumeCalculator = lazy(() => import("./DrugVolumeCalculator"));
const ElectrolyteUnitConverter = lazy(() => import("./ElectrolyteUnitConverter"));

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
  drug_volume_calc: DrugVolumeCalculator,
  electrolyte_unit_conv: ElectrolyteUnitConverter,
};

export default function CalculatorRenderer({ id }) {
  const Component = CALCULATOR_MAP[id];
  return Component ? (
    <ChunkErrorBoundary>
      <Suspense fallback={<div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Loading calculator...</div>}>
        <Component />
      </Suspense>
    </ChunkErrorBoundary>
  ) : null;
}