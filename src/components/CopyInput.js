import React from "react";
import { Input } from "@rebass/forms";

const CopyInput = ({ name, value, ...props }) => {
  return (
    <Input
      {...props}
      id={name}
      name={name}
      type={name}
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
