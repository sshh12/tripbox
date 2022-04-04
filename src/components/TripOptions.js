import React, { useEffect, useState } from "react";
import { useAppEnv } from "./../app/env";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import OfflineIcon from "./OfflineIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function TripOptions({ trip, open, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [editTrip, setEditTrip] = useState(trip);
  useEffect(() => {
    setEditTrip(trip);
  }, [trip]);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setEditTrip(trip);
  };
  const { api, refresh } = useAppEnv();
  const nav = useNavigate();
  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Edit {trip.name}
            </Typography>
            <OfflineIcon />
            <IconButton size="large" color="inherit">
              {!loading && (
                <SaveIcon
                  onClick={async () => {
                    setLoading(true);
                    await api.put(
                      "/api/trips?trip_id=" + trip.trip_id,
                      editTrip
                    );
                    refresh();
                    handleClose();
                  }}
                />
              )}
            </IconButton>
          </Toolbar>
          <Box m={2}>
            {!loading && (
              <Box>
                <TextField
                  sx={{ width: "100%" }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  label=""
                  variant="outlined"
                  color="common"
                  value={editTrip.name}
                  onChange={(e) =>
                    setEditTrip({ ...editTrip, name: e.target.value })
                  }
                />
              </Box>
            )}
          </Box>
        </AppBar>
        {!loading && (
          <List>
            <ListItem
              disablePadding
              onClick={async () => {
                if (!window.confirm("Delete " + trip.name + "?")) {
                  return;
                }
                setLoading(true);
                await api.del("/api/trips?trip_id=" + trip.trip_id);
                refresh();
                nav("/");
              }}
            >
              <ListItemButton>
                <ListItemText
                  primary={
                    <Button color="error" variant="text">
                      Delete
                    </Button>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        )}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}

export default TripOptions;
