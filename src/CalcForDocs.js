import "./CalcForDocs.css";
import { useState, useEffect } from "react";
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
  const [activePanel, setActivePanel] = useState(null);
  const { updateAvailable, refreshApp } = useServiceWorkerUpdate();

  /* 🔄 Service Worker Update State */
  const [updateWaiting, setUpdateWaiting] = useState(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  /* 🌗 Detect System Theme + SW Waiting */
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setUpdateWaiting(reg.waiting);
          setShowUpdateBanner(true);
        }
      });
    }

    const handleUpdateFound = (e) => {
      setUpdateWaiting(e.detail.waiting);
      setShowUpdateBanner(true);
    };

    window.addEventListener("swUpdateAvailable", handleUpdateFound);
    return () =>
      window.removeEventListener("swUpdateAvailable", handleUpdateFound);
  }, []);

  /* 🛠 Handlers */
  const toggleTheme = () =>
    setTheme((p) => (p === "light" ? "dark" : "light"));

  const toggleCalc = (id) =>
    setActiveCalc((prev) => (prev === id ? null : id));

  const handleUpdateNow = () => {
    if (updateWaiting) {
      updateWaiting.postMessage({ type: "SKIP_WAITING" });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  /* 🔍 Filter Calculators */
  const filteredCalcs = calcinfo.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.keywords?.some((k) => k.toLowerCase().includes(searchTerm))
  );

  return (
    <div className={`calcfordocs ${theme}`}>
      
      <UpdateBanner
        show={showUpdateBanner || updateAvailable}
        waitingSW={!!updateWaiting}
        handleUpdateNow={handleUpdateNow}
        refreshApp={refreshApp}
        onClose={() => setShowUpdateBanner(false)}
      />

      {/* 🧭 Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activePanel={activePanel}       // <--- pass both
        setActivePanel={setActivePanel} //
      />

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