import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "chats";
const chats = {};

const getChats = async (id_user) => {
  const accessToken = localStorage.getItem("accessToken");
  const promise = axios.get(`${config.BACKEND_URL}/chats/${id_user}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await resolve(promise);
};

const createChat = async (id_user, titulo) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}`,
      { titulo, id_user },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  );
};

const getMessages = async (id_user, id_chat) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.get(
      `${config.BACKEND_URL}/${name}/obtener_contenido_chat?chat_id=${id_chat}&usuario_id=${id_user}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  );
};

const deleteChat = async (id_chat) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.delete(`${config.BACKEND_URL}/${name}/${id_chat}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
};

const updateContexto = async (id_chat, contexto) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${id_chat}/contexto`,
      { contexto },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
  );
};

const getContext = async (id_chat) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${id_chat}/contexto`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
};

const putPreferences = async (
  id_chat,
  searchType,
  document,
  jurisdiccionSelected
) => {
  const accessToken = localStorage.getItem("accessToken");
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${id_chat}/preferencia`,
      {
        preferencia: {
          searchType,
          document,
          jurisdiccionSelected,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
