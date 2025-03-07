import React from "react";
import { TextField, Box, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function Message({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  searchType,
}) {
  const placeholder =
    searchType === "documentos"
      ? "Escribe un mensaje..."
      : searchType === "jurisprudencias"
      ? "Escribe palabras clave"
      : "Escribe un mensaje...";

  return (
    <Box sx={{ display: "flex" }} variant="outlined">
      <TextField
        id="outlined-basic"
        fullWidth
        variant="filled"
        placeholder={placeholder}
        value={currentMessage}
        focused={false}
        onChange={(e) => setCurrentMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />

      <Button variant="contained" onClick={handleSendMessage}>
        <ArrowUpwardIcon />
      </Button>
    </Box>
  );
}
