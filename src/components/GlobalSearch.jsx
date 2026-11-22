import "./GlobalSearch.css";
import { useState, useEffect, useRef } from "react";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function GlobalSearch({
  value,
  onChange,
  hidden,
  variant = "floating",
  containerRef,
  collapseSignal,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef(null);

  /* Derive whether a calculator is currently open from the collapseSignal.
     Format: "${activeCalc ?? ''}|${view}" — if the part before '|' is non-empty,
     a calculator is active and the handle should shrink. */
  const isCalculatorOpen = collapseSignal.split("|")[0] !== "";

  /* Collapse whenever the parent signals a navigation (e.g. a calculator
     button was clicked), so the panel never lingers over new content. */
  useEffect(() => {
    setIsExpanded(false);
  }, [collapseSignal]);

  /* Escape closes the panel */
  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsExpanded(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  if (hidden) return null;

  if (variant === "inline") {
    return (
      <div className="global-search-container" ref={containerRef}>
        <input
          type="search"
          className="global-search-input"
          placeholder="Search calculators..."
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
        />
      </div>
    );
  }

  return (
    <>
      <div className="global-search-floating">
        <button
          className={`global-search-toggle ${isCalculatorOpen ? "calculator-open" : ""}`}
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-label={isExpanded ? "Close search" : "Open search"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <CloseIcon /> : <SearchIcon />}
        </button>
      </div>

      {isExpanded && (
        <div className="global-search-expand" ref={panelRef}>
          <input
            type="search"
            className="global-search-input"
            placeholder="Search calculators..."
            value={value}
            onChange={(e) => onChange(e.target.value.toLowerCase())}
            autoFocus
          />
        </div>
      )}
    </>
  );
}
