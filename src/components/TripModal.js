import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "rebass";
import { useParams, Link as Lk } from "react-router-dom";
import { useAppEnv } from "../env";

const TripModal = ({ contents, renderTitle }) => {
  const { trip_id, item_id } = useParams();
  const { api } = useAppEnv();
  const [trip, setTrip] = useState(null);
  useEffect(() => {
    api.get("/api/trips", { trip_id: trip_id }).then((trip) => setTrip(trip));
  }, [api, trip_id]);
  let item = null;
  if (item_id && trip) {
    item = trip.items.find((it) => it.item_id === parseInt(item_id));
  }
  const Page = contents;
  let title = null;
  let renderedTitle = null;
  if (trip) {
    title = renderTitle({ trip, item });
    renderedTitle = title;
    while (renderedTitle.length > 40) {
      let parts = renderedTitle.split(" ");
      renderedTitle = parts.slice(0, parts.length - 1).join(" ");
    }
    if (renderedTitle.length === 0) {
      renderTitle = "item";
    } else if (renderedTitle !== title) {
      renderedTitle += "...";
    }
  }
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
        <Text mx="auto">{renderedTitle}</Text>
        <Text p={2} fontWeight="bold" color="#000">
          {"X"}
        </Text>
      </Flex>
      {trip && <Page trip={trip} item={item} />}
    </Box>
  );
};

export default TripModal;
