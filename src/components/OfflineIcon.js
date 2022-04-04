import React from "react";
import { useAppEnv } from "../app/env";

import WifiOffIcon from "@mui/icons-material/WifiOff";

const OfflineIcon = () => {
  const { online } = useAppEnv();
  if (online) {
    return <></>;
  }
  return <WifiOffIcon />;
};

export default OfflineIcon;
