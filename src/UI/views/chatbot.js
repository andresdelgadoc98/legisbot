import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import config from "../../config/config";
import DocumentApi from "../../Services/Controllers/Documents";
import ChatAPI from "../../Services/Controllers/Chats";
import UsersAPI from "../../Services/Controllers/Users";
import {
  Box,
  Typography,
  FormControl,
  IconButton,
  Button,
} from "@mui/material";
import BalanceIcon from "@mui/icons-material/Balance";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import {
  MessageContainer,
  Message,
  SideBar,
  ModalContext,
  ModalSearch,
} from "../components";

const socket = io(config.BACKEND_URL);
const idUser = UsersAPI.getID();
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [documentsList, setdocumentsList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchType, setsearchType] = useState("documentos");

  useEffect(() => {
    const handleResponse = (data) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.sender === "bot") {
          return [
            ...prev.slice(0, -1),
            { text: lastMessage.text + data, sender: "bot" },
          ];
        }
        return [...prev, { text: data, sender: "bot" }];
      });
    };

    socket.on("response", handleResponse);
    socket.on("response_end", () => {});
    return () => {
      socket.off("response", handleResponse);
      socket.off("response_end");
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await DocumentApi.getDocuments();
      const response2 = await ChatAPI.getChats(idUser);
      if (!response2.error) {
        setSavedChats(response2.data);
      }

      setdocumentsList(response.data);
    }

    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      console.log({ selectedValue });
      if (messages.length == 0) {
        const result = await ChatAPI.createChat(
          idUser,
          currentMessage.substring(0, 45)
        );
        const response2 = await ChatAPI.getChats(idUser);

        setSavedChats(response2.data);
        socket.emit(
          "message",
          JSON.stringify({
            text: currentMessage,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: idUser,
          })
        );
        setSelectedChatId(result.data.chat_id);
      } else {
        socket.emit(
          "message",
          JSON.stringify({
            text: currentMessage,
            folder: selectedValue,
            chat_id: selectedChatId,
            usuario_id: idUser,
          })
        );
      }

      setMessages((prev) => [
        ...prev,
        { text: currentMessage, sender: "user" },
      ]);
      setCurrentMessage("");
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleChatSelection = async (chatId) => {
    const response = await ChatAPI.getMessages(idUser, chatId);
    setSelectedChatId(chatId);
    console.log(response.data);
    setMessages(response.data.contenido);
  };

  const handleOpenContextModal = async () => {
    setIsContextModalOpen(true);
  };

  const handleConfirm = (type, option) => {
    if (type === "jurisprudencias") {
      return;
    }
    if (type === "documentos") {
      setSelectedValue(option);
      return;
    }
    setsearchType(type);
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "90vh",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "16px",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <FormControl
            variant="outlined"
            style={{ marginLeft: "16px" }}
            onClick={() => setModalOpen(true)}
          >
            <Button variant="contained">
              <SearchIcon />
            </Button>
          </FormControl>

          <FormControl variant="outlined" style={{ marginLeft: "16px" }}>
            <Button variant="contained" onClick={handleOpenContextModal}>
              <BalanceIcon />
            </Button>
          </FormControl>
        </Box>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Hola! soy Halach Bot
            </Typography>
            <Typography variant="body1">
              ¿En que te puedo ayudar hoy?
            </Typography>
          </Box>
        ) : (
          <MessageContainer messages={messages} />
        )}

        <Message
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
        />
      </Box>

      <SideBar
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        handleChatSelection={handleChatSelection}
        savedChats={savedChats}
        setSavedChats={setSavedChats}
        setMessages={setMessages}
      />
      <ModalContext
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setIsContextModalOpen={setIsContextModalOpen}
        isContextModalOpen={isContextModalOpen}
        messages={messages}
        setMessages={setMessages}
        setSavedChats={setSavedChats}
        setCurrentMessage={setCurrentMessage}
        socket={socket}
        selectedValue={selectedValue}
      />
      <ModalSearch
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        documentsList={documentsList}
      />
    </div>
  );
};

export default Chat;
