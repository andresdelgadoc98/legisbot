import UsersAPI from "./Controllers/Users";
import tokenAPI from "./Controllers/token";
import axios from "axios";
export async function resolve(promise) {
  const resolved = {
    data: null,
    error: null,
  };
  let response;
  try {
    response = await promise;
    resolved.data = response.data;
  } catch (error) {
    if (error.status === 403) {
      const refreshSuccess = await tokenAPI.getAccessToken();
      if (refreshSuccess.data) {
        try {
          localStorage.setItem("accessToken", refreshSuccess.data.access_token);
          const originalRequest = error.config;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${refreshSuccess.data.access_token}`;
          const retryResponse = await axios(originalRequest);
          resolved.data = retryResponse.data;
        } catch (retryError) {
          resolved.error = retryError;
          await UsersAPI.logut();
        }
      } else {
        await UsersAPI.logut();
      }
    } else {
      resolved.error = error;
    }
  }

  return resolved;
}
