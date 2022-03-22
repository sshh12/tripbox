import "react-selectize/themes/index.css";
import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import { Box } from "rebass";
import { AppEnv, useAppEnv } from "./env";
import Login from "./views/Login";
import TripList from "./views/TripList";
import TripView from "./views/TripView";
import TripAdd from "./views/TripAdd";
import ItemEdit from "./views/ItemEdit";
import TripInvite from "./views/TripInvite";

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
    return <Box>Loading...</Box>;
  } else if (!user) {
    return <Login />;
  } else {
    return (
      <Routes>
        <Route exact path="/" element={<TripList />}></Route>
        <Route path="/trips/:trip_id" element={<TripView />}></Route>
        <Route path="/add_to_trip/:trip_id" element={<TripAdd />}></Route>
        <Route path="/invite_to_trip/:trip_id" element={<TripInvite />}></Route>
        <Route
          path="/invite_obs_to_trip/:trip_id"
          element={<TripInvite />}
        ></Route>
        <Route
          path="/trips/:trip_id/edit_item/:item_id"
          element={<ItemEdit />}
        ></Route>
      </Routes>
    );
  }
};

export default App;
