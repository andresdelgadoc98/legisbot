const CACHE_NAME = "cache";
const version = "0.0.1";

// Instalación del service worker
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
  self.skipWaiting();
});

// Manejar mensajes push de FCM
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json(); // Los datos enviados desde FCM
  }

  const title = data.notification?.title || "¡Notificación nueva!";
  const options = {
    body: data.notification?.body || "Haz clic para ver más detalles.",
    icon: data.notification?.icon || "/path/to/icon.png",
    data: {
      url: data.data?.url || "https://www.example.com", // URL específica desde FCM
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "https://www.example.com";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("navigate" in client) {
            return client.navigate(urlToOpen).then(() => client.focus());
          }
        }
        return clients.openWindow(urlToOpen);
      })
      .catch((err) => {
        console.error("Error al manejar el clic:", err);
      })
  );
});

// Manejo de fetch (sin cambios)
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

// Mensajes para actualizar el worker
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
