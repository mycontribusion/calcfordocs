/* useServiceWorkerUpdate.js */
import { useState, useEffect } from "react";

export default function useServiceWorkerUpdate() {
  const [waitingSW, setWaitingSW] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setWaitingSW(reg.waiting);
          setUpdateAvailable(true);
        }

        reg?.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (newSW) {
            newSW.addEventListener("statechange", () => {
              if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingSW(newSW);
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }

    const onAppInstalled = () => setUpdateAvailable(false);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => window.removeEventListener("appinstalled", onAppInstalled);
  }, []);

  const refreshApp = () => {
    if (!waitingSW) return;
    waitingSW.postMessage({ type: "SKIP_WAITING" });

    const onControllerChange = () => {
      window.location.reload();
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
  };

  return { updateAvailable, refreshApp };
}