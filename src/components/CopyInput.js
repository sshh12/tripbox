import React from "react";
import FilledInput from "@mui/material/FilledInput";

const CopyInput = ({ value, ...props }) => {
  return (
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
      }}
    />
  );
};

export default CopyInput;
