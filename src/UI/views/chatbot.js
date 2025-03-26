import React, { useState, useEffect } from "react";
import config from "../../config/config";
import DocumentApi from "../../Services/Controllers/Documents";
import ChatAPI from "../../Services/Controllers/Chats";
import UsersAPI from "../../Services/Controllers/Users";
import { Box, Typography } from "@mui/material";
import {
  MessageContainer,
  Message,
  SideBar,
  ModalContext,
  ModalSearch,
  Header,
} from "../components";
import { useNavigate, useLocation } from "react-router-dom";
import myImage from "../../assets/chatbot.png";
import io from "socket.io-client";
import SideBarMain from "../components/SideBars/SideBarMain";

const socket = io(config.WEB_SOCKET_URL, {
  transports: ["websocket"],
});

const Chat = () => {
  const idUser = UsersAPI.getID();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [searchType, setsearchType] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [savedChats, setSavedChats] = useState([]);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [context, setContext] = useState("");
  const [name_file, setname_file] = useState("#");
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [documentsList, setdocumentsList] = useState([]);
  const [jurisdiccion, setJurisdiccion] = useState("federal");
  const [jurisdiccionSelected, setJurisdicciónSelected] = useState({
    name: "Federal",
    folder: "federal",
  });
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(true);
  const [IsDrawerOpenMain, SetIsDrawerOpenMain] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response2 = await ChatAPI.getChats(idUser);

        if (!response2.error) {
          setSavedChats(response2.data);
        }
      } catch (e) {
        console.log({ e });
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log({ jurisdiccion });
        if (jurisdiccion !== null) {
          const response = await DocumentApi.getDocuments(jurisdiccion);
          setdocumentsList(response.data);
        } else {
          setdocumentsList([]);
        }
      } catch (e) {
        console.log({ e });
      }
    }

    fetchData();
  }, [jurisdiccion]);

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

  useEffect(() => {
    async function fetchData() {
      try {
        const searchParams = new URLSearchParams(location.search);
        const chatIdFromUrl = searchParams.get("chatId");
        if (chatIdFromUrl) {
          const response = await ChatAPI.getMessages(idUser, chatIdFromUrl);
          const folder = response.data.preferencia.document;

          setsearchType(response.data.preferencia.searchType);
          setJurisdicciónSelected(
            response.data.preferencia.jurisdiccionSelected
          );
          setSelectedValue(response.data.preferencia.document);
          const response2 = await DocumentApi.getDocuments(
            response.data.preferencia.jurisdiccionSelected.folder
          );
          const nameFile =
            response2.data.find((doc) => doc.folder === folder)?.file || null;
          setname_file(nameFile);
          setdocumentsList(response2.data);

          if (response.data) {
            setSelectedChatId(chatIdFromUrl);
            setMessages(response.data.contenido);
            setShouldScrollToEnd(true);
          } else {
          }
        } else {
        }
      } catch (e) {
        console.log({ e });
        //navigate("/");
      }
    }
    fetchData();
  }, []);
  //  }, [documentsList]);

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
      setShouldScrollToEnd(true);
    };

    const handleResponseEnd = () => {
      if (searchType === "documentos") {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.sender === "bot") {
            return [
              ...prev.slice(0, -1),
              {
                text: lastMessage.text + `\n\n**Fuentes:** ${name_file}`,
                sender: "bot",
              },
            ];
          }
          return prev;
        });
      }
      setIsBotResponding(false);
    };

    socket.on("response", handleResponse);
    socket.on("response_end", handleResponseEnd);

    return () => {
      socket.off("response", handleResponse);
      socket.off("response_end", handleResponseEnd);
    };
  }, [name_file, searchType]);

  const handleSendMessage = async () => {
    if (searchType === "jurisprudencias" && context === null) {
      alert(
        "Por favor, proporciona un contexto antes de buscar jurisprudencias."
      );
      return;
    }

    if (isBotResponding) {
      return;
    }

    if (currentMessage.trim()) {
      if (messages.length === 0 && selectedChatId === null) {
        const result = await ChatAPI.createChat(
          idUser,
          currentMessage.substring(0, 45)
        );

        setMessages((prev) => [
          ...prev,
          { text: currentMessage, sender: "user" },
        ]);
        setShouldScrollToEnd(true);
        setCurrentMessage("");

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

        const response2 = await ChatAPI.getChats(idUser);
        setSavedChats(response2.data);
        setSelectedChatId(result.data.chat_id);
        await ChatAPI.putPreferences(
          result.data.chat_id,
          searchType,
          selectedValue,
          jurisdiccionSelected
        );
        const searchParams = new URLSearchParams();
        searchParams.set("chatId", result.data.chat_id);
        navigate({ search: searchParams.toString() });
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
    setShouldScrollToEnd(!open);
  };

  const toggleDrawerMain = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    SetIsDrawerOpenMain(open);
  };

  const handleChatSelection = async (chatId, e) => {
    toggleDrawer(false)(e);
    const response = await ChatAPI.getMessages(idUser, chatId);
    const folder = response.data.preferencia.document;
    setSelectedChatId(chatId);
    setMessages(response.data.contenido);
    setsearchType(response.data.preferencia.searchType);
    setSelectedValue(response.data.preferencia.document);
    setJurisdicciónSelected(response.data.preferencia.jurisdiccionSelected);
    const response2 = await DocumentApi.getDocuments(
      response.data.preferencia.jurisdiccionSelected.folder
    );
    setdocumentsList(response2.data);
    const nameFile =
      response2.data.find((doc) => doc.folder === folder)?.file || null;
    setname_file(nameFile);
    setShouldScrollToEnd(true);
    const searchParams = new URLSearchParams();
    searchParams.set("chatId", chatId);
    navigate({ search: searchParams.toString() });
  };

  const handleConfirm = async (type, option) => {
    if (type === "jurisprudencias") {
      setsearchType(type);
      if (selectedChatId !== null) {
        await ChatAPI.putPreferences(
          selectedChatId,
          type,
          null,
          jurisdiccionSelected
        );
      }

      return;
    }

    if (type === "documentos") {
      setsearchType(type);
      setSelectedValue(option);
      setname_file(documentsList.find((doc) => doc.folder === option)["file"]);
      if (selectedChatId !== null) {
        await ChatAPI.putPreferences(
          selectedChatId,
          type,
          option,
          jurisdiccionSelected
        );
      }
      return;
    }

    if (type === "general") {
      setsearchType(null);
      setSelectedValue("");
      if (selectedChatId !== null) {
        await ChatAPI.putPreferences(
          selectedChatId,
          null,
          "",
          jurisdiccionSelected
        );
      }
    }
  };

  const handleOpenContextModal = () => {
    setIsContextModalOpen(true);
  };

  return (
    <div>
      <Box
        sx={{
          position: "relative",
          height: "100dvh",
          width: "100%",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        <Header
          toggleDrawer={toggleDrawer}
          searchType={searchType}
          name_file={name_file}
          setModalOpen={setModalOpen}
          handleOpenContextModal={handleOpenContextModal}
          toggleDrawerMain={toggleDrawerMain}
        />

        <Box
          sx={{
            position: "absolute",
            top: "4rem",
            bottom: "74px",
            left: 0,
            right: 0,
            overflowY: "auto",
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
                    ¡Hola! Soy Halach IA
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mt: 1, textAlign: "center" }}>
                  ¿En qué te puedo ayudar hoy?
                </Typography>
              </Box>
            </Box>
          ) : (
            <MessageContainer
              messages={messages}
              shouldScrollToEnd={shouldScrollToEnd}
            />
          )}
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
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
            isBotResponding={isBotResponding}
            sx={{ overflow: "hidden" }}
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
        setSelectedValue={setSelectedValue}
        setsearchType={setsearchType}
      />
      <SideBarMain
        toggleDrawer={toggleDrawerMain}
        isDrawerOpen={IsDrawerOpenMain}
      />
      <ModalContext
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setIsContextModalOpen={setIsContextModalOpen}
        isContextModalOpen={isContextModalOpen}
        messages={messages}
        setMessages={setMessages}
        setSavedChats={setSavedChats}
        context={context}
        setContext={setContext}
        searchType={searchType}
        selectedValue={selectedValue}
      />
      <ModalSearch
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        documentsList={documentsList}
        selectedType={searchType}
        setSelectedType={setsearchType}
        selectedValue={selectedValue}
        setJurisdiccion={setJurisdiccion}
        jurisdiccionSelected={jurisdiccionSelected}
        setJurisdicciónSelected={setJurisdicciónSelected}
      />
    </div>
  );
};

export default Chat;
