// /src/Utils/servicesWorker.js
export function register(config) {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = "/worker.js"; // Ruta relativa a /public
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log(
            "Service Worker registrado con éxito:",
            registration.scope
          );
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }
        })
        .catch((err) => {
          console.error("Error al registrar el Service Worker:", err);
        });
    });
  } else {
    console.log("Service Worker no soportado por el navegador.");
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((err) => {
        console.error("Error al desregistrar:", err);
      });
  }
}
