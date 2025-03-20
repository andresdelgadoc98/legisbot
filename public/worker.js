const CACHE_NAME = "cache";
const version = "0.0.1";

// Install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/offline.html",
        "/offline.css",
        "/static/media/Vazirmatn.eb0d9c6914c753f76252.ttf",
      ]);
    })
  );
  self.skipWaiting(); // Activa el nuevo service worker inmediatamente
});

// Manejar clics en notificaciones
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow(
          event.notification.data?.url || "https://www.example.com"
        );
      })
  );
});

// Cache y retorno de requests
self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept")?.includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

// Notificar al usuario cuando el worker se actualiza
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
