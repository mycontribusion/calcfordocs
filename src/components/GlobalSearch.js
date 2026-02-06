export default function GlobalSearch({ value, onChange }) {
    return (
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Search calculators..."
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          style={{
            width: "100%",
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid",
          }}
        />
      </div>
    );
  }