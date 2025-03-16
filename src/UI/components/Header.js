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
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  return (
    <Box
      sx={{
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
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        ></Box>
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
