import axios from "axios";
import { resolve } from "../resolver";
import config from "../../config/config";

const name = "chats";
const chats = {};

const getChats = async (id_user) => {
  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${id_user}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

const createChat = async (id_user, titulo) => {
  return await resolve(
    axios.post(
      `${config.BACKEND_URL}/${name}`,
      { titulo, id_user }, // Datos del cuerpo de la solicitud
      {
        headers: {
          "Content-Type": "application/json", // Agregar el encabezado
        },
      }
    )
  );
};

const getMessages = async (id_user, id_chat) => {
  return await resolve(
    axios.get(
      `${config.BACKEND_URL}/${name}/obtener_contenido_chat?chat_id=${id_chat}&usuario_id=${id_user}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
};

const deleteChat = async (id_chat) => {
  return await resolve(
    axios.delete(`${config.BACKEND_URL}/${name}/${id_chat}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

const updateContexto = async (id_chat, contexto) => {
  return await resolve(
    axios.put(
      `${config.BACKEND_URL}/${name}/${id_chat}/contexto`,
      { contexto },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  );
};

const getContext = async (id_chat) => {
  return await resolve(
    axios.get(`${config.BACKEND_URL}/${name}/${id_chat}/contexto`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

chats.getChats = getChats;
chats.createChat = createChat;
chats.getMessages = getMessages;
chats.deleteChat = deleteChat;
chats.updateContexto = updateContexto;
chats.getContext = getContext;

export default chats;
