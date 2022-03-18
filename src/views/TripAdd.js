import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useAppEnv } from "../env";

const TripAdd = ({ path }) => {
  const { api } = useAppEnv();
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    api.get("/api/trips", { trip_id: path[1] }).then((trip) => setTrip(trip));
  }, [api, path]);
  return (
    <Box>
      <Flex
        px={2}
        color="white"
        bg="black"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text p={2} fontWeight="bold">
          <a
            style={{ textDecoration: "none", color: "#fff" }}
            href={"/trips/" + path[1]}
          >
            {"X"}
          </a>
        </Text>
        <Text mx="auto">Add to {trip?.name}</Text>
        <Text p={2} fontWeight="bold" color="#000">
          {"X"}
        </Text>
      </Flex>
      <Box p={2}>
        <Box my={3}>
          <Label htmlFor="email">Forward trip related email to</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={trip?.inbox_email}
            onClick={(e) => {
              e.target.select();
              document.execCommand("copy");
            }}
          />
        </Box>
        <hr />
      </Box>
    </Box>
  );
};

export default TripAdd;
