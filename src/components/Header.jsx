import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./Header.css";
// import Feedback from "../Feedback"; // Replaced with lazy import
import InstallGuide from "./InstallGuide";
import usePWAInstall from "../hooks/usePWAInstall";

const Feedback = lazy(() => import("../Feedback"));

const InstallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FeedbackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-icon">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </svg>
);

export default function Header({ theme, toggleTheme, activePanel, setActivePanel }) {
  const { canInstall, promptInstall, isInstalled, isIOS, isAndroid, isDesktop } = usePWAInstall();
  const [showInstallGuidance, setShowInstallGuidance] = useState(false);
  const prevPanelRef = useRef(activePanel);

  // When the auto install prompt is dismissed, auto-open the header install
  // guide panel, pulse the install icon, and show the guidance message inside
  // the panel so the message and the action are visually connected.
  useEffect(() => {
    const handler = () => {
      setActivePanel("install");
      setShowInstallGuidance(true);
    };
    window.addEventListener("pwa-install-hint", handler);
    return () => {
      window.removeEventListener("pwa-install-hint", handler);
    };
  }, [setActivePanel]);

  // When the user leaves the install panel (e.g. opens another header button),
  // clear the guidance message and revert the install button styling.
  useEffect(() => {
    if (prevPanelRef.current === "install" && activePanel !== "install") {
      setShowInstallGuidance(false);
    }
    prevPanelRef.current = activePanel;
  }, [activePanel]);

  // Close the install panel once the app becomes installed.
  useEffect(() => {
    if (isInstalled && activePanel === "install") {
      setActivePanel(null);
    }
  }, [isInstalled, activePanel, setActivePanel]);

  const toggle = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  // If the native install prompt is available, install directly on click.
  // Otherwise (iOS, already installed, or unsupported browser) open the guide.
  const handleInstallClick = () => {
    if (canInstall) {
      promptInstall();
    } else {
      toggle("install");
    }
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
            {!isInstalled && (
              <div
                className={`contactus install-btn-head ${showInstallGuidance ? "install-hint" : ""}`}
                onClick={handleInstallClick}
              >
                <InstallIcon />
                <span className="install-btn-label">Install</span>
              </div>
            )}
            <div className="contactus feedback-btn-head" onClick={() => toggle("feedback")}>
              <FeedbackIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ===================== DROPDOWN PANEL ===================== */}
      {activePanel === "install" && (
        <div className="header-dropdown">
          <InstallGuide
            canInstall={canInstall}
            isInstalled={isInstalled}
            isIOS={isIOS}
            isAndroid={isAndroid}
            isDesktop={isDesktop}
            onInstall={promptInstall}
            showGuidance={showInstallGuidance}
          />
        </div>
      )}

      {activePanel === "feedback" && (
        <div className="header-dropdown">
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>Loading Feedback...</div>}>
            <Feedback />
          </Suspense>
        </div>
      )}
    </div>
  );
}
