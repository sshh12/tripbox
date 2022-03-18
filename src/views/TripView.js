import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Link } from "rebass";
import { useAppEnv } from "../env";

const TripView = ({ path }) => {
  const { api } = useAppEnv();
  const [trip, setTrip] = useState(null);
  const TABS = {
    Items: null,
    Members: null,
    Map: null,
    Timeline: null,
  };
  const [curTab, setCurTab] = useState(Object.keys(TABS)[0]);
  useEffect(() => {
    api.get("/api/trips", { trip_id: path[1] }).then((trip) => setTrip(trip));
  }, [api, path]);
  return (
    <Box>
      <Flex px={2} color="white" bg="black" alignItems="center">
        <Text p={2} fontWeight="bold">
          <a style={{ textDecoration: "none", color: "#fff" }} href="/">
            TripBox
          </a>{" "}
          / {trip?.name}
        </Text>
        <Box mx="auto" />
        <Link variant="nav" href={"/edit_trip/" + path[1]} color="#fff" mr={3}>
          edit
        </Link>
        <Link variant="nav" href={"/edit_trip/" + path[1]} color="#fff" mr={3}>
          invite
        </Link>
        <Link variant="nav" href={"/add_to_trip/" + path[1]} color="#fff">
          add item
        </Link>
      </Flex>
      <Flex
        p={2}
        color="white"
        bg="#30c"
        alignItems="center"
        justifyContent="space-evenly"
      >
        {Object.keys(TABS).map((tab) => (
          <Link
            key={tab}
            variant="nav"
            onClick={() => setCurTab(tab)}
            color="#fff"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {tab === curTab ? <b>Trip {tab}</b> : tab}
          </Link>
        ))}
      </Flex>
      {JSON.stringify(trip)}
    </Box>
  );
};

export default TripView;
