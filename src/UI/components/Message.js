import React from "react";
import { TextField, Box, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function Message({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  searchType,
  isBotResponding,
}) {
  const placeholder =
    searchType === "documentos"
      ? "Escribe un mensaje..."
      : searchType === "jurisprudencias"
      ? "Escribe palabras clave"
      : "Escribe un mensaje...";

  return (
    <Box sx={{ display: "flex" }}>
      <TextField
        id="outlined-basic"
        fullWidth
        variant="filled"
        placeholder={placeholder}
        value={currentMessage}
        focused={false}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        sx={{
          flex: 1,
          height: "100%",
          "& .MuiInputBase-root": {
            height: "100%",
            paddingTop: 0.5,
            paddingBottom: 0.5,
          },
          "& .MuiInputBase-input": {
            padding: "12px 14px", // Ajusta el padding interno del input
          },
        }}
      />

      <Button variant="contained" onClick={handleSendMessage}>
        {isBotResponding ? "..." : <ArrowUpwardIcon />}
      </Button>
    </Box>
  );
}
