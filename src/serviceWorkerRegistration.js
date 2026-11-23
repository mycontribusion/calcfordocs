const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

// Fix Problem 3: extracted so we can attach to an already-installing worker
// AND to future workers found via onupdatefound — without duplicating logic.
function trackInstallingWorker(installingWorker, registration, config) {
  if (!installingWorker) return;
  installingWorker.onstatechange = () => {
    if (installingWorker.state === 'installed') {
      if (navigator.serviceWorker.controller) {
        if (config && config.onUpdate) {
          config.onUpdate(registration, installingWorker);
        }
      }
    }
  };
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Fix Problem 3: if the browser already started installing an update
      // before this .then() ran, onupdatefound already fired and was missed.
      // Catch it here by checking registration.installing directly.
      if (registration.installing) {
        trackInstallingWorker(registration.installing, registration, config);
      }

      registration.onupdatefound = () => {
        trackInstallingWorker(registration.installing, registration, config);
      };
    })
    .catch((error) => console.error('Error during SW registration:', error));
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
}