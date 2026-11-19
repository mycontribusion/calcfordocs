import { useEffect, useState } from "react";

const INSTALLED_KEY = "calcfordocs:pwa-installed";

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

// Persist the fact that the app was installed so we don't nag the user with
// install instructions again when they later open the site in a browser tab.
const readInstalledFlag = () => {
  try {
    return window.localStorage.getItem(INSTALLED_KEY) === "true";
  } catch {
    return false;
  }
};

const writeInstalledFlag = () => {
  try {
    window.localStorage.setItem(INSTALLED_KEY, "true");
  } catch {
    /* localStorage may be unavailable (private mode) — ignore */
  }
};

const clearInstalledFlag = () => {
  try {
    window.localStorage.removeItem(INSTALLED_KEY);
  } catch {
    /* ignore */
  }
};

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(
    () => detectStandalone() || readInstalledFlag()
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
      writeInstalledFlag();
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
            writeInstalledFlag();
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
      // Clear the cached flag so the install banner shows again.
      clearInstalledFlag();
      setIsInstalled(false);
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      writeInstalledFlag();
      setDeferredPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    // React to the app being launched in standalone mode after install.
    let mql;
    const displayModeHandler = (e) => {
      if (e.matches) {
        writeInstalledFlag();
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
      writeInstalledFlag();
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    return choice.outcome;
  };

  return {
    canInstall: !!deferredPrompt,
    isInstalled,
    promptInstall,
    isIOS,
    isAndroid,
    isDesktop,
  };
}
