const Card = ({ title, children, onCalculate }) => (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
      <button
        onClick={onCalculate}
        className="button"
      >
        Calculate
      </button>
    </div>
  );
  
  // A simple App component to demonstrate the Card.
  const App = () => {
    const handleCalculate = () => {
      alert("Calculate button clicked!");
    };}

    