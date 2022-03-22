import React, { useState, useEffect } from "react";
import { Box, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import TripModel from "../components/TripModal";
import { useNavigate } from "react-router-dom";
import { useAppEnv } from "../env";

const TripEdit = () => {
  return (
    <TripModel
      renderTitle={({ trip }) => `Edit ${trip.name}`}
      contents={({ trip }) => <TripEditor trip={trip} />}
    />
  );
};

const TripEditor = ({ trip }) => {
  const [loading, setLoading] = useState(false);
  const { api, refresh } = useAppEnv();
  const [editTrip, setEditTrip] = useState(trip);
  useEffect(() => {
    setEditTrip(trip);
  }, [trip]);
  const nav = useNavigate();
  return (
    <Box p={2}>
      <Box pb={2}>
        <Label htmlFor="title">Name</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Trip Name"
          value={editTrip.name}
          onChange={(e) => setEditTrip({ ...editTrip, name: e.target.value })}
        />
      </Box>
      <Box mt={4}>
        {!loading && (
          <Button
            sx={{ cursor: "pointer" }}
            onClick={async () => {
              setLoading(true);
              await api.put("/api/trips?trip_id=" + trip.trip_id, editTrip);
              refresh();
              nav("/");
            }}
            bg="#07c"
          >
            Save Changes
          </Button>
        )}
        {!loading && (
          <Button
            ml={2}
            sx={{ cursor: "pointer" }}
            onClick={async () => {
              if (
                !window.confirm(
                  "Are you sure you want to delete this? It cannot be undone."
                )
              ) {
                return;
              }
              setLoading(true);
              await api.del("/api/trips?trip_id=" + trip.trip_id);
              refresh();
              nav("/");
            }}
            bg="red"
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TripEdit;
