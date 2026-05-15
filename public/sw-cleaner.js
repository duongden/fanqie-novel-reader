/**
 * Runs before the app bundle. Unregisters any legacy Workbox/vite-plugin-pwa
 * service workers and clears Cache Storage so fetches are not intercepted.
 */
(async function () {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* ignore */
  }
})();
