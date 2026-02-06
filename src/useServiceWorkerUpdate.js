// useServiceWorkerUpdate.js
import { useState, useEffect } from "react";

export default function useServiceWorkerUpdate() {
  const [waitingSW, setWaitingSW] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const checkWaitingSW = async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg?.waiting) {
        setWaitingSW(reg.waiting);
        setUpdateAvailable(true);
      }

      if (reg) {
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingSW(newSW);
              setUpdateAvailable(true);
            }
          });
        });
      }
    };

    checkWaitingSW();
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