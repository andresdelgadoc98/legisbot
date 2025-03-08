import React, { useState, useEffect } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import ChatAPI from "../../../Services/Controllers/Chats";
import UsersAPI from "../../../Services/Controllers/Users";
import { useNavigate } from "react-router-dom";
const idUser = UsersAPI.getID();

export default function ModalContext({
  selectedChatId,
  setIsContextModalOpen,
  isContextModalOpen,
  messages,
  setSavedChats,
  setSelectedChatId,
  setMessages,
  context: parentContext,
  setContext: setParentContext,
  searchType,
  selectedValue,
}) {
  const [localContext, setLocalContext] = useState(parentContext);
  const navigate = useNavigate();
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
        setIsContextModalOpen(false);
        setSelectedChatId(result.data.chat_id);
        setMessages((prev) => [
          ...prev,
          { text: "Contexto Guardado Correctamente", sender: "bot" },
        ]);
        const searchParams = new URLSearchParams();
        searchParams.set("chatId", result.data.chat_id);
        navigate({ search: searchParams.toString() });

        await ChatAPI.putPreferences(
          result.data.chat_id,
          searchType,
          selectedValue
        );
      } else {
        if (selectedChatId !== null) {
          ChatAPI.updateContexto(selectedChatId, localContext);

          setIsContextModalOpen(false);
        }
      }

      setParentContext(localContext);
    }
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
