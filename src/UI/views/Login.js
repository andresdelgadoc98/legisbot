import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación básica
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

    // Si no hay errores, proceder con el inicio de sesión
    if (email.includes("@") && password.length >= 6) {
      console.log("Iniciando sesión con:", { email, password });
      // Aquí puedes agregar la lógica para enviar los datos al servidor
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
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Campo de correo electrónico */}
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

          <Typography variant="body2" align="center">
            ¿No tienes una cuenta?{" "}
            <Link href="#" underline="hover">
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
