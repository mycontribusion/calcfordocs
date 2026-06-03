/**
 * CalcFields.js — Shared UI primitives for all clinical calculators.
 *
 * Single import replaces three separate boilerplate imports per file:
 *   import useCalculator from "./useCalculator"
 *   import SyncSuggestion  from "./SyncSuggestion"
 *   import "./CalculatorShared.css"
 *
 * Usage:
 *   import { useCalc, NumberField, WeightField, HeightField,
 *            CalcBox, ResetButton, ResultBox } from "./CalcFields";
 */

import "./CalculatorShared.css";          // loaded once, shared by all consumers
import useCalculator from "./useCalculator";
import SyncSuggestion from "./SyncSuggestion";

export { SyncSuggestion };

// ─── Hook re-export ───────────────────────────────────────────────────────────
/**
 * Drop-in replacement for `useCalculator`. Importing from CalcFields means
 * every calculator gets the CSS + SyncSuggestion for free.
 */
export function useCalc(initialState) {
  return useCalculator(initialState);
}

// ─── CalcBox ──────────────────────────────────────────────────────────────────
/**
 * Standard labeled section wrapper.
 * If `field`, `suggestions`, and `syncField` are all provided, renders a
 * SyncSuggestion row automatically.
 *
 * @param {string}   label      - Field label text
 * @param {string}   [field]    - Key into values/suggestions (enables SyncSuggestion)
 * @param {object}   [suggestions]
 * @param {function} [syncField]
 * @param {object}   [style]    - Extra inline styles on the wrapper div
 * @param {node}     children
 */
export function CalcBox({ label, field, suggestions, syncField, style, children }) {
  return (
    <div className="calc-box" style={style}>
      {label && <label className="calc-label">{label}</label>}
      {field && suggestions && syncField && (
        <SyncSuggestion field={field} suggestion={suggestions[field]} onSync={syncField} />
      )}
      {children}
    </div>
  );
}

// ─── NumberField ──────────────────────────────────────────────────────────────
/**
 * A labeled number input, optionally paired with a unit <select>.
 *
 * @param {string}   label         - Label text
 * @param {string}   field         - Key in `values` for the numeric input
 * @param {object}   values        - Calculator state
 * @param {function} setField      - updateField from useCalc
 * @param {object}   [suggestions] - For SyncSuggestion
 * @param {function} [syncField]   - For SyncSuggestion
 * @param {string}   [placeholder]
 * @param {string}   [min="0"]
 * @param {object}   [inputStyle]  - Extra styles on the <input>
 * @param {number}   [inputFlex=2] - flex value for the <input>
 * @param {Array}    [units]       - [{value, label}] — if provided, renders a unit select
 * @param {string}   [unitField]   - Key in values for the unit (default: field + "Unit")
 * @param {number}   [unitFlex=1]  - flex value for the unit <select>
 * @param {object}   [style]       - Extra styles on the outer CalcBox
 */
export function NumberField({
  label, field, values, setField,
  suggestions, syncField,
  placeholder, min = "0",
  inputStyle, inputFlex = 2,
  units, unitField, unitFlex = 1,
  style,
}) {
  const uField = unitField || `${field}Unit`;
  const hasUnit = Array.isArray(units) && units.length > 0;

  return (
    <CalcBox label={label} field={field} suggestions={suggestions} syncField={syncField} style={style}>
      {hasUnit ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="number"
            min={min}
            value={values[field]}
            onChange={(e) => setField(field, e.target.value)}
            className="calc-input"
            placeholder={placeholder}
            style={{ flex: inputFlex, ...inputStyle }}
          />
          <select
            value={values[uField]}
            onChange={(e) => setField(uField, e.target.value)}
            className="calc-select"
            style={{ flex: unitFlex }}
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      ) : (
        <input
          type="number"
          min={min}
          value={values[field]}
          onChange={(e) => setField(field, e.target.value)}
          className="calc-input"
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </CalcBox>
  );
}

// ─── Pre-wired specialisations ────────────────────────────────────────────────
const WEIGHT_UNITS      = [{ value: "kg", label: "kg" }, { value: "lb", label: "lb" }];
const WEIGHT_UNITS_FULL = [{ value: "kg", label: "kg" }, { value: "g",  label: "g"  }, { value: "lb", label: "lb" }];
const HEIGHT_UNITS      = [{ value: "cm", label: "cm" }, { value: "m",  label: "m"  }, { value: "inch", label: "inch" }];

/**
 * Pre-wired weight input (kg / lb).
 * Pass `includeGrams` for the full kg / g / lb selector.
 */
export function WeightField({ values, setField, suggestions, syncField, label = "Weight:", includeGrams = false }) {
  return (
    <NumberField
      label={label} field="weight" unitField="weightUnit"
      values={values} setField={setField}
      suggestions={suggestions} syncField={syncField}
      units={includeGrams ? WEIGHT_UNITS_FULL : WEIGHT_UNITS}
    />
  );
}

/** Pre-wired height input (cm / m / inch). */
export function HeightField({ values, setField, suggestions, syncField, label = "Height:" }) {
  return (
    <NumberField
      label={label} field="height" unitField="heightUnit"
      values={values} setField={setField}
      suggestions={suggestions} syncField={syncField}
      units={HEIGHT_UNITS}
    />
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────
/**
 * A standard labeled <select> dropdown.
 *
 * @param {string}   label      - Label text
 * @param {string}   field      - Key in `values`
 * @param {object}   values     - Calculator state
 * @param {function} setField   - updateField from useCalc
 * @param {Array}    options    - [{value, label}]
 * @param {object}   [style]    - Extra styles on the outer CalcBox
 */
export function SelectField({ label, field, values, setField, options, style }) {
  return (
    <CalcBox label={label} style={style}>
      <select
        value={values[field]}
        onChange={(e) => setField(field, e.target.value)}
        className="calc-select"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </CalcBox>
  );
}

// ─── CheckboxField ────────────────────────────────────────────────────────────
/**
 * A standard labeled checkbox.
 *
 * @param {string}   label      - Label text next to checkbox
 * @param {string}   field      - Key in `values` (boolean)
 * @param {object}   values     - Calculator state
 * @param {function} setField   - updateField from useCalc
 * @param {object}   [style]    - Extra styles on the outer CalcBox
 */
export function CheckboxField({ label, field, values, setField, style }) {
  return (
    <CalcBox style={style}>
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={!!values[field]}
          onChange={() => setField(field, !values[field])}
          style={{ marginRight: 10 }}
        />
        {label}
      </label>
    </CalcBox>
  );
}

// ─── ResetButton ──────────────────────────────────────────────────────────────
/** Standardised reset button — no more 45 identical button definitions. */
export function ResetButton({ onClick, label = "Reset Calculator", style }) {
  return (
    <button onClick={onClick} className="calc-btn-reset" style={style}>
      {label}
    </button>
  );
}

// ─── ResultBox ────────────────────────────────────────────────────────────────
/**
 * Standard result display wrapper.
 * Pass `show={false}` to hide (avoids conditional wrapping in parent).
 */
export function ResultBox({ children, show = true, style }) {
  if (!show) return null;
  return (
    <div className="calc-result" style={{ marginTop: 16, ...style }}>
      {children}
    </div>
  );
}
