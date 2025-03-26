import React, { useState, useEffect } from "react";
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
import GavelIcon from "@mui/icons-material/Gavel";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ChatIcon from "@mui/icons-material/Chat";
import ModalSettings from "../Modals/ModalSettings";
import UsersAPI from "../../../Services/Controllers/Users";
import chatbotImage from "../../../assets/chatbot.png";

export default function SideBar({ isDrawerOpen, toggleDrawer }) {
  const idUser = UsersAPI.getID();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [dataUser, setdataUser] = useState({
    nombre: "",
    email: "",
  });
  const handleOpenModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response3 = await UsersAPI.getInfo(idUser);

        setdataUser(response3.data);
      } catch (e) {
        console.log({ e });
      }
    }

    fetchData();
  }, []);

  return (
    <Box>
      <ModalSettings
        isOpen={isProfileModalOpen}
        onClose={handleCloseModal}
        dataUser={dataUser}
      />

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
            minWidth: "20%",
          },
        }}
      >
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
            navigate("/");
          }}
        >
          <img
            src={chatbotImage}
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
              onClick={handleOpenModal}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
