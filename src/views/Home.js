import React, { useState, useEffect } from "react";
import { useAppEnv } from "../app/env";

import { Link as Lk } from "react-router-dom";
import MenuAppBar from "../components/MenuAppBar";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

const Home = () => {
  const { api } = useAppEnv();
  const [trips, setTrips] = useState(null);
  useEffect(() => {
    api.get("/api/trips").then(({ data: trips }) => setTrips(trips));
  }, [api]);
  return (
    <Box>
      <MenuAppBar loading={trips === null} />
      <Box sx={{ margin: "66px 10px 10px 10px" }}>
        {trips !== null && <TripImageList trips={trips} />}
      </Box>
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

export default Home;
