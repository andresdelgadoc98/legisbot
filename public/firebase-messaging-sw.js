// /public/worker.js
const CACHE_NAME = "cache";
const version = "0.0.13";

// Importar Firebase
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDW54wAh1830gEDwI4Lm7EJjnenwmQHVGQ",
  authDomain: "halachia-afd77.firebaseapp.com",
  projectId: "halachia-afd77",
  storageBucket: "halachia-afd77.firebasestorage.app",
  messagingSenderId: "861922976469",
  appId: "1:861922976469:web:9e6791d907145c5334385c",
  measurementId: "G-6Z2R9VB53M",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener instancia de Firebase Messaging
const messaging = firebase.messaging();

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker instalado");
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

// Actualización del Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar mensajes push de FCM
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const title = payload.notification?.title || "¡Notificación nueva!";
  const options = {
    body: payload.notification?.body || "Haz clic para ver más detalles.",
    icon: payload.notification?.icon || "/favicon.ico",
    data: {
      url: payload.data?.url || "https://localhost:3000/jurisprudencias",
    },
  };

  return self.registration.showNotification(title, options);
});

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
  console.log("Clic en notificación detectado:", event.notification);
  event.notification.close();

  const urlToOpen =
    event.notification.data?.url || "https://localhost:3000/jurisprudencias";
  console.log("Intentando abrir:", urlToOpen);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        console.log("Clientes encontrados:", clientList.length);
        for (const client of clientList) {
          if ("navigate" in client) {
            console.log("Navegando a:", urlToOpen);
            return client.navigate(urlToOpen).then(() => client.focus());
          }
        }
        console.log("Abriendo nueva ventana:", urlToOpen);
        return clients.openWindow(urlToOpen);
      })
      .catch((err) => {
        console.error("Error al manejar el clic:", err);
      })
  );
});

// Manejo de fetch (offline)
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

// Actualización manual
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
