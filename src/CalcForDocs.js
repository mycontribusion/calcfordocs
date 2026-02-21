import "./CalcForDocs.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import calcinfo from "./calculators/calcinfo.json";
import useServiceWorkerUpdate from "./useServiceWorkerUpdate";

import Header from "./components/Header";
import CalculatorGrid from "./components/CalculatorGrid";
import GlobalSearch from "./components/GlobalSearch";
import UpdateBanner from "./components/UpdateBanner";

const ARRANGEMENTS = {
  og: ["apgar_score", "pregnancy_calculator", "bishop_score", "ballard_score", "wells_pe_score", "lab_converter", "bmi_calculator", "dosage_calculator"],
  peds: ["apgar_score", "pediatric_weight_calc", "pediatric_age_estimator", "pediatric_anemia_correction", "ballard_score", "fluid_correction", "iv_infusion_rate", "blood_volume_estimator"],
  electrolytes: ["serum_osmolality", "anion_gap_delta_ratio", "hypokalemia_correction", "hyponatremia_correction", "corrected_sodium", "corrected_calcium", "calcium_phosphate_product", "lab_converter", "egfr_calculator", "urea_creatinine_ratio"],
  med: ["sofa_score", "curb65_score", "af_stroke_risk_cha2ds2vasc", "wells_dvt_score", "wells_pe_score", "stroke_score_siriraj", "ecg_waveforms", "mmse_calculator", "dar_risk_assessment"],
  surg: ["map_calculator", "shock_index", "gcs_calculator", "rule_of_nines", "blood_volume_estimator", "ipss_score", "bmi_calculator"]
};

function CalcForDocs() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanel, setActivePanel] = useState(null); // dropdown state
  const [view, setView] = useState("default"); // 'default', 'og', 'peds'
  const { updateAvailable, refreshApp } = useServiceWorkerUpdate();

  const [showBanner, setShowBanner] = useState(false); // banner UI state
  const headerRef = useRef(null);

  /* 🌗 Detect System Theme */
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  /* 🔔 Show banner when SW update becomes available */
  useEffect(() => {
    if (updateAvailable) setShowBanner(true);
  }, [updateAvailable]);

  /* 🔒 Close dropdowns when clicking outside header */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 🛠 Handlers */
  const toggleTheme = useCallback(() => {
    setTheme((p) => (p === "light" ? "dark" : "light"));
  }, []);

  const toggleCalc = useCallback((id) => {
    setActiveCalc((prev) => (prev === id ? null : id));
  }, []);

  /* 🔍 Filtered & Ordered Calculators */
  const filteredCalcs = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    let base = calcinfo.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lowerTerm))
    );

    if (view !== "default" && ARRANGEMENTS[view]) {
      const priority = ARRANGEMENTS[view];
      base = [...base].sort((a, b) => {
        const indexA = priority.indexOf(a.id);
        const indexB = priority.indexOf(b.id);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }

    return base;
  }, [searchTerm, view]);

  return (
    <div className={`calcfordocs ${theme}`}>

      {/* Update Banner */}
      <UpdateBanner
        show={showBanner}
        onUpdate={() => {
          refreshApp(); // triggers SW skipWaiting + reload
          setShowBanner(false); // hide banner
        }}
        onClose={() => setShowBanner(false)} // Later button hides banner
      />

      {/* 🧭 Header */}
      <div ref={headerRef}>
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      </div>

      {/* 🔍 Search */}
      <GlobalSearch
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* 🔘 Speciality Toggle */}
      <div className="view-toggle-container">
        <div className="view-toggle">
          {["default", "og", "peds", "electrolytes", "med", "surg"].map((v) => {
            const labels = {
              default: "Default",
              og: "O&G",
              peds: "Peds",
              electrolytes: "Electrolytes",
              med: "Med",
              surg: "Surg"
            };
            return (
              <button
                key={v}
                className={`view-btn ${view === v ? "active" : ""}`}
                onClick={() => setView(v)}
              >
                {labels[v]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🧮 Calculator Grid */}
      <CalculatorGrid
        calcs={filteredCalcs}
        activeCalc={activeCalc}
        toggleCalc={toggleCalc}
      />
      <p style={{ marginBottom: "4rem" }}></p>
    </div>
  );
}

export default CalcForDocs;