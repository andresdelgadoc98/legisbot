// /src/Utils/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import notification from "../Services/Controllers/Notification"; // Ajusta la ruta si es necesario

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

const isMessagingSupported = () =>
  "serviceWorker" in navigator &&
  (window.location.protocol === "https:" ||
    window.location.hostname === "localhost");

let messaging = null;

if (isMessagingSupported()) {
  try {
    messaging = getMessaging(app);
    console.log("Firebase Messaging inicializado correctamente.");
  } catch (error) {
    console.error("Error al inicializar Firebase Messaging:", error);
    messaging = null;
  }
} else {
  console.log(
    "Firebase Messaging no está soportado en este entorno (requiere HTTPS o localhost)."
  );
}

// Función para solicitar permisos y token
export const requestForToken = async (serviceWorkerRegistration) => {
  if (!messaging) {
    console.log(
      "Messaging no disponible. Se requiere HTTPS o localhost para obtener un token."
    );
    return null;
  }

  try {
    // Verificar y solicitar permisos
    if (Notification.permission === "granted") {
      console.log("Permisos ya otorgados");
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Permisos denegados por el usuario");
        return null;
      }
      console.log("Permisos otorgados por el usuario");
    } else {
      console.log("Permisos ya denegados previamente");
      return null;
    }

    // Obtener el token
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BDqVqQXskoAkiw7rHy1JmvxIixFcMPLLz-FmTTRn8NIrV1T9r32QQ9zptdVK8yfhhNwZwIEORNcV8vxPYFzdScQ",
      serviceWorkerRegistration, // Asociar con el service worker
    });

    if (currentToken) {
      console.log("Token de FCM:", currentToken);
      notification.sendToken(currentToken); // Enviar al servidor
      if (
        localStorage.getItem("fcmToken") &&
        currentToken !== localStorage.getItem("fcmToken")
      ) {
        localStorage.setItem("fcmToken", currentToken);
      } else if (!localStorage.getItem("fcmToken")) {
        localStorage.setItem("fcmToken", currentToken);
      }
      return currentToken;
    } else {
      console.log(
        "No registration token available. Asegúrate de que los permisos estén otorgados."
      );
      return null;
    }
  } catch (err) {
    console.error("Error al obtener el token:", err);
    return null;
  }
};

// Listener para mensajes en primer plano
export const onMessageListener = () => {
  if (!messaging) {
    console.log(
      "Messaging no disponible. Se requiere HTTPS o localhost para escuchar mensajes."
    );
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Mensaje recibido en primer plano:", payload);
      resolve(payload); // Resolver con el payload para usarlo en el componente
    });
  });
};

export default messaging;
