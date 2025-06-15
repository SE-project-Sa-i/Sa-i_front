import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import SignIn from "./Pages/SignIn";
import Signup from "./Pages/Signup";
import Welcome from "./Pages/Welcome";
import UserSetting from "./Pages/UserSetting";
import DeleteAccount from "./Pages/DeleteAccount";
import Memory from "./Pages/Memory";
import MainScreen from "./Pages/MainScreen";
import CategoryCreateComplete from "./Pages/CategoryCreateComplete";
import NodeCreateComplete_1 from "./Pages/NodeCreateComplete_1";
import NodeCreateComplete_2 from "./Pages/NodeCreateComplete_2";
import CategoryList from "./Pages/Category";
import PeopleList from "./Pages/PeopleList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Welcome" element={<Welcome />} />
      <Route path="/usersetting" element={<UserSetting />} />
      <Route path="/DeleteAccount" element={<DeleteAccount />} />
      <Route path="/MainScreen" element={<MainScreen />} />
      <Route path="/category-complete" element={<CategoryCreateComplete />} />
      <Route path="/node-complete" element={<NodeCreateComplete_1 />} />
      <Route
        path="/node-complete-favorite"
        element={<NodeCreateComplete_2 />}
      />
      <Route path="/categoryList" element={<CategoryList />} />
      <Route path="/peopleList" element={<PeopleList />} />
      <Route path="/userSetting" element={<UserSetting />} />
      <Route path="/Memory/:personId?" element={<Memory />} />
      <Route path="/Main" element={<MainScreen />} />{" "}
      {/* soobin 브랜치 내용 포함 */}
    </Routes>
  );
}

export default App;
