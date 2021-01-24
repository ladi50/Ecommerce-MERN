import { useCallback, useEffect, useState } from "react";

let loginOver;

export const useAuth = () => {
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [token, setToken] = useState();
  const [expiration, setExpiration] = useState();

  const login = useCallback((userId, username, token, expiration) => {
    const expirationDate =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        username,
        token,
        expirationDate: expiration || expirationDate.toISOString()
      })
    );

    setUsername(username);
    setUserId(userId);
    setToken(token);
    setExpiration(expirationDate);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (
      userData &&
      userData.token &&
      new Date(userData.expirationDate) > new Date()
    ) {
      login(
        userData.userId,
        userData.username,
        userData.token,
        new Date(userData.expirationDate)
      );
    }
  }, [login]);

  const logout = useCallback(() => {
    setExpiration(null);
    setToken(null);
    setUserId(null);
    setUsername(null);

    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expiration) {
      const timeout = expiration.getTime() - new Date().getTime();

      loginOver = setTimeout(logout, timeout);
    } else {
      clearTimeout(loginOver);
    }
  }, [token, expiration, logout]);

  return { login, logout, token, userId, username };
};
