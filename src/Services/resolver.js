import axios from "axios";
import config from "../config/config";

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(
      `${config.BACKEND_URL}/users/refresh-token`,
      {
        refresh_token: refreshToken,
      }
    );
    console.log(response);
    const newAccessToken = response.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
    throw error;
  }
};

// Resolver actualizado
export async function resolve(promise) {
  const resolved = {
    data: null,
    error: null,
  };

  try {
    let response = await promise;

    // Si la respuesta es un error 401, intentar refrescar el token
    if (response.status === 401) {
      const newAccessToken = await refreshToken();

      // Reintentar la solicitud original con el nuevo access token
      const originalRequest = response.config;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await axios(originalRequest);
    }

    resolved.data = response.data;
  } catch (error) {
    resolved.error = error;
  }

  return resolved;
}
