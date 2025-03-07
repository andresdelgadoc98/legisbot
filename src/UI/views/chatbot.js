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
import ModalSettings from "../components/ModalSettings";
import myImage from "./chatbot.png";
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
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dataUser, setdataUser] = useState({
    nombre: "",
    email: "",
  });
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      const searchParams = new URLSearchParams(location.search);
      const chatIdFromUrl = searchParams.get("chatId");

      if (chatIdFromUrl) {
        const response = await ChatAPI.getMessages(idUser, chatIdFromUrl);

        if (response.data) {
          setSelectedChatId(chatIdFromUrl);
          setMessages(response.data.contenido);
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }
    fetchData();
  }, [location.search]);

  useEffect(() => {
    async function fetchData() {
      const response = await DocumentApi.getDocuments();
      const response2 = await ChatAPI.getChats(idUser);
      const response3 = await UsersAPI.getInfo(idUser);

      if (!response2.error) {
        setSavedChats(response2.data);
        setdataUser(response3.data);
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

    if (isBotResponding) {
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
        setIsBotResponding(true);
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
        setIsBotResponding(true);
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

    const handleResponseEnd = () => {
      setIsBotResponding(false);
    };

    socket.on("response", handleResponse);
    socket.on("response_end", handleResponseEnd);
    return () => {
      socket.off("response", handleResponse);
      socket.off("response_end", handleResponseEnd);
    };
  }, [socket]);

  const handleOpenModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
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
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "64px",
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
              <Button variant="contained" onClick={handleOpenModal}>
                <AccountCircleIcon />
              </Button>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "4rem",
            bottom: "64px",
            left: 0,
            right: 0,
            overflowY: "auto",
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
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    component="img"
                    src={myImage}
                    alt="Halach Bot"
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />

                  <Typography
                    variant="h5"
                    sx={{ mt: 1, textAlign: "center" }}
                    gutterBottom
                  >
                    ¡Hola! Soy Halach Bot
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mt: 1, textAlign: "center" }}>
                  ¿En qué te puedo ayudar hoy?
                </Typography>
              </Box>
            </Box>
          ) : (
            <MessageContainer messages={messages} />
          )}
        </Box>

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
            isBotResponding={isBotResponding}
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
        setIsBotResponding={setIsBotResponding}
      />
      <ModalSearch
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        documentsList={documentsList}
        selectedType={searchType}
        setSelectedType={setsearchType}
      />
      <ModalSettings
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        dataUser={dataUser}
      />
    </div>
  );
};

export default Chat;
