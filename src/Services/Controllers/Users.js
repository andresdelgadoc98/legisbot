import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "users";
const users = {};

const login = async (email, password) => {
  return await resolve(
    axios.post(`${config.BACKEND_URL}/${name}/login`),
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

users.login = login;

export default users;
