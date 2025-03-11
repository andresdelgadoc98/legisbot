import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "token";
const token = {};
const accessToken = localStorage.getItem("accessToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
  withCredentials: true,
};

const very_refresh_access = async () => {
  return await resolve(
    axios.post(`${config.BACKEND_URL}/${name}/very_access_token`, {}, headers)
  );
};

const very_access_token = async (access_token) => {
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}/very_access_token`,
      { access_token },
      headers
    )
  );
};

const getAccessToken = async () => {
  return await axios.post(
    `${config.BACKEND_URL}/${name}/refresh_token`,
    {},
    headers
  );
};

token.very_refresh_access = very_refresh_access;
token.very_access_token = very_access_token;
token.getAccessToken = getAccessToken;

export default token;
