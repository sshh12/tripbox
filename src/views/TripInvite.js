import React from "react";
import { Box } from "rebass";
import TripModel from "../components/TripModal";
import { useLocation } from "react-router-dom";
import { MultiSelect } from "react-selectize";

const TripInvite = () => {
  const location = useLocation();
  const isForMember = !location.pathname.includes("_obs_");
  return (
    <TripModel
      renderTitle={({ trip }) => `Invite to ${trip.name}`}
      contents={({ trip }) => (
        <Box p={2}>
          <MultiSelect
            style={{ width: "100%" }}
            placeholder={
              isForMember
                ? "Invite members by email"
                : "Invite observers by email"
            }
            options={[]}
            onValuesChange={(value) => alert(value)}
            createFromSearch={(opts, val, query) => {
              return { value: query, label: query };
            }}
          />
        </Box>
      )}
    />
  );
};

export default TripInvite;
