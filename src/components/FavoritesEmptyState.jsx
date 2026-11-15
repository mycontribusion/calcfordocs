import React, { useState, useEffect, useCallback, useMemo } from "react";
import calcinfo from "../calculators/calcinfo.json";
import { useFavorites } from "../calculators/FavoritesContext";
import "./FavoritesEmptyState.css";

const RECOMMENDED_IDS = [
  "pregnancy_calculator",
  "iv_infusion_rate",
  "dosage_calculator",
  "egfr_calculator",
  "pediatric_weight_calc",
  "serum_osmolality"
];

const DISMISSED_STORAGE_KEY = "calcfordocs_favorites_suggestions_dismissed";

const StarIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#f59e0b" : "none"}
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function FavoritesEmptyState({ toggleFav, onSelectCalc }) {
  const { favorites, isFavorite } = useFavorites();
  const [dismissed, setDismissed] = useState(false);

  // Load dismissed state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_STORAGE_KEY);
      if (stored === "true") {
        setDismissed(true);
      }
    } catch (e) {
      console.error("Failed to load dismissed state:", e);
    }
  }, []);

  // Persist dismissed state
  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
    } catch (e) {
      console.error("Failed to save dismissed state:", e);
    }
  }, []);

  // Get all recommended items
  const allRecommendations = useMemo(() =>
    RECOMMENDED_IDS.map((id) =>
      calcinfo.find((item) => item.id === id)
    ).filter(Boolean),
    []
  );

  // Filter out already favorited items from suggestions
  const remainingRecommendations = useMemo(() =>
    allRecommendations.filter((item) => !isFavorite(item.id)),
    [allRecommendations, isFavorite]
  );

  // Don't show suggestions if dismissed or no remaining recommendations
  if (dismissed || remainingRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="favorites-empty-container">
      <div className="favorites-empty-card">
        <div className="favorites-empty-header">
          <h2 className="favorites-empty-title">No Favorites Added Yet</h2>
          <button
            className="favorites-dismiss-btn"
            onClick={handleDismiss}
            title="Dismiss suggestions"
            aria-label="Dismiss suggestions"
          >
            <CloseIcon />
          </button>
        </div>
        <p className="favorites-empty-desc">
          Click the star (<span className="inline-star-icon"><StarIcon filled={false} /></span>) icon on any calculator card to save your most frequently used clinical decision tools for 1-tap quick access during shifts.
        </p>

        <div className="favorites-rec-section">
          <h3 className="favorites-rec-heading">Popular Clinical Tools to Star:</h3>
          <div className="favorites-rec-grid">
            {remainingRecommendations.map((item) => (
              <div key={item.id} className="favorites-rec-card">
                <div
                  className="favorites-rec-info"
                  onClick={() => onSelectCalc(item.id)}
                  title={`Open ${item.name}`}
                >
                  <span className="favorites-rec-name">{item.name}</span>
                </div>
                <button
                  className="favorites-rec-star-btn"
                  onClick={() => toggleFav(item.id, item.name)}
                  title={`Add ${item.name} to favorites`}
                  aria-label={`Add ${item.name} to favorites`}
                >
                  <StarIcon filled={false} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
