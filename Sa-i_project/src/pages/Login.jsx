import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, password });

    navigate("/SignIn"); // 클릭 시 "/signin" 페이지로 이동
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("회원가입 시도:");

    navigate("/Signup"); // 클릭 시 "/Signup" 페이지로 이동
  };

  return (
    <div className="page-center-col">
      <div className="comment">
        <h1>Sa:i</h1>
      </div>
      <div className="login-wrapper">
        <div className="login-header">
          <h2>Login</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-button-row">
            <div className="input-fields">
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="signin-btn">
              Sign in
            </button>
          </div>
          <div className="signup-button-wrap">
            <button className="signup-btn" onClick={handleSignup}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
