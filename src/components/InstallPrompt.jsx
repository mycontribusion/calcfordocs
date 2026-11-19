import { useEffect, useState } from "react";
import "./InstallPrompt.css";
import usePWAInstall from "../hooks/usePWAInstall";

/**
 * Auto-showing PWA install prompt.
 *
 * Shows once on the first visit while the app is NOT installed. If the user
 * chooses "Not now" we remember it, scroll to the top, and open the header
 * install panel — where a guidance message ("You can install it from here any
 * time") is shown right next to the install action.
 *
 * On browsers that support `beforeinstallprompt` it offers a one-tap
 * "Install App" button; on iOS (and browsers without the event) it shows the
 * manual "Add to Home Screen" instructions instead.
 */
export default function InstallPrompt() {
  const {
    canInstall,
    isInstalled,
    promptDismissed,
    dismissPrompt,
    promptInstall,
  } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInstalled || promptDismissed) return;
    // Small delay so the prompt doesn't interrupt the initial paint.
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [isInstalled, promptDismissed]);

  if (isInstalled || !visible) return null;

  // Dismiss the auto prompt, scroll to the header, and open the install panel
  // (which shows the guidance message next to the install action).
  const handleDismiss = () => {
    dismissPrompt();
    setVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("pwa-install-hint"));
  };

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      // User dismissed the native prompt — treat it like "Not now".
      handleDismiss();
    }
  };

  const subtitle = canInstall
    ? "Add CalcForDocs to your device for faster, offline access."
    : "Tap the Share button, then choose “Add to Home Screen” for quick, offline access.";

  return (
    <div
      className="install-prompt"
      role="dialog"
      aria-live="polite"
      aria-label="Install CalcForDocs"
    >
      <button
        className="install-prompt-close"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
      >
        ×
      </button>

      <div className="install-prompt-body">
        <img
          src="/logo.png"
          alt="CalcForDocs"
          className="install-prompt-icon"
        />
        <div className="install-prompt-text">
          <p className="install-prompt-title">Install CalcForDocs</p>
          <p className="install-prompt-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="install-prompt-actions">
        {canInstall ? (
          <>
            <button
              className="install-prompt-btn primary"
              onClick={handleInstall}
            >
              Install App
            </button>
            <button
              className="install-prompt-btn ghost"
              onClick={handleDismiss}
            >
              Not now
            </button>
          </>
        ) : (
          <button
            className="install-prompt-btn primary"
            onClick={handleDismiss}
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
