import React, { useEffect, useState } from "react";
import ChatBot from "./UI/views/chatbot";
import Login from "./UI/views/Login";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { jwtDecode } from "jwt-decode";
import Users from "./Services/Controllers/Users";
import Cookies from "js-cookie";

const renewAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    console.log("Refresh token:", refreshToken);

    if (!refreshToken) {
      throw new Error("No hay refresh token");
    }

    const res = await Users.getrefreshToken(refreshToken);
    console.log("Respuesta del servidor:", res); // Depuración

    if (res.data && res.data.access_token) {
      return res.data.access_token;
    } else {
      throw new Error("No se pudo renovar el token");
    }
  } catch (error) {
    console.error("Error renovando el token:", error);
    throw error;
  }
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsValidToken(true);
          } else {
            const newAccessToken = await renewAccessToken();
            localStorage.setItem("accessToken", newAccessToken);
            setIsValidToken(true);
          }
        } catch (error) {
          localStorage.removeItem("accessToken");
          Cookies.remove("refresh_token");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  if (isValidToken) {
    return children;
  }

  return null;
};

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme} defaultMode="dark">
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
