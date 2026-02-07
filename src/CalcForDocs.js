import "./CalcForDocs.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import calcinfo from "./calculators/calcinfo.json";
import useServiceWorkerUpdate from "./useServiceWorkerUpdate";

import Header from "./components/Header";
import CalculatorGrid from "./components/CalculatorGrid";
import GlobalSearch from "./components/GlobalSearch";
import UpdateBanner from "./components/UpdateBanner";

function CalcForDocs() {
  const [activeCalc, setActiveCalc] = useState(null);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [activePanel, setActivePanel] = useState(null); // dropdown state
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

  /* 🔍 Filtered Calculators */
  const filteredCalcs = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return calcinfo.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerTerm) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm]);

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

      {/* 🧮 Calculator Grid */}
      <CalculatorGrid
        calcs={filteredCalcs}
        activeCalc={activeCalc}
        toggleCalc={toggleCalc}
      />
    </div>
  );
}

export default CalcForDocs;