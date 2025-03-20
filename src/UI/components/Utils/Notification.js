import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "../../../Utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
const Notification = ({ isFirstLogin }) => {
  const [notifications, setNotification] = useState({ title: "", body: "" });
  const [tokenRequested, setTokenRequested] = useState(false);

  const notify = (title, body) =>
    toast(<ToastDisplay title={title} body={body} />, {
      position: "top-right",
      autoClose: 5000,
    });

  function ToastDisplay({ title, body }) {
    return (
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    );
  }

  const handleEnableNotifications = async () => {
    const registration = window.swRegistration;
    if (!registration) {
      console.error("Service Worker no registrado aún.");
      return;
    }

    const token = await requestForToken(registration);
    if (token) {
      setTokenRequested(true);
      onMessageListener()
        .then((payload) => {
          console.log("Mensaje recibido:", payload);
          setNotification({
            title: payload?.notification?.title || "Notificación",
            body: payload?.notification?.body || "Nuevo mensaje",
          });
          notify(payload?.notification?.title, payload?.notification?.body);
        })
        .catch((err) => console.log("Error en listener:", err));
    }
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("fcmToken");
    console.log(existingToken);

    if (existingToken) {
      setTokenRequested(true);
      onMessageListener()
        .then((payload) => {
          console.log("Mensaje recibido:", payload);
          setNotification({
            title: payload?.notification?.title || "Notificación",
            body: payload?.notification?.body || "Nuevo mensaje",
          });
          notify(payload?.notification?.title, payload?.notification?.body);
        })
        .catch((err) => console.log("Error en listener:", err));
    }
  }, []);

  return (
    <>
      {!tokenRequested && isFirstLogin && (
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleEnableNotifications}
        >
          Activar Notificaciones
        </Button>
      )}
    </>
  );
};

export default Notification;
