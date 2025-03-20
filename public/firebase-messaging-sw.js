// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDW54wAh1830gEDwI4Lm7EJjnenwmQHVGQ",
  authDomain: "halachia-afd77.firebaseapp.com",
  projectId: "halachia-afd77",
  storageBucket: "halachia-afd77.firebasestorage.app",
  messagingSenderId: "861922976469",
  appId: "1:861922976469:web:9e6791d907145c5334385c",
  measurementId: "G-6Z2R9VB53M",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log({ payload });
  console.log("Received background message ", payload);
});

// Update a service worker
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
