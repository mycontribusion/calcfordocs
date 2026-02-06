export default function Header({ theme, toggleTheme, toggleFeedback, toggleUpdate }) {
    return (
      <div className="head-contact">
        <h2 className="title">CalcForDocs</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="contact-links">
            <div className="contactus" onClick={toggleUpdate}>Update</div>
            <div className="contactus" onClick={toggleFeedback}>Contact-us</div>
          </div>
        </div>
      </div>
    );
  }