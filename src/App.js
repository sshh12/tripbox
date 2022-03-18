import "./App.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { Box } from "rebass";
import { AppEnv, useAppEnv } from "./env";
import Login from "./views/Login";
import TripsView from "./views/TripsView";
import TripView from "./views/TripView";
import TripAdd from "./views/TripAdd";

const App = () => {
  return (
    <AppEnv>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </AppEnv>
  );
};

const Router = () => {
  const path = window.location.pathname.substring(1).split("/");
  const ROUTES = {
    "": TripsView,
    trips: TripView,
    add_to_trip: TripAdd,
  };
  const { hasCtx, user } = useAppEnv();
  if (!hasCtx) {
    return <Box>Loading...</Box>;
  } else if (!user) {
    return <Login />;
  } else {
    const Page = ROUTES[path[0]];
    return <Page path={path} />;
  }
};

export default App;
