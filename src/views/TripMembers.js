import React from "react";
import { Box, Flex, Text, Image, Card } from "rebass";
import { Link as Lk } from "react-router-dom";
import { useAppEnv } from "../env";

const TripMembers = ({ trip }) => {
  const { online } = useAppEnv();
  return (
    <Box p={3}>
      {online && (
        <Box>
          <MemberActionCard
            link={"/invite_to_trip/" + trip?.trip_id}
            title={"Invite Member"}
            desc={"Add someone as a traveller on this trip (can edit)"}
          />
          <MemberActionCard
            link={"/invite_obs_to_trip/" + trip?.trip_id}
            title={"Invite Observer"}
            desc={"Add an observer to this trip (view only)"}
          />
        </Box>
      )}
      {!online && (
        <Box>
          <MemberActionCard
            link={"#"}
            title={"You're Offline"}
            desc={"You cannot edit members while offline"}
          />
        </Box>
      )}
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

let MemberActionCard = ({ link, title, desc }) => {
  return (
    <Card
      sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px", cursor: "pointer" }}
      w={1 / 2}
      p={2}
      mb={3}
    >
      <Flex alignItems="center">
        <Lk to={link} style={{ textDecoration: "none", color: "#000" }}>
          <Box>
            <Text>
              <b>{title}</b>
            </Text>
            <Text>{desc}</Text>
          </Box>
        </Lk>
      </Flex>
    </Card>
  );
};

export default TripMembers;
