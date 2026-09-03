import React from "react";
import calcinfo from "../calculators/calcinfo.json";
import "./FavoritesEmptyState.css";

const RECOMMENDED_IDS = [
  "pregnancy_calculator",
  "iv_infusion_rate",
  "dosage_calculator",
  "egfr_calculator",
  "pediatric_weight_calc",
  "serum_osmolality"
];

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

export default function FavoritesEmptyState({ toggleFav, onSelectCalc }) {
  const recommendations = RECOMMENDED_IDS.map((id) =>
    calcinfo.find((item) => item.id === id)
  ).filter(Boolean);

  return (
    <div className="favorites-empty-container">
      <div className="favorites-empty-card">
        <h2 className="favorites-empty-title">No Favorites Added Yet</h2>
        <p className="favorites-empty-desc">
          Click the star (<span className="inline-star-icon"><StarIcon filled={false} /></span>) icon on any calculator card to save your most frequently used clinical decision tools for 1-tap quick access during shifts.
        </p>

        <div className="favorites-rec-section">
          <h3 className="favorites-rec-heading">Popular Clinical Tools to Star:</h3>
          <div className="favorites-rec-grid">
            {recommendations.map((item) => (
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
