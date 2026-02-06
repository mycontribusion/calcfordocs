import "./Header.css";

export default function Header({
  theme,
  toggleTheme,
  toggleFeedback,
  toggleUpdate,
  toggleInstall,
  showInstall,
}) {
  return (
    <div className="head-contact">
      <h2 style={{marginRight:"10px"}} className="title">CalcForDocs </h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div className="contact-links">
          {showInstall && (
            <div className="contactus" onClick={toggleInstall}>
              Install
            </div>
          )}
          <div style={{display:"none"}} className="contactus" onClick={toggleUpdate}>Update</div>
          <div className="contactus" onClick={toggleFeedback}>Contact</div>
        </div>
      </div>
    </div>
  );
}