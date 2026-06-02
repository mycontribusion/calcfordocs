// src/utils/unitConversion.js
// Centralised conversion helpers used by multiple calculators.
// All functions are pure and return a numeric value (or NaN if input is invalid).

// ─── Conversion constants ────────────────────────────────────────────────────
const GLUCOSE_FACTOR   = 18.0182; // 1 mmol/L = 18.0182 mg/dL
const UREA_MMOL_TO_BUN = 2.8;     // 1 mmol/L Urea = 2.8 mg/dL BUN
const CR_UMOL_TO_MGDL  = 88.4;    // 1 µmol/L = 1/88.4 mg/dL
const CA_MMOL_TO_MGDL  = 4.0;     // 1 mmol/L Ca = 4.0 mg/dL

/** Convert a weight value to kilograms.
 * @param {number|string} value - The weight magnitude.
 * @param {string} unit - One of "kg", "g", "lb".
 * @returns {number} Weight in kilograms.
 */
export function toKg(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  switch (unit) {
    case "kg":
      return n;
    case "g":
      return n / 1000; // grams → kg
    case "lb":
      return n * 0.453592; // pounds → kg
    default:
      return NaN;
  }
}

/** Convert a height value to centimeters.
 * @param {number|string} value - The height magnitude.
 * @param {string} unit - One of "cm", "m", "in".
 * @returns {number} Height in centimeters.
 */
export function toCm(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  switch (unit) {
    case "cm":
      return n;
    case "m":
      return n * 100; // meters → cm
    case "in":
      return n * 2.54; // inches → cm
    default:
      return NaN;
  }
}

/** Convert a height value to meters (useful for BMI).
 * @param {number|string} value - Height magnitude.
 * @param {string} unit - One of "cm", "m", "inch".
 * @returns {number} Height in meters.
 */
export function toM(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  switch (unit) {
    case "m":
      return n;
    case "cm":
      return n / 100;
    case "inch":
      return n * 0.0254;
    default:
      return NaN;
  }
}

// ─── Glucose ─────────────────────────────────────────────────────────────────
/** Convert glucose to mmol/L.
 * @param {number|string} value
 * @param {string} unit - "mg/dL" | "mmol/L"
 * @returns {number} mmol/L
 */
export function toGlucoseMmol(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  return unit === "mg/dL" ? n / GLUCOSE_FACTOR : n;
}

/** Convert glucose to mg/dL.
 * @param {number|string} value
 * @param {string} unit - "mg/dL" | "mmol/L"
 * @returns {number} mg/dL
 */
export function toGlucoseMgdl(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  return unit === "mmol/L" ? n * GLUCOSE_FACTOR : n;
}

// ─── Urea / BUN ──────────────────────────────────────────────────────────────
/** Convert urea/BUN to mmol/L Urea.
 * @param {number|string} value
 * @param {string} unit - "mmol/L" | "mg/dL" (Urea) | "BUN (mg/dL)"
 * @returns {number} mmol/L
 */
export function toUreaMmol(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  if (unit === "mmol/L") return n;
  if (unit === "BUN (mg/dL)") return n / UREA_MMOL_TO_BUN;
  return n / 6; // Urea mg/dL → mmol/L (MW 60, ÷6 for mmol)
}

/** Convert urea/BUN to BUN mg/dL.
 * @param {number|string} value
 * @param {string} unit - "mmol/L" | "mg/dL" (Urea) | "BUN (mg/dL)"
 * @returns {number} BUN mg/dL
 */
export function toBunMgdl(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  if (unit === "BUN (mg/dL)") return n;
  if (unit === "mmol/L") return n * UREA_MMOL_TO_BUN;
  return n * (28 / 60); // Urea mg/dL → BUN mg/dL
}

// ─── Creatinine ──────────────────────────────────────────────────────────────
/** Convert serum creatinine to mg/dL.
 * @param {number|string} value
 * @param {string} unit - "µmol/L" | "mmol/L" | "mg/dL"
 * @returns {number} mg/dL
 */
export function toCrMgdl(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  if (unit === "mg/dL") return n;
  if (unit === "µmol/L") return n / CR_UMOL_TO_MGDL;
  if (unit === "mmol/L") return (n * 1000) / CR_UMOL_TO_MGDL;
  return NaN;
}

// ─── Calcium ─────────────────────────────────────────────────────────────────
/** Convert calcium to mg/dL.
 * @param {number|string} value
 * @param {string} unit - "mg/dL" | "mmol/L"
 * @returns {number} mg/dL
 */
export function toCalciumMgdl(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  return unit === "mmol/L" ? n * CA_MMOL_TO_MGDL : n;
}

/** Convert a mg/dL calcium value back to the target unit.
 * @param {number} mgdl
 * @param {string} unit - "mg/dL" | "mmol/L"
 * @returns {number}
 */
export function fromCalciumMgdl(mgdl, unit) {
  return unit === "mmol/L" ? mgdl / CA_MMOL_TO_MGDL : mgdl;
}

// ─── Albumin ─────────────────────────────────────────────────────────────────
/** Convert albumin to g/dL (required by Payne & Doumas formulas).
 * @param {number|string} value
 * @param {string} unit - "g/dL" | "g/L" | "mg/mL"
 * @returns {number} g/dL
 */
export function toAlbuminGdl(value, unit) {
  const n = parseFloat(value);
  if (isNaN(n)) return NaN;
  if (unit === "g/dL")  return n;
  if (unit === "g/L")   return n / 10;
  if (unit === "mg/mL") return n / 100;
  return NaN;
}
