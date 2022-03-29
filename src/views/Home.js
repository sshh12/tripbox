import React, { useState, useEffect } from "react";
import { useAppEnv } from "../app/env";

import { Link as Lk } from "react-router-dom";
import MenuAppBar from "../components/MenuAppBar";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Home = () => {
  const { api } = useAppEnv();
  const [trips, setTrips] = useState(null);
  const [newTripOpen, setNewTripOpen] = useState(false);
  useEffect(() => {
    api.get("/api/trips").then(({ data: trips }) => setTrips(trips));
  }, [api]);
  return (
    <Box>
      <MenuAppBar loading={trips === null} />
      <Box sx={{ margin: "66px 10px 10px 10px" }}>
        {trips !== null && <TripImageList trips={trips} />}
      </Box>
      <Fab
        color="secondary"
        sx={{ position: "fixed", bottom: "16px", right: "24px", zIndex: 10 }}
        onClick={() => setNewTripOpen(true)}
      >
        <AddIcon />
      </Fab>
      <NewTripDialog open={newTripOpen} setOpen={setNewTripOpen} />
    </Box>
  );
};

function TripImageList({ trips }) {
  return (
    <ImageList cols={1}>
      {trips.map((trip) => (
        <Lk to={`/trips/${trip.trip_id}`} key={trip.trip_id}>
          <ImageListItem>
            <img
              src={`https://source.unsplash.com/random/1024x768?night`}
              alt={trip.name}
              loading="lazy"
            />
            <ImageListItemBar title={trip.name} />
          </ImageListItem>
        </Lk>
      ))}
    </ImageList>
  );
}

function NewTripDialog({ open, setOpen }) {
  const [tripName, setTripName] = useState("");
  const { api } = useAppEnv();
  const handleClose = () => {
    setOpen(false);
  };
  const addTrip = async () => {
    setOpen(false);
    if (!tripName) {
      return;
    }
    const trip = await api.post("/api/trips", { name: tripName });
    window.location.href = "/trips/" + trip.trip_id;
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Trip</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the name of your upcoming trip. You can invite members
          afterwards.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Trip Name"
          type="email"
          fullWidth
          variant="standard"
          placeholder="Las Vegas 2018"
          onChange={(e) => setTripName(e.target.value.trim())}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={addTrip}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Home;
