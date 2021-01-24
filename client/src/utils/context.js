import { createContext } from "react";

export const AppContext = createContext({
  userId: null,
  username: null,
  token: null,
  login: () => {},
  logout: () => {}
});
