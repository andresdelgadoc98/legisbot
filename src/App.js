import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { jwtDecode } from "jwt-decode";
import tokenAPI from "./Services/Controllers/token";
import {
  ThemeContext,
  ThemeProvider,
} from "../src/UI/components/Utils/ThemeContext";

import UsersAPI from "./Services/Controllers/Users";
import { Jurisprudencias, Login, ChatBot, Library } from "./UI/views";

const renewAccessToken = async () => {
  try {
    const res = await tokenAPI.getAccessToken();
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
            console.log({ newAccessToken });
            localStorage.setItem("accessToken", newAccessToken);
            setIsValidToken(true);
          }
        } catch (error) {
          console.log(error);
          UsersAPI.logut();
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
  const { theme } = useContext(ThemeContext);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      chatUser: "#424242",
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      chatUser: "#B5E5E9",
    },
  });

  const pinkTheme = createTheme({
    palette: {
      primary: {
        main: "#e91e63",
        light: "#f06292",
        dark: "#c2185b",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff4081",
        light: "#ff79b0",
        dark: "#c60055",
        contrastText: "#ffffff",
      },
      background: {
        default: "#white",
      },
      chatUser: "#f06292",
    },
  });
  const themes = {
    dark: darkTheme,
    pink: pinkTheme,
    light: lightTheme,
  };
  const themeColors = {
    dark: "#121212",
    light: "#ffffff",
    pink: "#e91e63",
  };

  useEffect(() => {
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", themeColors[theme] || "#121212");
  }, [theme]);
  return (
    <MuiThemeProvider theme={themes[theme] || darkTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jurisprudencias"
              element={
                <ProtectedRoute>
                  <Jurisprudencias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
}

export default function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
