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

import { ThemeContext } from "../Utils/ThemeContext";
import UsersAPI from "../../../Services/Controllers/Users";
import { ToastContainer, Zoom } from "react-toastify";

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
  maxHeight: "80vh",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  overflowY: "auto",
  p: 4,
};

const SettingsModal = ({ isOpen, onClose, dataUser }) => {
  const [tabValue, setTabValue] = useState(0);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    const logut = UsersAPI.logut();
  };

  const isLicenciaExpirada = (fechaFin) => {
    const fechaActual = new Date();
    const fechaFinLicencia = new Date(fechaFin);
    return fechaActual > fechaFinLicencia;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{ overflow: "hidden" }}
      disableScrollLock={false}
    >
      <Box sx={style}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Perfil" {...a11yProps(0)} />
          <Tab label="Configuración" {...a11yProps(1)} />
          <Tab label="Licencia" {...a11yProps(2)} />{" "}
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

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Licencia
          </Typography>
          <TextField
            fullWidth
            label="Nombre de la Licencia"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            defaultValue={dataUser.licencia_nombre || "No tiene licencia"}
          />
          <TextField
            fullWidth
            label="Estado de la Licencia"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            defaultValue={
              dataUser.licencia_fecha_fin
                ? isLicenciaExpirada(dataUser.licencia_fecha_fin)
                  ? "Expirada"
                  : "Activa"
                : "No tiene licencia"
            }
          />
          <TextField
            fullWidth
            label="Fecha de Expiración"
            variant="outlined"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
            defaultValue={
              dataUser.licencia_fecha_fin
                ? new Date(dataUser.licencia_fecha_fin).toLocaleDateString()
                : "No tiene licencia"
            }
          />

          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            transition={Zoom}
            closeButton={false}
          />
        </TabPanel>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
