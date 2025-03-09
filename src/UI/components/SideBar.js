import React from "react";
import { Box, Typography, Drawer, List, Button } from "@mui/material";
import ChatsAPI from "../../Services/Controllers/Chats";
import ChatList from "./chatList";
import MessageIcon from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";
export default function SideBar({
  isDrawerOpen,
  toggleDrawer,
  handleChatSelection,
  savedChats,
  setSavedChats,
  setMessages,
  setSelectedChatId,
  setSelectedValue,
  setsearchType,
}) {
  const handleRename = (chatId) => {
    const newTitle = prompt("Enter new title:");
    if (newTitle) {
      setSavedChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, titulo: newTitle } : chat
        )
      );
    }
  };
  const navigate = useNavigate();

  const handleDelete = (chatId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (confirmDelete) {
      setSavedChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatId)
      );

      ChatsAPI.deleteChat(chatId);
      setMessages([]);
      navigate("/");
    }
  };

  const handleNewChat = () => {
    console.log("Creando nuevo chat...");
    navigate("/");
    setSelectedChatId(null);
    setMessages([]);
    setSelectedValue("");
    setsearchType(null);
    toggleDrawer(false);
  };

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 250,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Box
          sx={{
            padding: "16px",
            position: "sticky",
            top: 0,
            zIndex: 1, // Asegura que el botón esté por encima del contenido
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={handleNewChat}
            startIcon={<MessageIcon />}
            sx={{ marginTop: 1 }}
          >
            Nuevo Chat
          </Button>
        </Box>

        {/* Contenido desplazable */}
        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
          <Typography variant="h6" sx={{ padding: "16px" }}>
            Chats Guardados
          </Typography>
          <List>
            <ChatList
              savedChats={savedChats}
              handleChatSelection={handleChatSelection}
              handleRename={handleRename}
              handleDelete={handleDelete}
            />
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
