import "./App.css";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { Box } from "rebass";
import { AppEnv, useAppEnv } from "./env";
import Login from "./views/Login";

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
  const path = window.location.pathname;
  const { hasCtx, user } = useAppEnv();
  if (!hasCtx) {
    return <Box>Loading...</Box>;
  } else if (path === "/" && !user) {
    return <Login />;
  } else {
    return <Box>{JSON.stringify(user)}</Box>;
  }
};

export default App;
