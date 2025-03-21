import React from "react";
import BalanceIcon from "@mui/icons-material/Balance";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, FormControl, IconButton, Button } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

export default function Header({
  toggleDrawer,
  setModalOpen,
  handleOpenContextModal,
  toggleDrawerMain,
}) {
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        ></Box>

        <Box display="flex" alignItems="center">
          {/* <FormControl variant="outlined">
     <SearchTypeButton searchType={searchType} name_file={name_file} />
   </FormControl> */}

          <FormControl variant="outlined" sx={{ ml: 1 }}>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              <SearchIcon />
            </Button>
          </FormControl>
          <FormControl variant="outlined" sx={{ ml: 1 }}>
            <Button variant="contained" onClick={handleOpenContextModal}>
              <BalanceIcon />
            </Button>
          </FormControl>

          <FormControl variant="outlined" sx={{ ml: 1 }}>
            <Button variant="contained" onClick={toggleDrawer(true)}>
              <HistoryIcon />
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}
