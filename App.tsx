import React from "react";
import { StatusBar } from "react-native";
import Login from "./views/Login";

export default function App(): JSX.Element {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Login />
    </>
  );
}