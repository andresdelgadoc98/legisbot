import React from "react";
import { Box, Typography, Drawer, List, Button } from "@mui/material";
import ChatsAPI from "../../Services/Controllers/Chats";
import ChatList from "./chatList";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MessageIcon from "@mui/icons-material/Message";
export default function SideBar({
  isDrawerOpen,
  toggleDrawer,
  handleChatSelection,
  savedChats,
  setSavedChats,
  setMessages,
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
    }
  };

  const handleNewChat = () => {
    console.log("Creando nuevo chat...");

    setMessages([]);

    toggleDrawer(false);
  };

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 250,
          height: "100%",
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Box sx={{ padding: "16px" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AccountCircleIcon />}
          >
            Perfil
          </Button>
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
    </Drawer>
  );
}
