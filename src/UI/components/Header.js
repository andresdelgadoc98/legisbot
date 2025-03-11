import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BalanceIcon from "@mui/icons-material/Balance";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  FormControl,
  IconButton,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import SearchTypeButton from "./SearchTypeButton";

export default function Header({
  toggleDrawer,
  searchType,
  name_file,
  setModalOpen,
  handleOpenContextModal,
  handleOpenModal,
  savedChats,
  selectedChatId,
}) {
  const [isEditing, setIsEditing] = useState(false); // Estado para modo de edición
  const [tempTitle, setTempTitle] = useState(""); // Estado para el título temporal

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "64px",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            flex: 1, // Ocupa el espacio restante
            display: "flex",
            justifyContent: "center", // Centra el contenido horizontalmente
            marginLeft: 25, // Añade un margen a la izquierda
          }}
        >
          {isEditing ? (
            <TextField
              value={tempTitle}
              autoFocus
              fullWidth
              sx={{
                textAlign: "center",
                display: { xs: "none", md: "block" },
              }}
            />
          ) : (
            <Typography
              variant="h7"
              sx={{
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 700,
                display: { xs: "none", md: "block" },
              }}
            >
              {selectedChatId
                ? savedChats.find((chat) => chat.id === selectedChatId)
                    ?.titulo || "¡Bienvenido!"
                : "¡Bienvenido!"}
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center">
          <FormControl variant="outlined" sx={{ ml: 2 }}>
            <SearchTypeButton searchType={searchType} name_file={name_file} />
          </FormControl>
          <FormControl variant="outlined" sx={{ ml: 2 }}>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              <SearchIcon />
            </Button>
          </FormControl>
          <FormControl variant="outlined" sx={{ ml: 2 }}>
            <Button variant="contained" onClick={handleOpenContextModal}>
              <BalanceIcon />
            </Button>
          </FormControl>
          <FormControl variant="outlined" sx={{ ml: 2 }}>
            <Button variant="contained" onClick={handleOpenModal}>
              <AccountCircleIcon />
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
