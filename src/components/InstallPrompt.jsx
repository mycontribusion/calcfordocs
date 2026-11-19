import { useEffect, useState } from "react";
import "./InstallPrompt.css";
import usePWAInstall from "../hooks/usePWAInstall";

/**
 * Auto-showing PWA install prompt.
 *
 * Appears on every visit while the app is NOT installed (i.e. not running in
 * standalone mode). On browsers that support `beforeinstallprompt` it offers a
 * one-tap "Install App" button; on iOS (and browsers without the event) it
 * shows the manual "Add to Home Screen" instructions instead.
 */
export default function InstallPrompt() {
  const { canInstall, isInstalled, promptInstall, isIOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInstalled || dismissed) return;
    // Small delay so the prompt doesn't interrupt the initial paint.
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [isInstalled, dismissed]);

  if (isInstalled || dismissed || !visible) return null;

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      setDismissed(true);
    }
  };

  const subtitle = isIOS
    ? "Tap the Share button, then choose “Add to Home Screen” for quick, offline access."
    : canInstall
    ? "Add CalcForDocs to your device for faster, offline access."
    : "Open your browser menu and choose “Install app” or “Add to Home screen”.";

  return (
    <div
      className="install-prompt"
      role="dialog"
      aria-live="polite"
      aria-label="Install CalcForDocs"
    >
      <button
        className="install-prompt-close"
        onClick={() => setDismissed(true)}
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
              onClick={() => setDismissed(true)}
            >
              Not now
            </button>
          </>
        ) : (
          <button
            className="install-prompt-btn primary"
            onClick={() => setDismissed(true)}
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
