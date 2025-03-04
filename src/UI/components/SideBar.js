import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ChatsAPI from "../../Services/Controllers/Chats";

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
          {savedChats.map((chat) => (
            <ListItem
              button
              key={chat.id}
              onClick={() => handleChatSelection(chat.id)}
            >
              <ListItemText primary={chat.titulo} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
