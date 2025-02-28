import React, { useState, useEffect } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import io from "socket.io-client";
import MessageContainer from "../components/MessageContainer";
import Message from "../components/Message";
import DocumentApi from "../../Services/Controllers/Documents";
const socket = io("http://34.60.14.225:5002");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [documentsList, setdocumentsList] = useState([]);
  useEffect(() => {
    const handleResponse = (data) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.sender === "bot") {
          return [
            ...prev.slice(0, -1),
            { text: lastMessage.text + data, sender: "bot" },
          ];
        }
        return [...prev, { text: data, sender: "bot" }];
      });
    };

    socket.on("response", handleResponse);
    socket.on("response_end", () => {});

    return () => {
      socket.off("response", handleResponse);
      socket.off("response_end");
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await DocumentApi.getDocuments();
      console.log(response.data);
      setdocumentsList(response.data);
      setSelectedValue(response.data[0].folder);
    }

    fetchData();
  }, []);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      socket.emit(
        "message",
        JSON.stringify({ text: currentMessage, folder: selectedValue })
      );
      setMessages((prev) => [
        ...prev,
        { text: currentMessage, sender: "user" },
      ]);
      setCurrentMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        maxWidth: "75%",
        margin: "0 auto",
        padding: "16px",
        backgroundColor: "#292a2d",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h5" align="center" color="white" gutterBottom>
          Chat con LegisBot
        </Typography>
        <FormControl variant="outlined" style={{ marginLeft: "16px" }}>
          <Select
            labelId="select-label"
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
            label="Selecciona una opción"
            sx={{
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
            }}
          >
            <MenuItem value="" disabled>
              Selecciona el Documento
            </MenuItem>

            {documentsList.map((item, index) => (
              <MenuItem key={index} value={item.folder}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <MessageContainer messages={messages} />
      <Message
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleSendMessage={handleSendMessage}
      />
    </Box>
  );
};

export default Chat;
