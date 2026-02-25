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
        // Initialize with global data if key matches
        const initial = { ...initialState };
        SYNC_KEYS.forEach(key => {
            if (key in initial && patientData[key]) {
                initial[key] = patientData[key];
            }
        });
        return initial;
    });

    // Sync from Global to Local
    useEffect(() => {
        setValues(prev => {
            const next = { ...prev };
            let changed = false;
            SYNC_KEYS.forEach(key => {
                if (key in next && patientData[key] !== next[key]) {
                    next[key] = patientData[key];
                    changed = true;
                }
            });
            return changed ? next : prev;
        });
    }, [patientData]);

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

    return {
        values,
        setValues,
        updateField,
        updateFields,
        reset,
    };
}
