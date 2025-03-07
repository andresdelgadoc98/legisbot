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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import SearchTypeButton from "../components/SearchTypeButton";

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
  const [searchType, setsearchType] = useState(null);
  const [context, setContext] = useState("");
  const [name_file, setname_file] = useState("#");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const searchParams = new URLSearchParams(location.search);
      const chatIdFromUrl = searchParams.get("chatId");
      const response = await ChatAPI.getMessages(idUser, chatIdFromUrl);

      if (chatIdFromUrl) {
        setSelectedChatId(chatIdFromUrl);
        setMessages(response.data.contenido);
      }
    }
    fetchData();
  }, [location.search]);

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
      console.log({ response });
      const response2 = await ChatAPI.getChats(idUser);
      if (!response2.error) {
        setSavedChats(response2.data);
      }

      setdocumentsList(response.data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedChatId !== null) {
        try {
          const response = await ChatAPI.getContext(selectedChatId);
          setContext(response.data.contexto);
        } catch (error) {
          console.error("Error al cargar el contexto:", error);
        }
      } else {
        setContext("");
      }
    }

    fetchData();
  }, [selectedChatId]);

  const handleSendMessage = async () => {
    if (searchType === "jurisprudencias" && context.length === 0) {
      alert(
        "Por favor, proporciona un contexto antes de buscar jurisprudencias."
      );
      return;
    }

    if (currentMessage.trim()) {
      if (messages.length == 0 && selectedChatId == null) {
        const result = await ChatAPI.createChat(
          idUser,
          currentMessage.substring(0, 45)
        );
        const response2 = await ChatAPI.getChats(idUser);

        setSavedChats(response2.data);
        setSelectedChatId(result.data.chat_id);

        setMessages((prev) => [
          ...prev,
          { text: currentMessage, sender: "user" },
        ]);
        setCurrentMessage("");

        if (messages.length === 0 && searchType === "jurisprudencias") {
          return;
        }

        socket.emit(
          "message",
          JSON.stringify({
            text: currentMessage,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: idUser,
            searchType: searchType,
          })
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { text: currentMessage, sender: "user" },
        ]);
        setCurrentMessage("");

        socket.emit(
          "message",
          JSON.stringify({
            text: currentMessage,
            folder: selectedValue,
            chat_id: selectedChatId,
            usuario_id: idUser,
            searchType: searchType,
          })
        );
      }
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
    setMessages(response.data.contenido);

    // Actualizar la URL con el nuevo chatId
    const searchParams = new URLSearchParams();
    searchParams.set("chatId", chatId);
    navigate({ search: searchParams.toString() });
  };

  const handleOpenContextModal = async () => {
    setIsContextModalOpen(true);
  };

  const handleConfirm = (type, option) => {
    setsearchType(type);
    if (type === "jurisprudencias") {
      return;
    }
    if (type === "documentos") {
      setSelectedValue(option);
      setname_file(documentsList.find((doc) => doc.folder === option)["file"]);
      return;
    }
    if (type === "general") {
      setsearchType(null);
      setSelectedValue("");
    }
  };

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          height: "100dvh",
          width: "100%",
          fontFamily: "'Roboto', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header fijo */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "64px", // Altura fija del header
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            zIndex: 1000,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box display="flex" alignItems="center">
            <FormControl variant="outlined" sx={{ ml: 2 }}>
              <SearchTypeButton searchType={searchType} name_file={name_file} />
            </FormControl>
            <FormControl variant="outlined" sx={{ ml: 2 }}>
              <Button variant="contained" onClick={() => setModalOpen(true)}>
                <SearchIcon />
              </Button>
            </FormControl>
            <FormControl variant="outlined" sx={{ ml: 2 }}>
              <Button variant="contained" onClick={handleOpenContextModal}>
                <BalanceIcon />
              </Button>
            </FormControl>
            <FormControl variant="outlined" sx={{ ml: 2 }}>
              <Button variant="contained">
                <AccountCircleIcon />
              </Button>
            </FormControl>
          </Box>
        </Box>

        {/* Área scrollable para los mensajes */}
        <Box
          sx={{
            position: "absolute",
            top: "4rem", // Justo debajo del header
            bottom: "64px", // Justo encima del input de mensajes
            left: 0,
            right: 0,
            overflowY: "auto", // El scroll se restringe a esta zona
            p: 2,
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Hola! soy Halach Bot
              </Typography>
              <Typography variant="body1">
                ¿En qué te puedo ayudar hoy?
              </Typography>
            </Box>
          ) : (
            <MessageContainer messages={messages} />
          )}
        </Box>

        {/* Input de mensajes fijo en la parte inferior */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "64px",
            boxShadow: "0px -2px 4px rgba(0,0,0,0.1)",
            zIndex: 1000,
            p: 1,
          }}
        >
          <Message
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            handleSendMessage={handleSendMessage}
            searchType={searchType}
            name_file={name_file}
          />
        </Box>
      </Box>

      <SideBar
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        handleChatSelection={handleChatSelection}
        savedChats={savedChats}
        setSavedChats={setSavedChats}
        setMessages={setMessages}
        setSelectedChatId={setSelectedChatId}
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
        context={context}
        setContext={setContext}
        searchType={searchType}
      />
      <ModalSearch
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        documentsList={documentsList}
        selectedType={searchType}
        setSelectedType={setsearchType}
      />
    </div>
  );
};

export default Chat;
