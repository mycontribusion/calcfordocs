import CalculatorRenderer from "../calculators/CalculatorRenderer";
import CopyResultWrapper from "./CopyResultWrapper";

export default function CalculatorGrid({
  calcs,
  activeCalc,
  toggleCalc
}) {
  return (
    <div className="button-grid">
      {calcs.map((item) => (
        <div key={item.id} id={item.id} className="button-wrapper-container">
          <div className="button-wrapper">
            <button
              className={`calc-btn ${activeCalc === item.id ? "active" : ""}`}
              onClick={() => toggleCalc(item.id)}
            >
              {item.name}
            </button>
          </div>

          {activeCalc === item.id && (
            <div className="calc-row">
              <CopyResultWrapper>
                <CalculatorRenderer id={item.id} />
              </CopyResultWrapper>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}