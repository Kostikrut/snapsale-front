import { createContext, useCallback, useEffect, useState } from "react";

import { config } from "../config";
import renderToast from "../utils/renderToast";

export const LoginContext = createContext();

const apiUrl = config.API_URL;

const getUserData = async (token) => {
  try {
    const res = await fetch(`${apiUrl}/api/v1/users/verifyStoredToken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const userData = await res.json();

    return userData;
  } catch (err) {
    console.error(err.message, "🔴");
    return null;
  }
};

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bearerToken, setBearerToken] = useState("");
  const [userData, setUserData] = useState({});

  const updateUserLoggedState = useCallback((userData) => {
    if (!userData || userData.expiresIn < Date.now() || !userData.token)
      return logOut();

    localStorage.setItem("loggedUserData", JSON.stringify(userData));
    setBearerToken(userData.token);
    setUserData(userData.data.user);
    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedUserData = localStorage.getItem("loggedUserData");
      if (!loggedUserData) return;

      const data = JSON.parse(loggedUserData);
      if (!data.token) return logOut();

      const userData = await getUserData(data.token);

      if (!userData) return logOut();

      updateUserLoggedState(userData);
    };

    fetchUserData();
  }, [updateUserLoggedState]);

  const logIn = async (email, password) => {
    if (!email && !password) return;

    try {
      const res = await fetch(`${apiUrl}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok)
        throw (
          data.message || "Login failed, check your credentials and try again."
        );

      updateUserLoggedState(data);
    } catch (err) {
      renderToast(
        "error",
        err || "Listing could not be created, please re-login and try again"
      );
    }
  };

  const signUp = async ({
    fullName,
    password,
    phone,
    email,
    passwordConfirm,
    address,
  }) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          password,
          passwordConfirm,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw (
          data.message || "Signup failed, check your credentials and try again."
        );

      updateUserLoggedState(data);
    } catch (err) {
      renderToast(
        "error",
        err || "Listing could not be created, please re-login and try again"
      );
    }
  };

  const logOut = () => {
    localStorage.removeItem("loggedUserData");

    setBearerToken("");
    setIsLoggedIn(false);
    setUserData({});
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        logIn,
        signUp,
        logOut,
        bearerToken,
        userData,
        updateUserLoggedState,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
