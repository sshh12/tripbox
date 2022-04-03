import React, { useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const NEW_VALUE = "$$NEW_VALUE$$";

function CustomSelect({ options, value, onUpdate }) {
  const [customVal, setCustomVal] = useState(null);
  return (
    <Box>
      {customVal !== null && (
        <TextField
          sx={{ width: "100%" }}
          InputProps={{
            style: { color: "white" },
          }}
          label=""
          variant="outlined"
          color="common"
          value={customVal}
          onChange={(e) => {
            setCustomVal(e.target.value);
            onUpdate(e.target.value);
          }}
        />
      )}
      {customVal === null && (
        <Select
          sx={{ color: "white", width: "100%" }}
          value={value}
          onChange={(e) => {
            if (e.target.value === NEW_VALUE) {
              setCustomVal("");
            } else {
              onUpdate(e.target.value);
            }
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
          <MenuItem value={NEW_VALUE}>New Group</MenuItem>
        </Select>
      )}
    </Box>
  );
}

export default CustomSelect;
