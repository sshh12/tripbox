import React, { useEffect, useState } from "react";
import { tagToColor, tagToLabel } from "./../app/util";
import { useAppEnv } from "./../app/env";

import { Link as Lk } from "react-router-dom";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";

function TripItems({ trip, loading, canEdit }) {
  const itemsByTag = {};
  if (trip) {
    for (let item of trip.items) {
      const tag = item.tags.length > 0 ? item.tags[0] : ["Ungrouped"];
      if (!(tag in itemsByTag)) {
        itemsByTag[tag] = [];
      }
      itemsByTag[tag].push(item);
    }
  }
  return (
    <Box>
      {canEdit && (
        <Lk
          to={"/add_to_trip/" + trip?.trip_id}
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Fab
            variant="extended"
            color="secondary"
            sx={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              zIndex: 10,
              textTransform: "none",
            }}
          >
            <AddIcon />
            <b>Add to trip</b>
          </Fab>
        </Lk>
      )}
      <Box p={1} mt={"200px"}>
        {trip &&
          Object.keys(itemsByTag).map((tag) => (
            <TagCard trip={trip} tag={tag} items={itemsByTag[tag]} key={tag} />
          ))}
      </Box>
    </Box>
  );
}

function TagCard({ tag, items, trip }) {
  const { api } = useAppEnv();
  const openKey = `${trip.trip_id}:${tag}:open`;
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setExpanded(api.getKey(openKey));
  }, [api]);
  return (
    <Accordion
      key={tag}
      expanded={expanded}
      onChange={(e, expanded) => {
        setExpanded(expanded);
        api.setKey(openKey, expanded);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{ backgroundColor: tagToColor(tag), color: "#fff" }}
      >
        <Typography>
          <b>{tagToLabel(tag)}</b>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
        >
          {items.map((item, i) => (
            <Box key={item.item_id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={item.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      ></Typography>
                      <span>{JSON.stringify(Object.keys(item.props))}</span>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {i !== items.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default TripItems;
