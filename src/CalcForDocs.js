import "./CalcForDocs.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import calcinfo from "./calculators/calcinfo.json";
import useServiceWorkerUpdate from "./useServiceWorkerUpdate";

import Header from "./components/Header";
import CalculatorGrid from "./components/CalculatorGrid";
import GlobalSearch from "./components/GlobalSearch";
import UpdateBanner from "./components/UpdateBanner";

const ARRANGEMENTS = {
  og: ["r", "bs", "v", "wellpe", "labconv", "a", "o"],
  peds: ["m", "k", "l", "v", "g", "p", "f"]
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
          <button
            className={`view-btn ${view === "default" ? "active" : ""}`}
            onClick={() => setView("default")}
          >
            Default
          </button>
          <button
            className={`view-btn ${view === "og" ? "active" : ""}`}
            onClick={() => setView("og")}
          >
            O&G
          </button>
          <button
            className={`view-btn ${view === "peds" ? "active" : ""}`}
            onClick={() => setView("peds")}
          >
            Pediatrics
          </button>
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