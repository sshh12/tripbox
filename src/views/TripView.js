import React, { useState, useEffect } from "react";
import { useAppEnv } from "../app/env";
import { useParams } from "react-router-dom";

import TripAppBar from "../components/TripAppBar";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import TripItems from "../components/TripItems";
import TripMembers from "../components/TripMembers";

const TAB_COMPONENTS = [TripItems, TripMembers];

const TripView = () => {
  const { trip_id } = useParams();
  const { api, canEditTrip } = useAppEnv();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = React.useState(0);
  const [loadingTrip, setLoadingTrip] = useState(false);
  useEffect(() => {
    setLoadingTrip(true);
    api.get("/api/trips", { trip_id: trip_id }).then(({ data: trip }) => {
      setTrip(trip);
      setLoadingTrip(false);
    });
  }, [api, trip_id]);
  const Page = TAB_COMPONENTS[tab];
  const canEdit = canEditTrip(trip);
  const loading = trip === null || loadingTrip;
  return (
    <Box>
      <TripAppBar
        loading={loading}
        trip={trip}
        canEdit={canEdit}
        showExtras={tab === 0}
      />
      <TripTabs tab={tab} setTab={setTab} />
      <Box sx={{ marginTop: "60px", marginBottom: "72px" }}>
        <Page trip={trip} loading={loading} canEdit={canEdit} />
      </Box>
    </Box>
  );
};

function TripTabs({ tab, setTab }) {
  const width = window.outerWidth;
  return (
    <Tabs
      sx={{
        backgroundColor: "#fff",
        position: "fixed",
        bottom: "0px",
        justifyContent: "space-evenly",
        width: width + "px",
        zIndex: 20,
      }}
      value={tab}
      onChange={(e, val) => setTab(val)}
    >
      <Tab
        icon={<CategoryIcon />}
        sx={{ textTransform: "none", width: width / 2 + "px" }}
        label="Trip"
      />
      <Tab
        fullWidth
        icon={<PeopleIcon />}
        sx={{ textTransform: "none", width: width / 2 + "px" }}
        label="Members"
      />
    </Tabs>
  );
}

export default TripView;
