import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./Utils/servicesWorker";

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

serviceWorker.register({
  onSuccess: (registration) => {
    console.log("Service Worker listo para FCM");

    window.swRegistration = registration;
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
