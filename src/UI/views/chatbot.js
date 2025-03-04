import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import io from "socket.io-client";
import MessageContainer from "../components/MessageContainer";
import Message from "../components/Message";
import DocumentApi from "../../Services/Controllers/Documents";
import SideBar from "../components/SideBar";
import ChatAPI from "../../Services/Controllers/Chats";
import config from "../../config/config";
const socket = io(config.BACKEND_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [documentsList, setdocumentsList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [context, setContext] = useState("");

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
      const response2 = await ChatAPI.getChats(1);
      setSavedChats(response2.data);
      setdocumentsList(response.data);
      setSelectedValue(response.data[0].folder);
    }

    fetchData();
  }, []);

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      if (messages.length == 0) {
        const result = await ChatAPI.createChat(
          1,
          currentMessage.substring(0, 45)
        );
        const response2 = await ChatAPI.getChats(1);
        setSavedChats(response2.data);
        socket.emit(
          "message",
          JSON.stringify({
            text: currentMessage,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: 1,
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
            usuario_id: 1,
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
    const response = await ChatAPI.getMessages(1, chatId);

    setSelectedChatId(chatId);
    setMessages(response.data.contenido);
  };

  const handleOpenContextModal = async () => {
    try {
      const response = await ChatAPI.getContext(selectedChatId);
      setContext(response.data.contexto);
    } catch (error) {
      console.error("Error al cargar el contexto:", error);
    }
    setIsContextModalOpen(true);
  };

  const handleCloseContextModal = () => {
    setIsContextModalOpen(false);
  };

  const handleSendContext = async () => {
    if (context.trim()) {
      if (messages.length === 0) {
        const result = await ChatAPI.createChat(1, context.substring(0, 45));
        const response2 = await ChatAPI.getChats(1);
        setSavedChats(response2.data);

        await ChatAPI.updateContexto(result.data.chat_id, context);
        socket.emit(
          "message",
          JSON.stringify({
            text: context,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: 1,
          })
        );

        setIsContextModalOpen(false);
        setContext("");
        setSelectedChatId(result.data.chat_id);
        setMessages((prev) => [...prev, { text: context, sender: "user" }]);
        setCurrentMessage("");
      } else {
        ChatAPI.updateContexto(selectedChatId, context);
        setIsContextModalOpen(false);
        setContext("");
      }
    }
  };

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{ color: "white" }}
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
          backgroundColor: "#292a2d",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" align="center" color="white" gutterBottom>
            Selecciona el Documento:
          </Typography>
          <FormControl variant="outlined" style={{ marginLeft: "16px" }}>
            <Select
              labelId="select-label"
              value={selectedValue}
              onChange={(event) => setSelectedValue(event.target.value)}
              label="Selecciona una opción"
              sx={{
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              }}
            >
              {documentsList.map((item, index) => (
                <MenuItem key={index} value={item.folder}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" style={{ marginLeft: "16px" }}>
            <Button
              variant="contained"
              onClick={handleOpenContextModal}
              sx={{
                backgroundColor: "#3f51b5",
                color: "white",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
            >
              Contexto
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
            <Typography variant="h5" color="white" gutterBottom>
              Hola! soy LegisBot
            </Typography>
            <Typography variant="body1" color="white">
              ¿En que te puedo ayudar hoy?
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        <MessageContainer messages={messages} />
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

      <Modal
        open={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <TextField
            multiline
            rows={4}
            placeholder="Proporciona un contexto o caso específico..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            sx={{ width: "100%", marginBottom: "8px" }}
          />
          <Button
            variant="contained"
            onClick={handleSendContext}
            sx={{ width: "100%" }}
          >
            Guardar contexto
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Chat;
