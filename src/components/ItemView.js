import React, { useEffect, useState } from "react";
import { tagToLabel } from "../app/util";
import ITEM_PROPS from "./../app/ItemProps";
import { useAppEnv } from "./../app/env";

import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import CustomSelect from "./CustomSelect";
import OfflineIcon from "./OfflineIcon";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function ItemView({ trip, item, open, setOpen, canEdit, newItem }) {
  const props = Object.keys(ITEM_PROPS);
  const [editMode, setEditMode] = useState(newItem);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(item);
  const [showNewFieldDialog, setShowNewFieldDialog] = useState(false);
  useEffect(() => {
    setEditItem(item);
  }, [item]);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setEditMode(newItem);
    setEditItem(item);
  };
  const { api, refresh } = useAppEnv();
  const allTags = (trip?.items || []).reduce((acc, cur) => {
    for (let tag of cur.tags) {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    }
    return acc;
  }, []);
  return (
    <Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {trip?.name}
            </Typography>
            <OfflineIcon />
            {canEdit && (
              <IconButton size="large" color="inherit">
                {!loading && !editMode && (
                  <EditIcon onClick={() => setEditMode(true)} />
                )}
                {!loading && editMode && (
                  <SaveIcon
                    onClick={async () => {
                      setLoading(true);
                      if (newItem) {
                        await api.post(
                          "/api/items?trip_id=" + trip.trip_id,
                          editItem
                        );
                      } else {
                        await api.put(
                          "/api/items?item_id=" + item.item_id,
                          editItem
                        );
                      }
                      refresh();
                      handleClose();
                    }}
                  />
                )}
              </IconButton>
            )}
          </Toolbar>
          <Box m={2}>
            {!editMode && (
              <Typography pb={1}>
                <b>{item.title}</b>
              </Typography>
            )}
            {!loading && editMode && (
              <Box>
                <TextField
                  placeholder="Item title"
                  sx={{ width: "100%" }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  label=""
                  variant="outlined"
                  color="common"
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem({ ...editItem, title: e.target.value })
                  }
                />
              </Box>
            )}
            {!loading && editMode && (
              <Box pt={1}>
                <CustomSelect
                  value={editItem.tags[0]}
                  options={allTags.map((t) => ({
                    label: tagToLabel(t),
                    value: t,
                  }))}
                  onUpdate={(group) => {
                    setEditItem({ ...editItem, tags: [group] });
                  }}
                />
              </Box>
            )}
          </Box>
        </AppBar>
        <Box>
          {!loading && !editMode && (
            <List>
              {props.map((prop) => {
                const { icon: PropIcon, renderInList: PropElem } =
                  ITEM_PROPS[prop];
                return (
                  <Box>
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
          )}
          {!loading && editMode && (
            <List>
              {props.map((prop) => {
                const { icon: PropIcon, renderInListEditor: PropEditorElem } =
                  ITEM_PROPS[prop];
                return (
                  <Box>
                    {Object.keys(editItem.props).includes(prop) && (
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <PropIcon />
                          </ListItemIcon>
                          <PropEditorElem
                            trip={trip}
                            item={editItem}
                            setEditItem={setEditItem}
                            propDef={ITEM_PROPS[prop]}
                            value={editItem.props[prop]}
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
              <ListItem disablePadding onClick={() => {}}>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <Button
                        onClick={() => setShowNewFieldDialog(true)}
                        variant="text"
                      >
                        Add Field
                      </Button>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {!newItem && (
                <ListItem
                  disablePadding
                  onClick={async () => {
                    if (!window.confirm("Delete " + item.title + "?")) {
                      return;
                    }
                    setLoading(true);
                    await api.del("/api/items?item_id=" + item.item_id);
                    refresh();
                    handleClose();
                  }}
                >
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Button color="error" variant="text">
                          Delete
                        </Button>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          )}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
        <NewFieldDialog
          item={item}
          open={showNewFieldDialog}
          setOpen={(show) => setShowNewFieldDialog(show)}
          addProp={(propKey) => {
            setEditItem({
              ...editItem,
              props: {
                ...editItem.props,
                [propKey]: ITEM_PROPS[propKey].defaultValue,
              },
            });
          }}
        />
      </Dialog>
    </Box>
  );
}

function NewFieldDialog({ item, open, setOpen, addProp }) {
  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Add Field</DialogTitle>
      <List>
        {Object.keys(ITEM_PROPS)
          .filter(
            (prop) =>
              ITEM_PROPS[prop].addable &&
              !Object.keys(item.props).includes(prop)
          )
          .map((prop) => {
            const { icon: PropIcon, title: name } = ITEM_PROPS[prop];
            return (
              <ListItem
                key={name}
                button
                onClick={() => {
                  addProp(prop);
                  setOpen(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PropIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} />
              </ListItem>
            );
          })}
      </List>
    </Dialog>
  );
}

export default ItemView;
