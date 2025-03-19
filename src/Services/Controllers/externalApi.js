import axios from "axios";
import config from "../../config/config";
const externalAPI = {};
const getJurisprudencias = async (yearWeek) => {
  try {
    const response = await axios.post(
      `${config.BACKEND_URL}/documents/jurisprudencias`,
      { yearWeek },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener jurisprudencias:", error);
    throw error;
  }
};

externalAPI.getJurisprudencias = getJurisprudencias;
export default externalAPI;
