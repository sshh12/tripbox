import React from "react";
import { Input } from "@rebass/forms";
import { Box, Flex, Text, Card } from "rebass";
import { Link as Lk } from "react-router-dom";

let tagToColor = (tag) => {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#3F51B5",
    "#03A9F4",
    "#00BCD4",
    "#4CAF50",
    "#CDDC39",
    "#FFEB3B",
    "#607D8B",
  ];
  const hash = tag.split("").reduce((acc, val) => val.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const TripItems = ({ trip }) => {
  const itemsByTag = {};
  for (let item of trip.items) {
    for (let tag of item.tags) {
      if (!(tag in itemsByTag)) {
        itemsByTag[tag] = [];
      }
      itemsByTag[tag].push(item);
    }
  }
  return (
    <Box p={3}>
      <Box>
        <Card
          sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}
          w={1 / 2}
          p={2}
          mb={3}
        >
          <Flex alignItems="center">
            <Box>
              <Lk
                to={"/add_to_trip/" + trip.trip_id}
                style={{ textDecoration: "none", color: "#000" }}
              >
                <Text>
                  <b>Add Item</b>
                </Text>
              </Lk>
              <Text>
                Add a confirmation, receipt, etc to this trip. You can also
                forward emails to:{" "}
                <Input
                  mt={1}
                  id="email"
                  name="email"
                  type="email"
                  value={trip.inbox_email}
                  onClick={(e) => {
                    e.target.select();
                    document.execCommand("copy");
                  }}
                />
              </Text>
            </Box>
            <Box ml="auto" mr={2}>
              <Lk
                to={"/add_to_trip/" + trip.trip_id}
                style={{ textDecoration: "none", color: "#000" }}
              >
                <Text fontSize={"2em"}>
                  <b>+</b>
                </Text>
              </Lk>
            </Box>
          </Flex>
        </Card>
      </Box>
      {Object.keys(itemsByTag).map((tag) => (
        <Box key={tag}>
          <Card sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }} p={0} mb={3}>
            <Text color={"#fff"} bg={tagToColor(tag)} width={1} p={1}>
              <b>{tag}</b>
            </Text>
            <Flex alignItems="center" px={2}>
              <Box>
                <ul style={{ paddingLeft: "20px" }}>
                  {itemsByTag[tag].map((item) => (
                    <li key={item.item_id}>{item.title}</li>
                  ))}
                </ul>
              </Box>
            </Flex>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default TripItems;
