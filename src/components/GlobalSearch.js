import "./GlobalSearch.css";

export default function GlobalSearch({ value, onChange }) {
  return (
    <div className="global-search-container">
      <input
        type="text"
        className="global-search-input"
        placeholder="Search calculators..."
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
      />
    </div>
  );
}