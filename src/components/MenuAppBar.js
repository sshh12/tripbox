import React from "react";

import AppBar from "@mui/material/AppBar";
import { Link as Lk } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LinearProgress from "@mui/material/LinearProgress";
import MenuIcon from "@mui/icons-material/Menu";
import TuneIcon from "@mui/icons-material/Tune";
import OfflineIcon from "./OfflineIcon";

function MenuAppBar({ loading, showHomeBtn, profileLink, optionsLink, title }) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        {showHomeBtn && (
          <Lk to="/" style={{ color: "white" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Lk>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <OfflineIcon />
        <div>
          {profileLink && (
            <Lk
              to={profileLink}
              style={{ textDecoration: "none", color: "white" }}
            >
              <IconButton size="large" color="inherit">
                <AccountCircle />
              </IconButton>
            </Lk>
          )}
          {optionsLink && (
            <Lk
              to={optionsLink}
              style={{ textDecoration: "none", color: "white" }}
            >
              <IconButton size="large" color="inherit">
                <TuneIcon />
              </IconButton>
            </Lk>
          )}
        </div>
      </Toolbar>
      {loading && <LinearProgress />}
    </AppBar>
  );
}

export default MenuAppBar;
