import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppEnv, useAppEnv } from "./app/env";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Login from "./views/Login";
import Home from "./views/Home";
import TripView from "./views/TripView";

const theme = createTheme();

const App = () => {
  return (
    <AppEnv>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </AppEnv>
  );
};

const Router = () => {
  const { hasCtx, user } = useAppEnv();
  if (!hasCtx) {
    return (
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
    );
  } else if (!user) {
    return <Login />;
  } else {
    return (
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="/trips/:trip_id" element={<TripView />}></Route>
        {/* <Route path="/trips/:trip_id" element={<TripView />}></Route>
        <Route path="/add_to_trip/:trip_id" element={<TripAdd />}></Route>
        <Route path="/edit_trip/:trip_id" element={<TripEdit />}></Route>
        <Route path="/invite_to_trip/:trip_id" element={<TripInvite />}></Route>
        <Route
          path="/invite_obs_to_trip/:trip_id"
          element={<TripInvite />}
        ></Route>
        <Route
          path="/trips/:trip_id/edit_item/:item_id"
          element={<ItemEdit />}
        ></Route> */}
      </Routes>
    );
  }
};

export default App;
