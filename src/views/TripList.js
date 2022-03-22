import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Link } from "rebass";
import { Link as Lk } from "react-router-dom";
import { useAppEnv } from "../env";

const TripList = () => {
  const { user, api, online } = useAppEnv();
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    api.get("/api/trips").then(({ data: trips }) => setTrips(trips));
  }, [api]);
  return (
    <Box>
      <Flex px={2} color="white" bg="black" alignItems="center">
        <Text p={2} fontWeight="bold">
          TripBox
        </Text>
        {!online && <Text fontSize={"0.8em"}>(offline)</Text>}
        <Box mx="auto" />
        <Link variant="nav" href="#!" color="#fff">
          {user.username}
        </Link>
      </Flex>
      <Box>
        {online && (
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
        )}
        {trips && (
          <Box>
            {trips.map((trip) => (
              <Lk
                to={`/trips/${trip.trip_id}`}
                style={{ textDecoration: "none" }}
                key={trip.trip_id}
              >
                <Box
                  m={20}
                  sx={{
                    px: 4,
                    py: 6,
                    backgroundImage:
                      "url(https://source.unsplash.com/random/1024x768?city)",
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
              </Lk>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TripList;
