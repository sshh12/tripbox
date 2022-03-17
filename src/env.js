import React, { createContext, useContext, useState, useEffect } from "react";
import API from "./api";

export const AppContext = createContext();

let setKey = (key, value) => {
  localStorage.setItem("tripbox:" + key, JSON.stringify(value));
};

let getKey = (key) => {
  return JSON.parse(localStorage.getItem("tripbox:" + key));
};

export const AppEnv = ({ children }) => {
  let [hasCtx, setHasCtx] = useState(false);
  let [user, _setUser] = useState(getKey("user"));
  let [api, setAPI] = useState({ ...API, refreshKey: 0 });
  let setUser = (user) => {
    setKey("user", user);
    _setUser(user);
  };
  // This will force any components that rely on an API call
  // to retrigger and refresh content.
  let refreshAPI = () => {
    console.log("Refreshing all remote data...");
    setAPI({ ...API, refreshKey: api.refreshKey++ });
  };
  useEffect(() => {
    API.get("/api/context").then(({ user }) => {
      setHasCtx(true);
      if (user) {
        setUser(user);
      }
    });
  }, []);
  return (
    <AppContext.Provider
      value={{
        hasCtx: hasCtx,
        api: api,
        user: user,
        refresh: refreshAPI,
        setKey: setKey,
        getKey: getKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppEnv = () => useContext(AppContext);
