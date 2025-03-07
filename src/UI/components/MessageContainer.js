import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  List,
  ListItem,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import remarkGfm from "remark-gfm";

export default function MessageContainer({ messages }) {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);

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
                backgroundColor:
                  message.sender === "user" ? theme.palette.chatUser : "",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "16px",
                maxWidth: "70%",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <Typography
                      component="a"
                      {...props}
                      sx={{
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    />
                  ),
                }}
              >
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
