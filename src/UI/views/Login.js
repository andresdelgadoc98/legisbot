import React, { useState } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: 7,
          });
          const refreshToken = Cookies.get("refresh_token");
          console.log({ refreshToken });

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
