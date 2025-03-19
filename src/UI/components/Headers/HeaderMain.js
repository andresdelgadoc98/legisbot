import React from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
export default function HeaderMain({ toggleDrawerMain }) {
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
          onClick={toggleDrawerMain(true)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
