import CalculatorRenderer from "../calculators/CalculatorRenderer";
import CopyResultWrapper from "./CopyResultWrapper";
import { useFavorites } from "../calculators/FavoritesContext";

export default function CalculatorGrid({
  calcs,
  activeCalc,
  toggleCalc
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="button-grid">
      {calcs.map((item) => (
        <div key={item.id} id={item.id} className="button-wrapper-container">
          <div className="button-wrapper">
            <button
              className={`fav-btn ${isFavorite(item.id) ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              title={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite(item.id) ? "★" : "☆"}
            </button>
            <button
              className={`calc-btn ${activeCalc === item.id ? "active" : ""}`}
              onClick={() => toggleCalc(item.id)}
            >
              {item.name}
            </button>
          </div>

          {activeCalc === item.id && (
            <div className="calc-row">
              <CopyResultWrapper calcName={item.name}>
                <CalculatorRenderer id={item.id} />
              </CopyResultWrapper>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}