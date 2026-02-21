import "./Header.css";
import Feedback from "../Feedback";
import InstallGuide from "./InstallGuide";
import usePWAInstall from "../hooks/usePWAInstall";

const InstallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

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
            <div className="contactus install-btn-head" onClick={() => toggle("install")}>
              <InstallIcon />
            </div>
            <div className="contactus feedback-btn-head" onClick={() => toggle("feedback")}>
              <EnvelopeIcon />
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