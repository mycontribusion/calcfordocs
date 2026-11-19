import { useEffect, useState } from "react";

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

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(detectStandalone);
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

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    // React to the app being launched in standalone mode after install.
    let mql;
    const displayModeHandler = (e) => {
      if (e.matches) setIsInstalled(true);
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
