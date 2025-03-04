import React, { useEffect, useState } from "react";
import { Box, Typography, Drawer, List } from "@mui/material";
import ChatsAPI from "../../Services/Controllers/Chats";
import ChatList from "./chatList";

export default function SideBar({
  isDrawerOpen,
  toggleDrawer,
  handleChatSelection,
}) {
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await ChatsAPI.getChats(1);
      console.log(response);
      setSavedChats(response.data);
    }

    fetchData();
  }, []);

  // Función para manejar el renombrado de un chat
  const handleRename = (chatId) => {
    const newTitle = prompt("Enter new title:"); // Puedes usar un modal más bonito aquí
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

      const response = ChatsAPI.deleteChat(chatId);
    }
  };

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
      <Box
        sx={{
          width: 250,
          backgroundColor: "#1e1e1e",
          height: "100%",
          color: "white",
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
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
