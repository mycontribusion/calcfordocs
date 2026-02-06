import { useEffect, useState } from "react";

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();

    // Detect iOS and Android
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));

    // Detect if app is installed
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(installed);

    // Clear deferredPrompt if already installed
    if (installed) setDeferredPrompt(null);

    // Capture install prompt event (Android/Desktop)
    const beforeInstallHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallHandler);

    // Detect appinstalled event
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null); // remove install button immediately
    };
    window.addEventListener("appinstalled", appInstalledHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt || isInstalled) return; // don't prompt if installed
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (choiceResult.outcome === "accepted") setIsInstalled(true);
  };

  return {
    canInstall: !!deferredPrompt && !isInstalled, // hide button if installed
    promptInstall,
    isInstalled,
    isIOS,
    isAndroid,
    isDesktop: !/iphone|ipad|ipod|android/.test(window.navigator.userAgent.toLowerCase()),
  };
}