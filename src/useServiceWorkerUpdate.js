import { useState, useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export default function useServiceWorkerUpdate() {
  const [waitingSW, setWaitingSW] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 1. Check if a SW is already waiting on initial load
    serviceWorkerRegistration.register({
      onUpdate: (reg) => {
        if (reg.waiting) {
          setWaitingSW(reg.waiting);
          setUpdateAvailable(true);
        }
      },
    });

    // 2. Listen for the custom event dispatched from index.js
    const handleSWUpdate = (e) => {
      const sw = e.detail?.waiting;
      if (sw) {
        setWaitingSW(sw);
        setUpdateAvailable(true);
      }
    };

    window.addEventListener("swUpdateAvailable", handleSWUpdate);

    // 3. Also check navigator directly in case we missed events
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          setWaitingSW(reg.waiting);
          setUpdateAvailable(true);
        }
      });
    }

    return () => window.removeEventListener("swUpdateAvailable", handleSWUpdate);
  }, []);

  const refreshApp = () => {
    if (!waitingSW) return;
    waitingSW.postMessage({ type: "SKIP_WAITING" });

    // Reload once the new SW takes control
    const onControllerChange = () => {
      window.location.reload();
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    } else {
      window.location.reload();
    }
  };

  return { updateAvailable, refreshApp };
}