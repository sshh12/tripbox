import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Link as Lk } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from "@mui/icons-material/Tune";
import CopyInput from "../components/CopyInput";
import OfflineIcon from "../components/OfflineIcon";
import TripOptions from "../components/TripOptions";

function TripAppBar({ loading, trip, canEdit, showExtras }) {
  const [showTripOptions, setShowTripOptions] = useState(false);
  return (
    <>
      {trip && (
        <TripOptions
          open={showTripOptions}
          setOpen={setShowTripOptions}
          trip={trip}
        />
      )}
      <AppBar position="fixed">
        <Toolbar>
          <Lk to="/" style={{ color: "white" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Lk>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {trip ? trip.name : ""}
          </Typography>
          <OfflineIcon />
          {canEdit && (
            <IconButton
              size="large"
              color="inherit"
              onClick={() => setShowTripOptions(true)}
            >
              <TuneIcon />
            </IconButton>
          )}
        </Toolbar>
        {loading && <LinearProgress />}
        {showExtras && canEdit && (
          <Box m={2}>
            <Typography pb={1}>
              Send trip related emails to the address below or use the + button
              to add an item to this trip.
            </Typography>
            <CopyInput
              sx={{ color: "white" }}
              value={trip?.inbox_email || ""}
            />
          </Box>
        )}
      </AppBar>
    </>
  );
}

export default TripAppBar;
