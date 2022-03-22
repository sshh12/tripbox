import React from "react";
import { Box, Card, Text } from "rebass";
import CopyInput from "../components/CopyInput";
import TripModel from "../components/TripModal";
import ItemEditor from "../components/ItemEditor";

const TripAdd = () => {
  return (
    <TripModel
      renderTitle={({ trip }) => `Add to ${trip.name}`}
      contents={({ trip }) => (
        <Box p={2}>
          <Box>
            <Card
              mt={2}
              sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}
              p={2}
            >
              <Text fontWeight={700}>Add With Email</Text>
              <CopyInput name="email" value={trip.inbox_email} />
            </Card>
          </Box>
          <hr />
          <Box>
            <Card
              mt={2}
              sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}
              p={2}
            >
              <Text fontWeight={700}>Add Manually</Text>
              <ItemEditor
                newItem={true}
                trip={trip}
                item={{ title: "New Item", item_id: null, props: {}, tags: [] }}
              />
            </Card>
          </Box>
        </Box>
      )}
    />
  );
};

export default TripAdd;
