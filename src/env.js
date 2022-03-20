import React, { createContext, useContext, useState, useEffect } from "react";
import API from "./api";

export const AppContext = createContext();

export const AppEnv = ({ children }) => {
  let [hasCtx, setHasCtx] = useState(false);
  let [online, setOnline] = useState(window.navigator.onLine);
  let [api, setAPI] = useState({ ...API, refreshKey: 0 });
  let [user, _setUser] = useState(api.getKey("user"));
  let setUser = (user) => {
    api.setKey("user", user);
    _setUser(user);
  };
  // This will force any components that rely on an API call
  // to retrigger and refresh content.
  let refreshAPI = () => {
    console.log("Refreshing all remote data...");
    setAPI({ ...API, refreshKey: api.refreshKey++ });
  };
  useEffect(() => {
    API.get("/api/context").then(({ data: ctxData }) => {
      setHasCtx(true);
      if (ctxData.user) {
        setUser(ctxData.user);
      }
    });
    window.addEventListener("online", () => setOnline(true));
    window.addEventListener("offline", () => setOnline(false));
  }, []);
  return (
    <AppContext.Provider
      value={{
        hasCtx: hasCtx,
        api: api,
        user: user,
        refresh: refreshAPI,
        online: online,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppEnv = () => useContext(AppContext);
