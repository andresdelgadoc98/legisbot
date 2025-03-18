import UsersAPI from "./Controllers/Users";
import tokenAPI from "./Controllers/token";
import axios from "axios";
export async function resolve(promise, isTokenRefresh = false) {
  const resolved = {
    data: null,
    error: null,
  };
  let response;
  try {
    response = await promise;
    resolved.data = response.data;
  } catch (error) {
    if (error.response.status === 403 || error.response.status === 401) {
      console.log({ error });
      const refreshSuccess = await tokenAPI.getAccessToken();

      if (refreshSuccess.data) {
        try {
          localStorage.setItem("accessToken", refreshSuccess.data.access_token);
          const retryConfig = {
            ...error.config,
            headers: {
              ...error.config.headers,
              Authorization: `Bearer ${refreshSuccess.data.access_token}`,
            },
          };
          const retryResponse = await axios(retryConfig);

          resolved.data = retryResponse.data;
        } catch (retryError) {
          console.log({ retryError });
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
