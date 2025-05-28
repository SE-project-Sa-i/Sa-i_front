import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function SignIn() {
  const navigate = useNavigate();
  const backtoLogIn = (e) => {
    e.preventDefault();
    console.log("1초 뒤 메인 페이지로 넘어감");

    navigate("/"); // 클릭 시 "/" == login 페이지로 이동 
  };

  const gotoMain = (e) => {
    e.preventDefault();
    console.log("1초 뒤 메인 페이지로 넘어감");

    setTimeout(() => {
      navigate("/MainScreen");
    }, 1000); 
  };

  return (
    <div className="page-center" onClick={gotoMain}>
      <div className="wrapper">
        <div className="comment">
          <h3>Login Successful!</h3>
        </div>
        <div className="comment">
          <h2>Welcome to</h2>
        </div>
        <div className="comment">
          <h1>Sa:i</h1>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
