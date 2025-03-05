import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Box, List, ListItem } from "@mui/material";

export default function MessageContainer({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "16px",
        marginBottom: "16px",
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
                backgroundColor: message.sender === "user" ? "#424242" : "",
                padding: "10px",
                borderRadius: "8px",
                maxWidth: "70%",
              }}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </Box>
          </ListItem>
        ))}
      </List>
      <div ref={messagesEndRef} />
    </Box>
  );
}
