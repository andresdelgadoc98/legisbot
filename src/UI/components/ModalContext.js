import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import ChatAPI from "../../Services/Controllers/Chats";
import UsersAPI from "../../Services/Controllers/Users";
const idUser = UsersAPI.getID();

export default function ModalContext({
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
}) {
  const [context, setContext] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await ChatAPI.getContext(selectedChatId);
        setContext(response.data.contexto);
      } catch (error) {
        console.error("Error al cargar el contexto:", error);
      }
    }

    fetchData();
  }, [isContextModalOpen]);

  const handleSendContext = async () => {
    if (context.trim()) {
      if (messages.length === 0) {
        const result = await ChatAPI.createChat(
          idUser,
          context.substring(0, 45)
        );
        const response2 = await ChatAPI.getChats(idUser);
        setSavedChats(response2.data);

        await ChatAPI.updateContexto(result.data.chat_id, context);

        socket.emit(
          "message",
          JSON.stringify({
            text: context,
            folder: selectedValue,
            chat_id: result.data.chat_id,
            usuario_id: idUser,
          })
        );

        setIsContextModalOpen(false);
        setContext("");
        setSelectedChatId(result.data.chat_id);
        setMessages((prev) => [...prev, { text: context, sender: "user" }]);
        setCurrentMessage("");
      } else {
        ChatAPI.updateContexto(selectedChatId, context);
        setIsContextModalOpen(false);
        setContext("");
      }
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
        <TextField
          multiline
          rows={4}
          placeholder="Proporciona un contexto o caso específico..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          sx={{ width: "100%", marginBottom: "8px" }}
        />
        <Button
          variant="contained"
          onClick={handleSendContext}
          sx={{ width: "100%" }}
        >
          Guardar contexto
        </Button>
      </Box>
    </Modal>
  );
}
