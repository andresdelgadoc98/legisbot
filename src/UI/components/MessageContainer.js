import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Paper, List, ListItem } from "@mui/material";

export default function MessageContainer({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Paper
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#292a2d",
        color: "white",
        maxHeight: "70vh",
      }}
    >
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  message.sender === "user" ? "#414158" : "#292a2d",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "70%",
                color: "white",
              }}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </Box>
          </ListItem>
        ))}
      </List>
      <div ref={messagesEndRef} />
    </Paper>
  );
}
