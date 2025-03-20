import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./Utils/servicesWorker";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

/*
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.ready.then((registration) => {
    console.log("holaa");
    registration.showNotification("¡Nueva actualización!", {
      body: "Haz clic para ver más detalles.",
      icon: "/path/to/icon.png",
      data: {
        url: "https://localhost:3000/jurisprudencias",
      },
    });
  });
}
 */

const firebaseConfig = {
  apiKey: "AIzaSyDW54wAh1830gEDwI4Lm7EJjnenwmQHVGQ",
  authDomain: "halachia-afd77.firebaseapp.com",
  projectId: "halachia-afd77",
  storageBucket: "halachia-afd77.firebasestorage.app",
  messagingSenderId: "861922976469",
  appId: "1:861922976469:web:9e6791d907145c5334385c",
  measurementId: "G-6Z2R9VB53M",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
serviceWorker.register({
  onSuccess: (registration) => {
    console.log("Service Worker listo para FCM");
    // Obtener el token de FCM
    getToken(messaging, {
      vapidKey:
        "BDqVqQXskoAkiw7rHy1JmvxIixFcMPLLz-FmTTRn8NIrV1T9r32QQ9zptdVK8yfhhNwZwIEORNcV8vxPYFzdScQ", // Reemplaza con tu clave VAPID de Firebase
      serviceWorkerRegistration: registration,
    })
      .then((token) => {
        console.log("Token de FCM:", token);
        // Envía este token a tu servidor para enviar notificaciones
      })
      .catch((err) => {
        console.error("Error al obtener token:", err);
      });
  },
});

onMessage(messaging, (payload) => {
  console.log("Mensaje recibido en primer plano:", payload);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
