import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import UserSetting from "./pages/UserSetting";
import DeleteAccount from "./pages/DeleteAccount";
import Memory from "./pages/Memory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/usersetting" element={<UserSetting />} />
      <Route path="/DeleteAccount" element={<DeleteAccount />} />
      <Route
        path="/Memory"
        element={
          <Memory
            userName="김예서"
            registerDate="2025/05/02"
            profileImgUrl={null}
            emotionLevel={75}
            notes={[
              "소프트웨어공학 강의에서 팀플",
              "팀 회의하며 친해짐",
              "협업과 채팅 즐거웠음",
            ]}
            timeline={["3월 첫 회의", "4월 발표 준비", "5월 발표 마무리"]}
            isEditMode={true}
          />
        }
      />
    </Routes>
  );
}

export default App;
