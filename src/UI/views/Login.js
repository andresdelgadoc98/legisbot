import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
} from "@mui/material";
import Users from "../../Services/Controllers/Users";
import Cookies from "js-cookie";
import myImage from "./chatbot.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import tokenAPI from "../../Services/Controllers/token";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.includes("@")) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (email.includes("@") && password.length >= 6) {
      try {
        console.log("Iniciando sesión con:", { email, password });
        const res = await Users.login(email, password);
        if (res.data && res.data.access_token && res.data.refresh_token) {
          localStorage.setItem("accessToken", res.data.access_token);
          Cookies.set("refresh_token", res.data.refresh_token, {
            httponly: false,
            secure: false,
            samesite: "none",
            expires: 1,
          });

          console.log("Login exitoso. Tokens guardados.");
          window.location.href = "/";
        } else {
          console.error("Error: No se recibieron tokens del servidor");
        }
      } catch (error) {
        console.error("Error durante el login:", error);
      }
    }
  };

  const checkToken = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          try {
            //const resToken = await tokenAPI.very_access_token(accessToken);
            navigate("/");
          } catch (e) {
            console.log(e);
          }
        }
      } catch (error) {
        console.log(error);
        Users.logut();
      }
    } else {
      console.log("no se eonctró token en storage");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          padding: "32px",
          marginTop: "64px",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={myImage}
            alt="Descripción de la imagen"
            sx={{
              width: "50%",
              height: "auto",
              borderRadius: 2,
            }}
          />
        </Box>
        <Typography variant="h4" align="center" gutterBottom>
          Halach IA ⚖️
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={
              emailError ? "Ingresa un correo electrónico válido" : ""
            }
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={
              passwordError
                ? "La contraseña debe tener al menos 6 caracteres"
                : ""
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
