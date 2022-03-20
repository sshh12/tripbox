import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serverWorkerUtil from "./service-worker-util";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serverWorkerUtil.register();
