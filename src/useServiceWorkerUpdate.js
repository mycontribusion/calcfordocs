import { useState, useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export default function useServiceWorkerUpdate() {
  const [waitingSW, setWaitingSW] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 1. Check if a SW is already waiting on initial load
    serviceWorkerRegistration.register({
      onUpdate: (reg, installedWorker) => {
        // Use the direct worker reference — reg.waiting may not be set yet at this moment
        const sw = installedWorker || reg.waiting;
        if (sw) {
          setWaitingSW(sw);
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

    // 4. Force an update check every time the user returns to the tab
    //    This catches users who had the tab open for a long time
    const handleVisibility = () => {
      if (!document.hidden && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.update(); // ask browser to re-fetch SW file now
            if (reg.waiting) {
              setWaitingSW(reg.waiting);
              setUpdateAvailable(true);
            }
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("swUpdateAvailable", handleSWUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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

  // Auto-activate new service worker when an update is available (silent background update)
  useEffect(() => {
    if (updateAvailable && waitingSW) {
      // Always attach the listener BEFORE posting SKIP_WAITING,
      // so we never miss the controllerchange event.
      const onControllerChange = () => {
        window.location.reload();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      waitingSW.postMessage({ type: "SKIP_WAITING" });
    }
  }, [updateAvailable, waitingSW]);

  return { updateAvailable, refreshApp };
}