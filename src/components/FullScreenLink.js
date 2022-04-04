import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import OfflineIcon from "./OfflineIcon";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function FullScreenLink({ opener, viewer }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const OpenElem = opener;
  const PageElem = viewer;
  return (
    <Box>
      <OpenElem
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      />
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
            <OfflineIcon />
          </Toolbar>
        </AppBar>
        <PageElem />
      </Dialog>
    </Box>
  );
}

export default FullScreenLink;
