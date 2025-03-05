import React from "react";
import { IconButton, TextField, Box, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

export default function Message({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
}) {
  return (
    <Box sx={{ display: "flex", gap: "8px" }} variant="outlined">
      <TextField
        id="outlined-basic"
        fullWidth
        variant="filled"
        placeholder="Escribe un mensaje..."
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
