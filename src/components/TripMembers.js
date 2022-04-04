import React, { useState } from "react";
import { useAppEnv } from "./../app/env";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import NotificationSnack from "./NotificationSnack";

function TripMembers({ trip, loading, canEdit }) {
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const { api, refresh } = useAppEnv();
  return (
    <Box>
      {canEdit && (
        <Fab
          onClick={() => setShowMemberDialog(true)}
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
          <PersonAddIcon />
          <b style={{ marginLeft: "5px" }}>Invite to trip</b>
        </Fab>
      )}
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {trip.users.map((user, i) => (
          <Box key={user.email}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                canEdit && !user.owner ? (
                  <IconButton
                    edge="end"
                    onClick={async () => {
                      if (!window.confirm("Remove " + user.username + "?")) {
                        return;
                      }
                      await api.post("/api/kick", {
                        trip_id: trip.trip_id,
                        email: user.email,
                      });
                      refresh();
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemText
                primary={`${user.username} ${user.owner ? "👑" : ""} ${
                  user.viewer_only ? "🔎" : ""
                }`}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {i !== trip.users.length - 1 && <Divider component="li" />}
          </Box>
        ))}
      </List>
      <AddMemberDialog
        trip={trip}
        open={showMemberDialog}
        setOpen={(show) => setShowMemberDialog(show)}
      />
    </Box>
  );
}

function AddMemberDialog({ open, setOpen, trip }) {
  const { api } = useAppEnv();
  const [viewerOnly, setViewerOnly] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [emails, setEmails] = useState([""]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <NotificationSnack
        duration={2000}
        message={"Invite(s) sent!"}
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a person via email to this trip.
          </DialogContentText>
          <Box>
            {emails.map((email, i) => (
              <TextField
                key={i}
                margin="dense"
                label={i === 0 ? "Email Address" : "Email Address " + (i + 1)}
                type="email"
                fullWidth
                variant="standard"
                value={email}
                onChange={(e) => {
                  let newEmails = Object.assign([], emails);
                  newEmails[i] = e.target.value;
                  newEmails = newEmails.filter((e) => e !== "");
                  newEmails.push("");
                  setEmails(newEmails);
                }}
              />
            ))}
          </Box>
          <Box mt={2}>
            <RadioGroup
              name="triprole"
              value={viewerOnly}
              onChange={(e) => setViewerOnly(e.target.value)}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="As traveller"
              />
              <FormHelperText>
                Add a member to this trip who can add content and edit items.
              </FormHelperText>
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="As observer"
              />
              <FormHelperText>
                Add an observer to this trip who can view it's contents but
                cannot add or edit.
              </FormHelperText>
            </RadioGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={async () => {
              setSnackOpen(true);
              handleClose();
              await Promise.all(
                emails
                  .filter((e) => e !== "")
                  .map((email) =>
                    api.post("/api/invite", {
                      trip_id: trip.trip_id,
                      viewer_only: viewerOnly,
                      email: email,
                    })
                  )
              );
            }}
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TripMembers;
