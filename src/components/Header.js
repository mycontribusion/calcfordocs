import "./Header.css";
import Feedback from "../Feedback";
import InstallGuide from "./InstallGuide";
import usePWAInstall from "../hooks/usePWAInstall";

export default function Header({ theme, toggleTheme, activePanel, setActivePanel }) {
  const { canInstall, promptInstall, isIOS, isAndroid, isDesktop } = usePWAInstall();

  const toggle = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className="head-contact-container">
      <div className="head-contact">
        <h2 className="title">CalcForDocs</h2>

        <div className="header-actions-container">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="contact-links">
            <div className="contactus" onClick={() => toggle("install")}>
              Install
            </div>
            <div className="contactus" onClick={() => toggle("feedback")}>
              Contact
            </div>
          </div>
        </div>
      </div>

      {/* ===================== DROPDOWN PANEL ===================== */}
      {activePanel === "install" && (
        <div className="header-dropdown">
          <InstallGuide
            canInstall={canInstall}
            isIOS={isIOS}
            isAndroid={isAndroid}
            isDesktop={isDesktop}
            onInstall={promptInstall}
          />
        </div>
      )}

      {activePanel === "feedback" && (
        <div className="header-dropdown">
          <Feedback />
        </div>
      )}
    </div>
  );
}