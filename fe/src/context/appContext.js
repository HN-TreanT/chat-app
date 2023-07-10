import { io } from "socket.io-client";
import React from "react";
import { serverConfig } from "../const";
const username = localStorage.getItem("username");
export const socket1 = io(serverConfig.server, {
  query: {
    username: username,
  },
});
// app context
export const AppContext = React.createContext();
