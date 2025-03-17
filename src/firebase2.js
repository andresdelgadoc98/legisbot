import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDW54wAh1830gEDwI4Lm7EJjnenwmQHVGQ",
  authDomain: "halachia-afd77.firebaseapp.com",
  projectId: "halachia-afd77",
  storageBucket: "halachia-afd77.firebasestorage.app",
  messagingSenderId: "861922976469",
  appId: "1:861922976469:web:9e6791d907145c5334385c",
  measurementId: "G-6Z2R9VB53M",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  // The method getToken(): Promise<string> allows FCM to use the VAPID key credential
  // when sending message requests to different push services
  return getToken(messaging, {
    vapidKey: `BDqVqQXskoAkiw7rHy1JmvxIixFcMPLLz-FmTTRn8NIrV1T9r32QQ9zptdVK8yfhhNwZwIEORNcV8vxPYFzdScQ`,
  }) //to authorize send requests to supported web push services
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);

        if (
          localStorage.getItem("fcmToken") &&
          currentToken !== localStorage.getItem("fcmToken")
        ) {
          localStorage.setItem("fcmToken", currentToken);
        } else if (!localStorage.getItem("fcmToken")) {
          localStorage.setItem("fcmToken", currentToken);
        }
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
