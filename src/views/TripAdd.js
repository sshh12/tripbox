import React from "react";
import { Box } from "rebass";
import { Label } from "@rebass/forms";
import CopyInput from "../components/CopyInput";
import TripModel from "../components/TripModal";

const TripAdd = () => {
  return (
    <TripModel
      renderTitle={({ trip }) => `Add to ${trip.name}`}
      contents={({ trip }) => (
        <Box p={2}>
          <Box my={3}>
            <Label htmlFor="email">Forward trip related email to</Label>
            <CopyInput name="email" value={trip.inbox_email} />
          </Box>
          <hr />
        </Box>
      )}
    />
  );
};

export default TripAdd;
