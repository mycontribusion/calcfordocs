import { useState, useCallback } from "react";

/**
 * Universal hook for calculator state management.
 * @param {Object} initialState - The starting values for the calculator clinical fields.
 */
export default function useCalculator(initialState) {
    const [values, setValues] = useState(initialState);

    // Update a specific field
    const updateField = useCallback((field, value) => {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // Update multiple fields at once
    const updateFields = useCallback((newFields) => {
        setValues((prev) => ({
            ...prev,
            ...newFields,
        }));
    }, []);

    // Standardized reset logic
    const reset = useCallback(() => {
        setValues(initialState);
    }, [initialState]);

    return {
        values,
        setValues, // direct access if needed for complex logic
        updateField,
        updateFields,
        reset,
    };
}
