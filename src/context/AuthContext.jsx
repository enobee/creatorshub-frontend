import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) {
      api
        .get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("authUser", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          setToken(null);
          setUser(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        });
    }
  }, [token]);

  const login = (newToken, userInfo) => {
    setToken(newToken);
    setUser(userInfo);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(userInfo));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
