import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import ChatAPI from "../../Services/Controllers/Chats";
import UsersAPI from "../../Services/Controllers/Users";

const idUser = UsersAPI.getID();

export default function ModalContext({
  searchType,
  selectedChatId,
  setIsContextModalOpen,
  isContextModalOpen,
  messages,
  setSavedChats,
  socket,
  selectedValue,
  setSelectedChatId,
  setMessages,
  setCurrentMessage,
  context: parentContext,
  setContext: setParentContext,
  setIsBotResponding,
}) {
  const [localContext, setLocalContext] = useState(parentContext);

  useEffect(() => {
    setLocalContext(parentContext);
  }, [parentContext]);

  const handleSendContext = async () => {
    if (localContext.trim()) {
      if (messages.length === 0) {
        const result = await ChatAPI.createChat(
          idUser,
          localContext.substring(0, 45)
        );
        const response2 = await ChatAPI.getChats(idUser);
        setSavedChats(response2.data);

        await ChatAPI.updateContexto(result.data.chat_id, localContext);
        setIsBotResponding(true);
        socket.emit(
          "message",
          JSON.stringify({
            text: localContext,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: idUser,
            searchType: searchType,
          })
        );

        setIsContextModalOpen(false);
        setSelectedChatId(result.data.chat_id);
        setMessages((prev) => [
          ...prev,
          { text: localContext, sender: "user" },
        ]);
        setCurrentMessage("");
      } else {
        ChatAPI.updateContexto(selectedChatId, localContext);
        setIsContextModalOpen(false);
      }

      setParentContext(localContext);
    }
  };
  const close = () => {
    setIsContextModalOpen(false);
  };

  return (
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
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Guarda el Contexto
        </Typography>
        <TextField
          multiline
          rows={4}
          placeholder="Proporciona un contexto o caso específico..."
          value={localContext}
          onChange={(e) => setLocalContext(e.target.value)}
          sx={{ width: "100%", marginBottom: "8px" }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" onClick={handleSendContext}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
