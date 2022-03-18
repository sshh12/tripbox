import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "rebass";
import { useParams, Link as Lk } from "react-router-dom";
import { Label, Input } from "@rebass/forms";
import { useAppEnv } from "../env";
import CopyInput from "../components/CopyInput";

const TripAdd = () => {
  const { trip_id } = useParams();
  const { api } = useAppEnv();
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    api.get("/api/trips", { trip_id: trip_id }).then((trip) => setTrip(trip));
  }, [api, trip_id]);
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
          <Lk
            style={{ textDecoration: "none", color: "#fff" }}
            to={"/trips/" + trip_id}
          >
            {"X"}
          </Lk>
        </Text>
        <Text mx="auto">Add to {trip?.name}</Text>
        <Text p={2} fontWeight="bold" color="#000">
          {"X"}
        </Text>
      </Flex>
      <Box p={2}>
        <Box my={3}>
          <Label htmlFor="email">Forward trip related email to</Label>
          <CopyInput name="email" value={trip?.inbox_email} />
        </Box>
        <hr />
      </Box>
    </Box>
  );
};

export default TripAdd;
