import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import notification from "../Services/Controllers/Notification";
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
// Función para solicitar token
export const requestForToken = () => {
  if (!messaging) {
    console.log(
      "Messaging no disponible. Se requiere HTTPS o localhost para obtener un token."
    );
    return Promise.resolve(null); // Devuelve una promesa resuelta con null
  }

  return getToken(messaging, {
    vapidKey: `BDqVqQXskoAkiw7rHy1JmvxIixFcMPLLz-FmTTRn8NIrV1T9r32QQ9zptdVK8yfhhNwZwIEORNcV8vxPYFzdScQ`,
  })
    .then((currentToken) => {
      console.log({ currentToken });
      if (currentToken) {
        notification.sendToken(currentToken);
        if (
          localStorage.getItem("fcmToken") &&
          currentToken !== localStorage.getItem("fcmToken")
        ) {
          localStorage.setItem("fcmToken", currentToken);
        } else if (!localStorage.getItem("fcmToken")) {
          localStorage.setItem("fcmToken", currentToken);
        }
        return currentToken; // Devolvemos el token para uso posterior si lo necesitas
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      return null;
    });
};

export const onMessageListener = () => {
  if (!messaging) {
    console.log(
      "Messaging no disponible. Se requiere HTTPS o localhost para escuchar mensajes."
    );
    return Promise.resolve(null); // Devuelve una promesa resuelta con null
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log({ payload });
      resolve(payload);
    });
  });
};
