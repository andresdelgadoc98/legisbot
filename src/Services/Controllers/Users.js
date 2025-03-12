import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const name = "users";
const users = {};

const login = async (email, password) => {
  return await axios.post(
    `${config.BACKEND_URL}/${name}/login`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getID = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No se encontró el token de acceso");
      return null;
    }

    const decodedToken = jwtDecode(accessToken);

    if (decodedToken && decodedToken.sub) {
      return decodedToken.sub;
    } else {
      console.error("El token no contiene el ID del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
};

const getInfo = async (idUser) => {
  const accessToken = localStorage.getItem("accessToken");

  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${idUser}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
};

const logut = async (idUser) => {
  localStorage.removeItem("accessToken");
  Cookies.remove("refresh_token");
  console.log("token removes");
  window.location.reload();
  return true;
};

users.logut = logut;
users.getInfo = getInfo;
users.login = login;
users.getID = getID;

export default users;
