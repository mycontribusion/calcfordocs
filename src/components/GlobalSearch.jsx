import "./GlobalSearch.css";
import { useState } from "react";

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

export default function GlobalSearch({ value, onChange, hidden, variant = "floating", containerRef }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="global-search-floating">
      <button
        className="global-search-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Close search" : "Open search"}
      >
        {isExpanded ? <CloseIcon /> : <SearchIcon />}
      </button>

      {isExpanded && (
        <div className="global-search-expand">
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
    </div>
  );
}
