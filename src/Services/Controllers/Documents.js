import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "documents";
const documents = {};

const getDocuments = async () => {
  const accessToken = localStorage.getItem("accessToken");

  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
};

documents.getDocuments = getDocuments;

export default documents;
