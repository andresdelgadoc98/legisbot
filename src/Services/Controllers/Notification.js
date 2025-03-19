import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";
import users from "./Users";
const name = "notification";
const notification = {};

const sendToken = async (token_notification) => {
  const accessToken = localStorage.getItem("accessToken");
  const idUser = users.getID();
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${idUser}`,
      { token_notification },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  );
};

notification.sendToken = sendToken;
export default notification;
