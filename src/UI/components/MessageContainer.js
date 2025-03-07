import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Box, List, ListItem, IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material"; // Ícono de copiar
import remarkGfm from "remark-gfm";

export default function MessageContainer({ messages }) {
  const messagesEndRef = useRef(null);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null); // Estado para controlar el hover

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text).then(() => {});
  };

  return (
    <Box sx={{}}>
      <List>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              flexDirection: "column",
              alignItems: message.sender === "user" ? "flex-end" : "flex-start",
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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text}
              </ReactMarkdown>
            </Box>

            {hoveredMessageIndex === index && (
              <IconButton onClick={() => handleCopyMessage(message.text)}>
                <ContentCopy />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
      <div ref={messagesEndRef} />
    </Box>
  );
}
