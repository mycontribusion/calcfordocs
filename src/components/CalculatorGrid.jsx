import React from "react";
import CalculatorRenderer from "../calculators/CalculatorRenderer";
import CopyResultWrapper from "./CopyResultWrapper";
import { useFavorites } from "../calculators/FavoritesContext";
import FavoritesEmptyState from "./FavoritesEmptyState";

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

const CalculatorItem = React.memo(({ item, activeCalc, toggleCalc, isFav, toggleFav, onFavToggleNotice }) => {
  const isActive = activeCalc === item.id;
  
  return (
    <div id={item.id} className="button-wrapper-container">
      <div className="button-wrapper">
        <button
          className={`fav-btn ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(item.id);
            if (onFavToggleNotice) {
              onFavToggleNotice(item.name, !isFav);
            }
          }}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFav ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
        >
          <StarIcon filled={isFav} />
        </button>
        <button
          className={`calc-btn ${isActive ? "active" : ""}`}
          onClick={() => toggleCalc(item.id)}
        >
          {item.name}
        </button>
      </div>

      {isActive && (
        <div className="calc-row">
          <CopyResultWrapper calcName={item.name}>
            <CalculatorRenderer id={item.id} />
          </CopyResultWrapper>
        </div>
      )}
    </div>
  );
});

export default function CalculatorGrid({
  calcs,
  activeCalc,
  toggleCalc,
  view,
  onFavToggleNotice
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (view === "favorites" && calcs.length === 0) {
    return (
      <FavoritesEmptyState
        toggleFav={(id, name) => {
          toggleFavorite(id);
          if (onFavToggleNotice) {
            onFavToggleNotice(name, true);
          }
        }}
        onSelectCalc={toggleCalc}
      />
    );
  }

  return (
    <div className="button-grid">
      {calcs.map((item) => (
        <CalculatorItem 
          key={item.id}
          item={item}
          activeCalc={activeCalc}
          toggleCalc={toggleCalc}
          isFav={isFavorite(item.id)}
          toggleFav={toggleFavorite}
          onFavToggleNotice={onFavToggleNotice}
        />
      ))}
    </div>
  );
}