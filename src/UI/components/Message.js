import React from "react";
import { Box, TextField, Button } from "@mui/material";

export default function Message({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
}) {
  return (
    <Box sx={{ display: "flex", gap: "8px", color: "white" }}>
      <TextField
        id="outlined-basic"
        fullWidth
        variant="filled"
        placeholder="Escribe un mensaje..."
        value={currentMessage}
        focused={false}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        sx={{
          backgroundColor: "#414158",
          borderRadius: "8px",
          "& .MuiFilledInput-root": {
            backgroundColor: "#414158",
            borderRadius: "8px",
            color: "white",
          },
          "& .MuiFilledInput-input": {
            color: "white",
          },
          "& .MuiInputLabel-root": {
            color: "white",
          },
          "& .MuiFilledInput-underline:before": {
            borderBottomColor: "rgba(255, 255, 255, 0.42)",
          },
          "& .MuiFilledInput-underline:after": {
            borderBottomColor: "white",
          },
          // Quitar el borde de enfoque
          "& .MuiFilledInput-root.Mui-focused": {
            outline: "none", // Eliminar el outline
            boxShadow: "none", // Eliminar la sombra (si la hay)
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSendMessage}
        sx={{
          borderRadius: "8px", // Bordes redondeados para el botón
          backgroundColor: "#6C63FF", // Color de fondo del botón
          "&:hover": {
            backgroundColor: "#574fdb", // Color de fondo al pasar el mouse
          },
        }}
      >
        Enviar
      </Button>
    </Box>
  );
}
