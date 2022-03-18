import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Link } from "rebass";
import { useAppEnv } from "../env";

const TripsView = () => {
  const { user, api } = useAppEnv();
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    api.get("/api/trips").then((trips) => setTrips(trips));
  }, [api]);
  return (
    <Box>
      <Flex px={2} color="white" bg="black" alignItems="center">
        <Text p={2} fontWeight="bold">
          TripBox
        </Text>
        <Box mx="auto" />
        <Link variant="nav" href="#!" color="#fff">
          {user.username}
        </Link>
      </Flex>
      <Box>
        <Box
          m={20}
          sx={{
            px: 2,
            py: 2,
            backgroundSize: "cover",
            borderRadius: 8,
            outline: "#000 solid 1px",
            color: "black",
            bg: "white",
            cursor: "pointer",
          }}
        >
          <Text
            textAlign="center"
            fontSize={[5]}
            onClick={async () => {
              const name = prompt("Name of Trip? ex. Las Vegas 2018");
              if (!name) {
                return;
              }
              const trip = await api.post("/api/trips", { name: name });
              window.location.href = "/trips/" + trip.trip_id;
            }}
          >
            Create Trip
          </Text>
        </Box>
        {trips.map((trip) => (
          <Box
            onClick={() => (window.location.href = "/trips/" + trip.trip_id)}
            m={20}
            sx={{
              px: 4,
              py: 6,
              backgroundImage:
                "url(https://source.unsplash.com/random/1024x768)",
              backgroundSize: "cover",
              borderRadius: 8,
              color: "white",
              bg: "gray",
              cursor: "pointer",
            }}
          >
            <Text textAlign="center" fontSize={[5]}>
              {trip.name}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TripsView;