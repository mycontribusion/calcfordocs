import CalculatorRenderer from "../calculators/CalculatorRenderer";

export default function CalculatorGrid({
  calcs,
  activeCalc,
  toggleCalc
}) {
  return (
    <div className="button-grid">
      {calcs.map((item) => (
        <div key={item.id} className="button-wrapper-container">
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
              <CalculatorRenderer id={item.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}