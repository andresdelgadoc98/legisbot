import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";
import { jwtDecode } from "jwt-decode";

const name = "users";
const users = {};

const login = async (email, password) => {
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
};

const getrefreshToken = async (refresh_token) => {
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}/refresh_token`,
      {
        refresh_token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
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

users.login = login;
users.getrefreshToken = getrefreshToken;
users.getID = getID;
export default users;
