import React, { useEffect, useState } from "react";
import { tagIdxToColor, tagToLabel } from "./../app/util";
import { useAppEnv } from "./../app/env";
import ITEM_PROPS from "./../app/ItemProps";

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
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ItemView from "../components/ItemView";

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
  for (let tag in itemsByTag) {
    itemsByTag[tag].sort((a, b) => a.title.localeCompare(b.title));
  }
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  return (
    <Box>
      <ItemView
        open={showNewItemDialog}
        setOpen={setShowNewItemDialog}
        item={{ title: "", tags: ["Untagged"], props: {} }}
        trip={trip}
        canEdit={canEdit}
        newItem={true}
      />
      {canEdit && (
        <Fab
          variant="extended"
          color="secondary"
          onClick={() => setShowNewItemDialog(true)}
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
      )}
      <Box p={1} mt={canEdit ? "200px" : "72px"}>
        {trip &&
          Object.keys(itemsByTag).map((tag, idx) => (
            <TagCard
              idx={idx}
              trip={trip}
              tag={tag}
              items={itemsByTag[tag]}
              key={tag}
              canEdit={canEdit}
            />
          ))}
      </Box>
    </Box>
  );
}

function TagCard({ tag, items, trip, canEdit, idx }) {
  const { api } = useAppEnv();
  const openKey = `${trip.trip_id}:${tag}:open`;
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setExpanded(api.getKey(openKey));
  }, [api, openKey]);
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
        style={{
          backgroundColor: tagIdxToColor(idx),
          color: "#fff",
          minHeight: "20px",
        }}
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
              <TripItem trip={trip} item={item} canEdit={canEdit} />
              {i !== items.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

function TripItem({ trip, item, canEdit }) {
  const props = Object.keys(ITEM_PROPS);
  const [open, setOpen] = useState(false);
  return (
    <ListItem
      alignItems="flex-start"
      onClick={() => {
        if (!open) {
          setOpen(true);
        }
      }}
      sx={{ padding: "6px 6px 6px 10px" }}
    >
      <ItemView
        open={open}
        setOpen={setOpen}
        item={item}
        trip={trip}
        canEdit={canEdit}
      />
      <ListItemText
        primary={<span>{item.title}</span>}
        secondary={
          <React.Fragment>
            <List>
              {props.map((prop) => {
                const { icon: PropIcon, renderInList: PropElem } =
                  ITEM_PROPS[prop];
                return (
                  <Box key={prop}>
                    {Object.keys(item.props).includes(prop) && (
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <PropIcon />
                          </ListItemIcon>
                          <PropElem
                            trip={trip}
                            item={item}
                            propDef={ITEM_PROPS[prop]}
                            value={item.props[prop]}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                    {Object.keys(item.props).includes(prop) && (
                      <Divider variant="inset" component="li" />
                    )}
                  </Box>
                );
              })}
            </List>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default TripItems;
