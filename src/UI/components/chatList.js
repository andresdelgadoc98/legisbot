import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ChatList = ({
  savedChats,
  handleChatSelection,
  handleRename,
  handleDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleMenuOpen = (event, chatId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatId(null);
  };

  const truncateText = (text, limit) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  return (
    <>
      {savedChats.map((chat) => (
        <ListItem
          button
          key={chat.id}
          onClick={() => handleChatSelection(chat.id)}
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemText primary={truncateText(chat.titulo, 20)} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="more"
              onClick={(e) => handleMenuOpen(e, chat.id)}
              sx={{ color: "white" }} // Color de los tres puntos
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleRename(selectedChatId);
            handleMenuClose();
          }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(selectedChatId);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatList;
