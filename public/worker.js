var CACHE_NAME = "cache";
const version = "0.0.1";

// Install a service worker
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/offline.html",
        "/offline.css",
        "/static/media/Vazirmatn.eb0d9c6914c753f76252.ttf",
        //if you want cache the first page , add "/"
      ]);
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  clients.openWindow(
    "https://dev.to/ajayupreti/how-to-use-push-notifications-in-react-a-step-by-step-guide-341d"
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  if (
    event.request.mode === "navigate" ||
    (event.request.method === "GET" &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetch(event.request.url).catch((error) => {
        return caches.match("offline.html");
      })
    );
  } else {
    // if the resources arent in the cache ,
    // they are requested from the server
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

//for notify user when worker file is updated
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
