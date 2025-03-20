import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./Utils/servicesWorker";

serviceWorker.register({
  onSuccess: (registration) => {
    console.log("Service Worker listo para FCM");

    window.swRegistration = registration;
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
