import React, { createContext, useState, useContext, useCallback } from 'react';

const PatientContext = createContext();

export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
    const [patientData, setPatientData] = useState({
        weight: "",
        height: "",
        age: "",
        ageUnit: "years",
        sex: "male",
        creatinine: "",
        creatinineUnit: "µmol/L",
        albumin: "",
        albuminUnit: "g/dL",
        glucose: "",
        glucoseUnit: "mg/dL",
        sodium: "",
        potassium: "",
        chloride: "",
        bicarb: "",
        sbp: "",
        dbp: "",
        urea: "",
        ureaUnit: "mmol/L",
        spo2: "",
        heartRate: "",
        calcium: "",
        calciumUnit: "mg/dL",
        phosphate: "",
        phosphateUnit: "mg/dL",
    });

    const updatePatient = useCallback((key, value) => {
        setPatientData(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const updateMultiple = useCallback((updates) => {
        setPatientData(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    const resetPatient = useCallback(() => {
        setPatientData({
            weight: "",
            height: "",
            age: "",
            ageUnit: "years",
            sex: "male",
            creatinine: "",
            creatinineUnit: "µmol/L",
            albumin: "",
            albuminUnit: "g/dL",
            glucose: "",
            glucoseUnit: "mg/dL",
            sodium: "",
            potassium: "",
            chloride: "",
            bicarb: "",
            sbp: "",
            dbp: "",
            urea: "",
            ureaUnit: "mmol/L",
            spo2: "",
            heartRate: "",
            calcium: "",
            calciumUnit: "mg/dL",
            phosphate: "",
            phosphateUnit: "mg/dL",
        });
    }, []);

    const value = React.useMemo(() => ({
        patientData,
        updatePatient,
        updateMultiple,
        resetPatient
    }), [patientData, updatePatient, updateMultiple, resetPatient]);

    return (
        <PatientContext.Provider value={value}>
            {children}
        </PatientContext.Provider>
    );
};
