import React from "react";
import CalculatorRenderer from "../calculators/CalculatorRenderer";
import CopyResultWrapper from "./CopyResultWrapper";
import { useFavorites } from "../calculators/FavoritesContext";

const CalculatorItem = React.memo(({ item, activeCalc, toggleCalc, isFav, toggleFav }) => {
  const isActive = activeCalc === item.id;
  
  return (
    <div id={item.id} className="button-wrapper-container">
      <div className="button-wrapper">
        <button
          className={`fav-btn ${isFav ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(item.id);
          }}
          title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          {isFav ? "★" : "☆"}
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
  toggleCalc
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

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
        />
      ))}
    </div>
  );
}