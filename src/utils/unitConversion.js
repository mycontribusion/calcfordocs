// src/utils/unitConversion.js
// Centralised conversion helpers used by multiple calculators.
// All functions are pure and return a numeric value (or NaN if input invalid).

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
