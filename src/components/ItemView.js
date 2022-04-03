import React, { useEffect, useState } from "react";
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
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function ItemView({ trip, item, open, setOpen, canEdit }) {
  const props = Object.keys(ITEM_PROPS);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(item);
  useEffect(() => {
    setEditItem(item);
  }, [item]);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setEditMode(false);
    setEditItem(item);
  };
  const { api, refresh } = useAppEnv();
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
              {trip.name}
            </Typography>
            {canEdit && (
              <IconButton size="large" color="inherit">
                {!loading && !editMode && (
                  <EditIcon onClick={() => setEditMode(true)} />
                )}
                {!loading && editMode && (
                  <SaveIcon
                    onClick={async () => {
                      setLoading(true);
                      await api.put(
                        "/api/items?item_id=" + item.item_id,
                        editItem
                      );
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
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText
                    primary={
                      <Button
                        color="error"
                        variant="text"
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
                        Delete
                      </Button>
                    }
                  />
                </ListItemButton>
              </ListItem>
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
      </Dialog>
    </Box>
  );
}

export default ItemView;
