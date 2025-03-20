import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "../../../Utils/firebase";
import { ToastContainer, toast } from "react-toastify";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);

  function ToastDisplay() {
    return <div></div>;
  }

  const existingToken = localStorage.getItem("fcmToken");
  console.log(existingToken);
  if (existingToken == null) {
    requestForToken();
  }

  onMessageListener()
    .then((payload) => {
      console.log({ payload });
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));
};

export default Notification;
