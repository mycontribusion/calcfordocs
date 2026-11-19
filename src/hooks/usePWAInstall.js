import { useEffect, useState } from "react";

const INSTALLED_KEY = "calcfordocs:pwa-installed";
const EVER_INSTALLED_KEY = "calcfordocs:pwa-ever-installed";
const DISMISSED_KEY = "calcfordocs:install-prompt-dismissed";

// Detect whether the app is currently running as an installed PWA
// (standalone / fullscreen / minimal-ui) or launched from the iOS home screen.
const detectStandalone = () => {
  if (typeof window === "undefined") return false;
  const matches = (query) =>
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;
  return (
    matches("(display-mode: standalone)") ||
    matches("(display-mode: fullscreen)") ||
    matches("(display-mode: minimal-ui)") ||
    window.navigator.standalone === true
  );
};

const readFlag = (key) => {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeFlag = (key) => {
  try {
    window.localStorage.setItem(key, "true");
  } catch {
    /* localStorage may be unavailable (private mode) — ignore */
  }
};

const clearFlag = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    () => detectStandalone() || readFlag(INSTALLED_KEY)
  );
  // Whether the user has already dismissed the auto install prompt. When true
  // we stop auto-showing it and instead point them to the header install icon.
  const [promptDismissed, setPromptDismissed] = useState(() =>
    readFlag(DISMISSED_KEY)
  );
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const ios =
      /iphone|ipad|ipod/.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    const android = /android/.test(ua);
    setIsIOS(ios);
    setIsAndroid(android);
    setIsDesktop(!ios && !android);

    // If we're already running standalone, remember it for future visits.
    if (detectStandalone()) {
      writeFlag(INSTALLED_KEY);
      writeFlag(EVER_INSTALLED_KEY);
      setIsInstalled(true);
    }

    // Positive confirmation: the browser reports a related app is installed.
    // We only trust a non-empty result (a false negative here is common), so
    // this never wrongly hides the prompt.
    if (typeof navigator.getInstalledRelatedApps === "function") {
      navigator
        .getInstalledRelatedApps()
        .then((apps) => {
          if (Array.isArray(apps) && apps.length > 0) {
            writeFlag(INSTALLED_KEY);
            writeFlag(EVER_INSTALLED_KEY);
            setIsInstalled(true);
          }
        })
        .catch(() => {
          /* not supported / permission denied — ignore */
        });
    }

    const handler = (e) => {
      e.preventDefault();
      // `beforeinstallprompt` only fires when the app is NOT installed, so this
      // is a definitive signal that it was uninstalled (or never installed).
      clearFlag(INSTALLED_KEY);
      // If it was previously installed, this is an uninstall: allow the
      // first-visit prompt to show again on this visit.
      if (readFlag(EVER_INSTALLED_KEY)) {
        clearFlag(EVER_INSTALLED_KEY);
        clearFlag(DISMISSED_KEY);
        setPromptDismissed(false);
      }
      setIsInstalled(false);
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      writeFlag(INSTALLED_KEY);
      writeFlag(EVER_INSTALLED_KEY);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    // React to the app being launched in standalone mode after install.
    let mql;
    const displayModeHandler = (e) => {
      if (e.matches) {
        writeFlag(INSTALLED_KEY);
        writeFlag(EVER_INSTALLED_KEY);
        setIsInstalled(true);
      }
    };
    if (typeof window.matchMedia === "function") {
      mql = window.matchMedia("(display-mode: standalone)");
      if (mql.addEventListener) mql.addEventListener("change", displayModeHandler);
      else if (mql.addListener) mql.addListener(displayModeHandler);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener("change", displayModeHandler);
        else if (mql.removeListener) mql.removeListener(displayModeHandler);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      writeFlag(INSTALLED_KEY);
      writeFlag(EVER_INSTALLED_KEY);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    return choice.outcome;
  };

  // Persist that the user dismissed the auto prompt so it only shows once.
  const dismissPrompt = () => {
    writeFlag(DISMISSED_KEY);
    setPromptDismissed(true);
  };

  return {
    canInstall: !!deferredPrompt,
    isInstalled,
    promptDismissed,
    dismissPrompt,
    promptInstall,
    isIOS,
    isAndroid,
    isDesktop,
  };
}
