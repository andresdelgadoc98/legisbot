import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "chats";
const chats = {};

const accessToken = localStorage.getItem("accessToken");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

const getChats = async (id_user) => {
  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${id_user}`, { headers })
  );
};

const createChat = async (id_user, titulo) => {
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}`,
      { titulo, id_user },
      {
        headers,
      }
    )
  );
};

const getMessages = async (id_user, id_chat) => {
  return await resolve(
    axios.get(
      `${config.BACKEND_URL}/${name}/obtener_contenido_chat?chat_id=${id_chat}&usuario_id=${id_user}`,
      {
        headers,
      }
    )
  );
};

const deleteChat = async (id_chat) => {
  return await resolve(
    axios.delete(`${config.BACKEND_URL}/${name}/${id_chat}`, {
      headers,
    })
  );
};

const updateContexto = async (id_chat, contexto) => {
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${id_chat}/contexto`,
      { contexto },
      {
        headers,
      }
    )
  );
};

const getContext = async (id_chat) => {
  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${id_chat}/contexto`, {
      headers,
    })
  );
};

const putPreferences = async (id_chat, searchType, document) => {
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${id_chat}/preferencia`,
      {
        preferencia: {
          searchType,
          document,
        },
      },
      {
        headers,
      }
    )
  );
};

chats.getChats = getChats;
chats.createChat = createChat;
chats.getMessages = getMessages;
chats.deleteChat = deleteChat;
chats.updateContexto = updateContexto;
chats.getContext = getContext;
chats.putPreferences = putPreferences;
export default chats;
