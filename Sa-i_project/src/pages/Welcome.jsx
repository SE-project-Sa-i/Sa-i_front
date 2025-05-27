import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const backtoLogIn = (e) => {
    e.preventDefault();
    console.log("login페이지로 돌아감");

    navigate("/"); // 클릭 시 "/" == login 페이지로 이동
  };

  return (
    <div className="page-center">
      <div className="wrapper">
        <div className="comment">
          <h2>Welcome to Join us!</h2>
        </div>

        <div className="back-button-wrap">
          <button className="signup-btn" onClick={backtoLogIn}>
            Back to Log In Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
