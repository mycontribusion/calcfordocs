import { useState, useCallback, useEffect, useRef } from "react";
import { usePatient } from "./PatientContext";

const SYNC_KEYS = [
    "weight", "height", "age", "ageUnit", "sex",
    "creatinine", "creatinineUnit", "albumin", "albuminUnit",
    "glucose", "glucoseUnit", "sodium", "potassium", "chloride", "bicarb",
    "sbp", "dbp", "urea", "ureaUnit", "spo2", "heartRate", "calcium", "calciumUnit", "phosphate", "phosphateUnit"
];

/**
 * Universal hook for calculator state management with Global Patient Sync.
 * @param {Object} initialState - The starting values for the calculator clinical fields.
 */
export default function useCalculator(initialState) {
    const { patientData, updatePatient } = usePatient();
    const [values, setValues] = useState(() => ({ ...initialState }));
    const [suggestions, setSuggestions] = useState({});

    // Ref to track latest values to avoid stale closures in effects if needed, 
    // but here we mostly use it for shallow comparison of suggestions.
    const prevSuggestionsRef = useRef({});

    // Identify Discrepancies for Suggestions (Optimized)
    useEffect(() => {
        const newSuggestions = {};
        let hasChanges = false;

        SYNC_KEYS.forEach(key => {
            if (key in values && patientData[key] !== undefined && patientData[key] !== null && patientData[key] !== "" && patientData[key] !== values[key]) {
                newSuggestions[key] = patientData[key];
                if (prevSuggestionsRef.current[key] !== patientData[key]) {
                    hasChanges = true;
                }
            }
        });

        // Also check if any previously existing suggestions were REMOVED
        if (!hasChanges) {
            const currentKeys = Object.keys(newSuggestions);
            const prevKeys = Object.keys(prevSuggestionsRef.current);
            if (currentKeys.length !== prevKeys.length) {
                hasChanges = true;
            }
        }

        if (hasChanges) {
            setSuggestions(newSuggestions);
            prevSuggestionsRef.current = newSuggestions;
        }
    }, [patientData, values]);

    // Update a specific field
    const updateField = useCallback((field, value) => {
        setValues((prev) => {
            if (prev[field] === value) return prev;
            return { ...prev, [field]: value };
        });

        // Sync to Global (Side effect outside of setValues)
        if (SYNC_KEYS.includes(field)) {
            updatePatient(field, value);
        }
    }, [updatePatient]);

    // Update multiple fields at once
    const updateFields = useCallback((newFields) => {
        setValues((prev) => ({ ...prev, ...newFields }));

        // Sync to Global (Side effect outside of setValues)
        Object.entries(newFields).forEach(([field, value]) => {
            if (SYNC_KEYS.includes(field)) {
                updatePatient(field, value);
            }
        });
    }, [updatePatient]);

    // Standardized reset logic
    const reset = useCallback(() => {
        setValues(initialState);
    }, [initialState]);

    // Accept a suggestion
    const syncField = useCallback((field) => {
        if (suggestions[field] !== undefined) {
            updateField(field, suggestions[field]);
        }
    }, [suggestions, updateField]);

    return {
        values,
        suggestions,
        setValues,
        updateField,
        updateFields,
        syncField,
        reset,
    };
}
