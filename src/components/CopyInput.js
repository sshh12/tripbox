import React, { useState } from "react";
import FilledInput from "@mui/material/FilledInput";
import NotificationSnack from "./NotificationSnack";

const CopyInput = ({ value, ...props }) => {
  const [snackOpen, setSnackOpen] = useState(false);
  return (
    <>
      <NotificationSnack
        duration={2000}
        message={"Copied"}
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
      />
      <FilledInput
        {...props}
        fullWidth
        hiddenLabel={true}
        readOnly={true}
        variant="filled"
        value={value}
        onChange={() => {}}
        onClick={(e) => {
          e.target.select();
          document.execCommand("copy");
          setSnackOpen(true);
        }}
      />
    </>
  );
};

export default CopyInput;
