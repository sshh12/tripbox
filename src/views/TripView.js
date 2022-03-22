import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Link } from "rebass";
import { useAppEnv } from "../env";
import { useParams, Link as Lk } from "react-router-dom";
import TripMembers from "./TripMembers";
import TripItems from "./TripItems";

const TripView = () => {
  const { trip_id } = useParams();
  const { api, online, canEditTrip } = useAppEnv();
  const [trip, setTrip] = useState(null);
  const TABS = {
    Items: TripItems,
    Members: TripMembers,
  };
  const [curTab, setCurTab] = useState(Object.keys(TABS)[0]);
  useEffect(() => {
    api
      .get("/api/trips", { trip_id: trip_id })
      .then(({ data: trip }) => setTrip(trip));
  }, [api, trip_id]);
  const Page = TABS[curTab];
  const canEdit = canEditTrip(trip) && online;
  return (
    <Box>
      <Flex px={2} color="white" bg="black" alignItems="center">
        <Text p={2} fontWeight="bold">
          <Lk style={{ textDecoration: "none", color: "#fff" }} to="/">
            TripBox
          </Lk>{" "}
          / {trip?.name}
          {!online && <Text fontSize={"0.8em"}>(offline)</Text>}
        </Text>
        <Box mx="auto" />
        {canEdit && (
          <Lk to={"/edit_trip/" + trip_id} style={{ color: "#fff" }}>
            edit
          </Lk>
        )}
        {canEdit && (
          <Lk
            to={"/add_to_trip/" + trip_id}
            style={{ color: "#fff", marginLeft: "10px" }}
          >
            add item
          </Lk>
        )}
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
      {trip && <Page trip={trip} />}
    </Box>
  );
};

export default TripView;
