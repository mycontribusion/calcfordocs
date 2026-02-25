import { useState, useCallback, useEffect } from "react";
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
    const [values, setValues] = useState(() => {
        return { ...initialState };
    });
    const [suggestions, setSuggestions] = useState({});

    // Identify Discrepancies for Suggestions
    useEffect(() => {
        const newSuggestions = {};
        SYNC_KEYS.forEach(key => {
            if (key in values && patientData[key] && patientData[key] !== values[key]) {
                newSuggestions[key] = patientData[key];
            }
        });
        setSuggestions(newSuggestions);
    }, [patientData, values]);

    // Update a specific field
    const updateField = useCallback((field, value) => {
        setValues((prev) => {
            if (prev[field] === value) return prev;

            // Sync to Global if key matches
            if (SYNC_KEYS.includes(field)) {
                updatePatient(field, value);
            }

            return {
                ...prev,
                [field]: value,
            };
        });
    }, [updatePatient]);

    // Update multiple fields at once
    const updateFields = useCallback((newFields) => {
        setValues((prev) => {
            const next = { ...prev, ...newFields };

            // Sync to Global
            const globalUpdates = {};
            let hasGlobalUpdate = false;
            SYNC_KEYS.forEach(key => {
                if (key in newFields) {
                    globalUpdates[key] = newFields[key];
                    hasGlobalUpdate = true;
                }
            });

            if (hasGlobalUpdate) {
                // Since updatePatient is stable and doesn't trigger re-render of THIS component 
                // directly (only via the useEffect above), we can safely call it.
                Object.entries(globalUpdates).forEach(([k, v]) => updatePatient(k, v));
            }

            return next;
        });
    }, [updatePatient]);

    // Standardized reset logic
    const reset = useCallback(() => {
        setValues(initialState);
    }, [initialState]);

    // Accept a suggestion
    const syncField = useCallback((field) => {
        if (suggestions[field]) {
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
