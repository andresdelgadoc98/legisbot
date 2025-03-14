import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "documents";
const documents = {};

const getDocuments = async (jurisdiccion) => {
  const accessToken = localStorage.getItem("accessToken");

  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}?jurisdiccion=` + jurisdiccion, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
};

documents.getDocuments = getDocuments;

export default documents;
