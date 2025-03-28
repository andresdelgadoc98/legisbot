import React from "react";
import { Box, Typography, Drawer, List, Button } from "@mui/material";
import ChatsAPI from "../../../Services/Controllers/Chats";
import ChatList from "../chatList";
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

  const handleDelete = (chatId, event) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (confirmDelete) {
      toggleDrawer(false)(event);
      setSavedChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatId)
      );

      ChatsAPI.deleteChat(chatId);
      setMessages([]);
      navigate("/");
    }
  };

  const handleEdit = (chatId, newTitle, event) => {
    if (newTitle) {
      setSavedChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, titulo: newTitle } : chat
        )
      );
    }
  };
  const handleNewChat = (e) => {
    e.stopPropagation();
    console.log("Creando nuevo chat...");
    setSelectedChatId(null);
    setMessages([]);
    setSelectedValue("");
    setsearchType(null);
    toggleDrawer(false)(e);
    navigate("/");
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: {
            xs: "70%",
            md: "20%",
          },
          maxWidth: "100%",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Box
          sx={{
            padding: "16px",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={handleNewChat}
            startIcon={<MessageIcon />}
          >
            Nuevo Chat
          </Button>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Chats Guardados
          </Typography>
          <List>
            <ChatList
              savedChats={savedChats}
              handleChatSelection={handleChatSelection}
              handleRename={handleRename}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
