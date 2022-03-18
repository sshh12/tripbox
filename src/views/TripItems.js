import React, { useState } from "react";
import { Input } from "@rebass/forms";
import { Box, Flex, Text, Card } from "rebass";
import { Link as Lk } from "react-router-dom";
import { tagToColor, tagToLabel } from "../tags";
import CopyInput from "../components/CopyInput";

const TripItems = ({ trip }) => {
  const itemsByTag = {};
  for (let item of trip.items) {
    for (let tag of item.tags) {
      if (!(tag in itemsByTag)) {
        itemsByTag[tag] = [];
      }
      itemsByTag[tag].push(item);
      itemsByTag[tag].push(item);
    }
  }
  const tagsSorted = Object.keys(itemsByTag);
  tagsSorted.sort((a, b) => a.localeCompare(b));
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
                forward emails directly to:{" "}
                <CopyInput mt={1} name={"email"} value={trip.inbox_email} />
              </Text>
            </Box>
            <Box ml="auto" mr={2} pl={4}>
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
      {tagsSorted.map((tag) => (
        <Box key={tag}>
          <TagCard tag={tag} items={itemsByTag[tag]} />
        </Box>
      ))}
    </Box>
  );
};

const TagCard = ({ tag, items }) => {
  const [expanded, setExpanded] = useState(1);
  return (
    <Card sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }} p={0} mb={3}>
      <Flex
        color={"#fff"}
        bg={tagToColor(tag)}
        width={1}
        p={1}
        alignItems="center"
      >
        <Text>
          <b>{tagToLabel(tag)}</b>
        </Text>
        <Text
          ml="auto"
          onClick={() => setExpanded((expanded + 1) % 3)}
          sx={{ cursor: "pointer" }}
        >
          {expanded == 0 && <b>[+]</b>}
          {expanded == 1 && <b>[+]</b>}
          {expanded == 2 && <b>[-]</b>}
        </Text>
      </Flex>
      <Flex alignItems="center" px={expanded == 2 ? 1 : 0}>
        {expanded === 1 && (
          <Box>
            <ul style={{ paddingLeft: "20px" }}>
              {items.map((item) => (
                <li key={item.item_id}>{item.title}</li>
              ))}
            </ul>
          </Box>
        )}
        {expanded === 2 && (
          <Box width={1}>
            {items.map((item) => (
              <ItemCard tag={tag} key={item.item_id} item={item} />
            ))}
          </Box>
        )}
      </Flex>
    </Card>
  );
};

const ItemCard = ({ tag, item }) => {
  return (
    <Card width={1} sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}>
      <Flex
        color={"#000"}
        sx={{ outline: tagToColor(tag) + " solid" }}
        width={1}
        p={1}
        alignItems="center"
      >
        <Text width={1}>
          <b>{item.title}</b>
        </Text>
      </Flex>
      {item.props.email && (
        <iframe style={{ width: "100%" }} srcdoc={item.props.email?.html} />
      )}
    </Card>
  );
};

export default TripItems;
