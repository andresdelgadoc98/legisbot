import React, { useState, useContext } from "react";
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Cookies from "js-cookie";
import { ThemeContext } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const SettingsModal = ({ isOpen, onClose, dataUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    Cookies.remove("refresh_token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Perfil" {...a11yProps(0)} />
          <Tab label="Configuración" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Perfil
          </Typography>
          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            defaultValue={dataUser.nombre}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            defaultValue={dataUser.email}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              color="error"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Configuración
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="theme-select-label">Tema</InputLabel>
            <Select
              labelId="theme-select-label"
              id="theme-select"
              value={theme}
              label="Tema"
              onChange={(e) => toggleTheme(e.target.value)}
            >
              <MenuItem value="light">Claro</MenuItem>
              <MenuItem value="dark">Oscuro</MenuItem>
              <MenuItem value="pink">Rosa</MenuItem>
            </Select>
          </FormControl>
        </TabPanel>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
