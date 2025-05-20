import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import UserSetting from "./pages/UserSetting";
import DeleteAccount from "./pages/DeleteAccount";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/usersetting" element={<UserSetting />} />
      <Route path="/DeleteAccount" element={<DeleteAccount />} />
    </Routes>
  );
}

export default App;
