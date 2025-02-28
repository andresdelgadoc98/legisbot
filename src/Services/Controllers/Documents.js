import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "documents";
const documents = {};

const getDocuments = async (id_reporte) => {
  return await resolve(axios.get(`${config.BACKEND_URL}/${name}`));
};

documents.getDocuments = getDocuments;

export default documents;
