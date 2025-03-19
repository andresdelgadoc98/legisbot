import React from "react";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GavelIcon from "@mui/icons-material/Gavel"; // Icon for Jurisprudencias
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"; // Icon for Biblioteca
import ChatIcon from "@mui/icons-material/Chat";
export default function SideBar({ isDrawerOpen, toggleDrawer }) {
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: {
            xs: "70%",
            md: "20%",
          },
          maxWidth: "100%",
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          mt: 2,
          mb: 3,
          gap: 1,
          padding: "0 16px",
          "&:hover": {
            opacity: 0.8,
          },
        }}
        onClick={() => {
          navigate("/jurisprudencias");
        }}
      >
        <img
          src="../chatbot.png"
          alt="Halach IA Logo"
          style={{
            width: 35,
            height: "auto",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Halach IA
        </Typography>
      </Box>

      {/* List of Options */}
      <List sx={{ padding: "0 8px" }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/jurisprudencias")}
            sx={{
              borderRadius: "8px",
              "&:hover": {},
            }}
          >
            <ListItemIcon>
              <GavelIcon />
            </ListItemIcon>
            <ListItemText primary="Jurisprudencias" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/library")}
            sx={{
              borderRadius: "8px",
              "&:hover": {},
            }}
          >
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Biblioteca de Documentos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/")}
            sx={{
              borderRadius: "8px",
              "&:hover": {},
            }}
          >
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: "8px",
              "&:hover": {},
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
