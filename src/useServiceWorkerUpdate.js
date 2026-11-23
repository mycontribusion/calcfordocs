import { useState, useEffect } from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

export default function useServiceWorkerUpdate() {
  const [waitingSW, setWaitingSW] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Fix Problem 2: unconditional controllerchange listener.
    // Fires whenever a new SW takes over as controller.
    // hadController distinguishes an UPDATE (reload needed) from a FIRST INSTALL (no reload).
    const hadController = !!navigator.serviceWorker.controller;
    const onControllerChange = () => {
      if (hadController) {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    // 1. Register SW — onUpdate fires when a new SW finishes installing
    serviceWorkerRegistration.register({
      onUpdate: (reg, installedWorker) => {
        const sw = installedWorker || reg.waiting;
        if (sw) {
          setWaitingSW(sw);
          setUpdateAvailable(true);
        }
      },
    });

    // 2. Listen for custom event (emitted from other entry points if needed)
    const handleSWUpdate = (e) => {
      const sw = e.detail?.waiting;
      if (sw) {
        setWaitingSW(sw);
        setUpdateAvailable(true);
      }
    };
    window.addEventListener("swUpdateAvailable", handleSWUpdate);

    // 3. Fix Problem 4: on mount, check for a SW already waiting OR still installing.
    //    Covers the case where onupdatefound fired before the registration callback ran.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          // A new SW finished installing on a previous page load but was never activated.
          setWaitingSW(reg.waiting);
          setUpdateAvailable(true);
        } else if (reg?.installing) {
          // A new SW is mid-install right now — watch it complete.
          const sw = reg.installing;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingSW(sw);
              setUpdateAvailable(true);
            }
          });
        }
      });
    }

    // 4. Fix Problem 5: when user returns to tab, check waiting state FIRST (synchronous
    //    result), then trigger a background network check for new updates.
    //    reg.update() is async — do NOT check reg.waiting immediately after calling it.
    const handleVisibility = () => {
      if (!document.hidden && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (!reg) return;
          if (reg.waiting) {
            setWaitingSW(reg.waiting);
            setUpdateAvailable(true);
          }
          // Trigger a fresh network fetch of the SW file.
          // onupdatefound → onstatechange (in serviceWorkerRegistration) handles the result.
          reg.update();
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.removeEventListener("swUpdateAvailable", handleSWUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Auto-activate: when a waiting SW is detected, skip waiting.
  // The unconditional controllerchange listener above handles the reload —
  // no need to also attach controllerchange here.
  useEffect(() => {
    if (updateAvailable && waitingSW) {
      waitingSW.postMessage({ type: "SKIP_WAITING" });
    }
  }, [updateAvailable, waitingSW]);

  // refreshApp: for manual "Update" buttons if ever shown.
  // The controllerchange listener handles the reload automatically.
  const refreshApp = () => {
    if (!waitingSW) return;
    waitingSW.postMessage({ type: "SKIP_WAITING" });
  };

  return { updateAvailable, refreshApp };
}
