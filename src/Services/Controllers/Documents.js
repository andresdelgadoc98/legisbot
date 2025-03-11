import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "documents";
const documents = {};
const accessToken = localStorage.getItem("accessToken");
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

const getDocuments = async () => {
  return await resolve(axios.get(`${config.BACKEND_URL}/${name}`), {
    headers,
  });
};

documents.getDocuments = getDocuments;

export default documents;
