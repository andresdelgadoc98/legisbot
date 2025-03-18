import React, { useState, useRef } from "react";
import {
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chats from "../../Services/Controllers/Chats";

const ChatList = ({
  savedChats,
  handleChatSelection,
  handleDelete,
  handleEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const inputRef = useRef(null);

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

  const handleEditClick = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
    setTimeout(() => inputRef.current?.focus(), 0);
    handleMenuClose();
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = async (chatId) => {
    if (
      editedTitle.trim() &&
      editedTitle !== savedChats.find((chat) => chat.id === chatId).titulo
    ) {
      try {
        const response = await Chats.updateTitleChat(chatId, editedTitle);

        if (response.data) {
          handleEdit(chatId, editedTitle);
        }
      } catch (error) {
        console.error("Error al guardar el título:", error);
      }
    }
    setEditingChatId(null);
    setEditedTitle("");
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {savedChats.map((chat) => (
        <ListItemButton
          key={chat.id}
          onClick={() => handleChatSelection(chat.id)}
        >
          {editingChatId === chat.id ? (
            <TextField
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={() => handleBlur(chat.id)}
              onKeyPress={(e) => handleKeyPress(e, chat.id)}
              inputRef={inputRef}
              size="small"
              fullWidth
              sx={{ maxWidth: "200px" }}
              inputProps={{ maxLength: 45 }}
            />
          ) : (
            <ListItemText
              primary={truncateText(chat.titulo, 32)}
              primaryTypographyProps={{ fontSize: ".9rem" }}
            />
          )}
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="more"
              onClick={(e) => handleMenuOpen(e, chat.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={(e) => {
            handleDelete(selectedChatId, e); // Pasamos el evento
            handleMenuClose();
          }}
        >
          Borrar
        </MenuItem>
        <MenuItem
          onClick={() => {
            const chat = savedChats.find((c) => c.id === selectedChatId);
            handleEditClick(selectedChatId, chat.titulo);
          }}
        >
          Editar
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatList;
