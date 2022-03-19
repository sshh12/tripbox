import React, { useState } from "react";
import { Box, Button } from "rebass";
import TripModel from "../components/TripModal";
import { useLocation } from "react-router-dom";
import { MultiSelect } from "react-selectize";
import { useAppEnv } from "../env";
import { useNavigate } from "react-router-dom";

const TripInvite = () => {
  const { api } = useAppEnv();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const location = useLocation();
  const isForMember = !location.pathname.includes("_obs_");
  const knownEmails = [];
  const nav = useNavigate();
  return (
    <TripModel
      renderTitle={({ trip }) => `Invite to ${trip.name}`}
      contents={({ trip }) => (
        <Box p={2}>
          <Box>
            <MultiSelect
              style={{ width: "100%" }}
              placeholder={
                isForMember
                  ? "Invite members by email"
                  : "Invite observers by email"
              }
              defaultValues={emails.map((e) => ({ value: e, label: e }))}
              options={knownEmails.map((e) => ({ value: e, label: e }))}
              onValuesChange={(value) => setEmails(value.map((v) => v.value))}
              createFromSearch={(opts, val, query) => {
                if (!query.includes("@")) {
                  return;
                }
                return { value: query, label: query };
              }}
            />
          </Box>
          <Box mt={2}>
            {!loading && emails.length > 0 && (
              <Button
                bg="#07c"
                onClick={async () => {
                  setLoading(true);
                  await Promise.all(
                    emails.map((email) =>
                      api.post("/api/invite", {
                        trip_id: trip.trip_id,
                        viewer_only: !isForMember,
                        email: email,
                      })
                    )
                  );
                  nav("/trips/" + trip.trip_id);
                }}
              >
                Invite
              </Button>
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export default TripInvite;
