import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Welcome" element={<Welcome />} />
    </Routes>
  );
}

export default App;
