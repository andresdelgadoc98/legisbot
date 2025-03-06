import React from "react";
import { TextField, Box, Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DescriptionIcon from "@mui/icons-material/Description";
import GavelIcon from "@mui/icons-material/Gavel";
import config from "../../config/config";

const SearchTypeButton = ({ searchType, name_file }) => {
  const url =
    searchType === "documentos"
      ? config.BACKEND_URL + "/documents/documentos/" + name_file
      : searchType === "jurisprudencias"
      ? "https://sjf2.scjn.gob.mx/busqueda-principal-tesis"
      : "#";

  const icon =
    searchType === "documentos" ? (
      <DescriptionIcon />
    ) : searchType === "jurisprudencias" ? (
      <GavelIcon />
    ) : null;

  return (
    <div>
      {searchType === null ? (
        <div></div>
      ) : (
        <Button
          variant="contained"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ height: "56px" }}
        >
          {icon}
        </Button>
      )}
    </div>
  );
};

export default function Message({
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  searchType,
  name_file,
}) {
  const placeholder =
    searchType === "documentos"
      ? "Escribe un mensaje..."
      : searchType === "jurisprudencias"
      ? "Escribe palabras clave"
      : "Escribe un mensaje...";

  return (
    <Box sx={{ display: "flex", gap: "8px" }} variant="outlined">
      <SearchTypeButton searchType={searchType} name_file={name_file} />
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
