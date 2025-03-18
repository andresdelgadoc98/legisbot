import React, { useState, useRef } from "react";
import {
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  ListItemSecondaryAction,
  TextField,
  ListItem,
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

  const handleEditClick = (chatId, currentTitle, event) => {
    event.stopPropagation();
    setEditingChatId(chatId);
    setEditedTitle(currentTitle);
    setTimeout(() => inputRef.current?.focus(), 0);
    handleMenuClose();
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = async (chatId, e) => {
    if (
      editedTitle.trim() &&
      editedTitle !== savedChats.find((chat) => chat.id === chatId).titulo
    ) {
      try {
        const response = await Chats.updateTitleChat(chatId, editedTitle);

        if (response.data) {
          handleEdit(chatId, editedTitle, e);
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
        <ListItem key={chat.id} disablePadding>
          {/* El ListItemButton solo envuelve el ListItemText para selección */}
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
              onClick={(e) => e.stopPropagation()} // Detiene clic en TextField
            />
          ) : (
            <ListItemButton onClick={(e) => handleChatSelection(chat.id, e)}>
              <ListItemText
                primary={truncateText(chat.titulo, 45)}
                primaryTypographyProps={{ fontSize: ".9rem" }}
              />
            </ListItemButton>
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
        </ListItem>
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
          onClick={(e) => {
            const chat = savedChats.find((c) => c.id === selectedChatId);
            handleEditClick(selectedChatId, chat.titulo, e);
          }}
        >
          Editar
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChatList;
