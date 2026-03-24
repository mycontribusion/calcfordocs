import "./CalcForDocs.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import calcinfo from "./calculators/calcinfo.json";
import useServiceWorkerUpdate from "./useServiceWorkerUpdate";
import { track } from "@vercel/analytics";

import Header from "./components/Header";
import CalculatorGrid from "./components/CalculatorGrid";
import GlobalSearch from "./components/GlobalSearch";
import UpdateBanner from "./components/UpdateBanner";
import { PatientProvider } from './calculators/PatientContext';


const ARRANGEMENTS = {
  og: ["pregnancy_calculator", "bishop_score"],
  peds: ["apgar_score", "pediatric_weight_calc", "pediatric_age_estimator", "pediatric_anemia_correction", "dextrose_fortifier", "blood_volume_estimator", "ballard_score"],
  electrolytes: ["glucose_converter", "serum_osmolality", "anion_gap_delta_ratio", "hypokalemia_correction", "hyponatremia_correction", "corrected_sodium", "corrected_calcium", "calcium_phosphate_product", "lab_converter", "egfr_calculator", "urea_creatinine_ratio"],
  med: ["sofa_score", "curb65_score", "af_stroke_risk_cha2ds2vasc", "wells_dvt_score", "wells_pe_score", "stroke_score_siriraj", "ecg_waveforms", "mmse_calculator", "dar_risk_assessment", "heart_failure_framingham", "cardiac_axis"],
  meds: ["drug_volume_calc", "dosage_calculator", "iv_infusion_rate", "parkland_formula", "dextrose_fortifier", "electrolyte_unit_conv"],
  surg: ["rule_of_nines", "parkland_formula", "ipss_score"]
};

function MainApp() {
  const [activeCalc, setActiveCalc] = useState(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/calc\/([^/]+)/);
    return match ? match[1] : null;
  });
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanel, setActivePanel] = useState(() => {
    return window.location.pathname === "/feedback" ? "feedback" : null;
  }); // dropdown state
  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith("/calc/") || path === "/feedback") return "default";
    const match = path.match(/^\/view\/([^/]+)/);
    return match ? match[1] : "default";
  });
  const { updateAvailable, refreshApp } = useServiceWorkerUpdate();

  const [showBanner, setShowBanner] = useState(false); // banner UI state
  const headerRef = useRef(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* 📏 Handle Scroll Shadows */
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => window.removeEventListener("resize", checkScroll);
    }
  }, [checkScroll]);

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

  /* 🔗 Sync State with URL Path (for SEO & Vercel Analytics) */
  useEffect(() => {
    const currentPath = window.location.pathname;
    let newPath = "/";

    if (activePanel === "feedback") {
      newPath = "/feedback";
    } else if (activeCalc) {
      newPath = `/calc/${activeCalc}`;
    } else if (view && view !== "default") {
      newPath = `/view/${view}`;
    }

    if (currentPath !== newPath) {
      window.history.pushState(null, "", newPath);
    }
  }, [activeCalc, view, activePanel]);

  /* 🔄 Handle Browser Navigation (Back/Forward) */
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const calcMatch = path.match(/^\/calc\/([^/]+)/);
      const viewMatch = path.match(/^\/view\/([^/]+)/);
      const isFeedback = path === "/feedback";

      setActivePanel(isFeedback ? "feedback" : null);
      setActiveCalc(calcMatch ? calcMatch[1] : null);

      if (viewMatch) {
        setView(viewMatch[1]);
      } else if (!calcMatch && !isFeedback) {
        setView("default");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* 🏷 Dynamic Page Title for SEO */
  useEffect(() => {
    if (activePanel === "feedback") {
      document.title = "Feedback - CalcForDocs";
    } else if (activeCalc) {
      const calc = calcinfo.find((c) => c.id === activeCalc);
      if (calc) {
        document.title = `${calc.name} - CalcForDocs`;
      }
    } else {
      document.title = "CalcForDocs - Clinical Decision Support Tools";
    }
  }, [activeCalc, activePanel]);

  /* 📜 Auto-Scroll to Active Calculator */
  useEffect(() => {
    if (activeCalc) {
      // Small timeout to allow the transition/render to begin
      const timeout = setTimeout(() => {
        const element = document.getElementById(activeCalc);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [activeCalc]);

  /* 🛠 Handlers */
  const toggleTheme = useCallback(() => {
    setTheme((p) => (p === "light" ? "dark" : "light"));
  }, []);

  const toggleCalc = useCallback((id) => {
    setActiveCalc((prev) => {
      const newActive = prev === id ? null : id;
      if (newActive) {
        track("calculator_opened", { calculatorId: newActive });
      }
      return newActive;
    });
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
      <div className={`view-toggle-container ${canScrollLeft ? "can-scroll-left" : ""} ${canScrollRight ? "can-scroll-right" : ""}`}>
        <div
          className="view-toggle"
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {["default", "og", "peds", "electrolytes", "meds", "med", "surg"].map((v) => {
            const labels = {
              default: "Default",
              og: "O&G",
              peds: "Peds",
              electrolytes: "Lab",
              meds: "Drugs",
              med: "Medicine",
              surg: "Surgery"
            };
            return (
              <button
                key={v}
                className={`view-btn ${view === v ? "active" : ""}`}
                onClick={() => {
                  setView(v);
                  track("category_viewed", { category: labels[v] });
                }}
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
      {/* 📜 Footer Disclaimer */}
      <footer className="app-footer">
        <div style={{ marginBottom: 12 }}>
          <button
            className="footer-feedback-btn"
            onClick={() => {
              setActivePanel("feedback");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0,123,255,0.05)'
            }}
          >
            💡 Provide Feedback / Report Bug
          </button>
        </div>
        <p className="disclaimer">
          <strong>Disclaimer:</strong> This tool is intended for use by healthcare professionals for informational purposes only.
          It is not a substitute for clinical judgment. All calculations should be verified independently before
          making clinical decisions. The authors assume no liability for errors or clinical outcomes.
        </p>
        <p className="copyright">© {new Date().getFullYear()} CalcForDocs</p>
      </footer>
    </div>
  );
}

export default function CalcForDocs() {
  return (
    <PatientProvider>
      <MainApp />
    </PatientProvider>
  );
}