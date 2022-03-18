import React from "react";
import { Box, Flex, Text, Image, Card } from "rebass";
import { Link as Lk } from "react-router-dom";

const TripMembers = ({ trip }) => {
  return (
    <Box p={3}>
      <Box>
        <Card
          sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px", cursor: "pointer" }}
          w={1 / 2}
          p={2}
          mb={3}
        >
          <Flex alignItems="center">
            <Lk
              to={"/invite_to_trip/" + trip?.trip_id}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <Box>
                <Text>
                  <b>Invite Member</b>
                </Text>
                <Text>Add someone as a traveller on this trip (can edit)</Text>
              </Box>
            </Lk>
          </Flex>
        </Card>
        <Card
          sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px", cursor: "pointer" }}
          w={1 / 2}
          p={2}
          mb={3}
        >
          <Flex alignItems="center">
            <Lk
              to={"/invite_obs_to_trip/" + trip?.trip_id}
              style={{ textDecoration: "none", color: "#000" }}
            >
              {" "}
              <Box>
                <Text>
                  <b>Invite Observer</b>
                </Text>
                <Text>Add an observer to this trip (view only)</Text>
              </Box>
            </Lk>
          </Flex>
        </Card>
      </Box>
      {trip.users.map((user) => (
        <Box key={user.email}>
          <Card sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }} p={2} mb={3}>
            <Flex alignItems="center">
              <Image
                src={"https://source.unsplash.com/random/128x128"}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 9999,
                }}
                mr={3}
              />
              <Box>
                <Text>
                  <b>
                    {user.username} {user.owner && "👑"}
                    {user.viewer_only && "🔎"}
                  </b>
                </Text>
                <Text>{user.email}</Text>
              </Box>
              <Box ml="auto" mr={2}>
                <Text>
                  <b>X</b>
                </Text>
              </Box>
            </Flex>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default TripMembers;
