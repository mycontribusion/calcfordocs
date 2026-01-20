export function register(config) {
  if ('serviceWorker' in navigator) {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content available
                    if (config && config.onUpdate) {
                      config.onUpdate(registration);
                    }
                  } else {
                    // First install
                    if (config && config.onSuccess) {
                      config.onSuccess(registration);
                    }
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
