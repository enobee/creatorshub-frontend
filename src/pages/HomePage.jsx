import React, { useContext } from "react";
import GuestHomePage from "./GuestHomePage";
import LoggedInHomePage from "./LoggedInHomePage";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
  const { token } = useContext(AuthContext);
  const isLoggedIn = Boolean(token);

  return <>{isLoggedIn ? <LoggedInHomePage /> : <GuestHomePage />}</>;
}
