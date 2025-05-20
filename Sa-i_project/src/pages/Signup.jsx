import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password_check, setPasswordCheck] = useState("");

  const navigate = useNavigate();
  const handleSignup = (e) => {
    e.preventDefault();
    console.log("회원가입 요청:", {
      name,
      email,
      id,
      password,
      password_check,
    });

    if (password !== password_check) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    navigate("/welcome"); // 클릭 시 "/Welcome" 페이지로 이동
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-header">
        <h2>Sign Up</h2>
      </div>

      <form className="signup-form" onSubmit={handleSignup}>
        <div className="input-button-row">
          <div className="input-fields">
            <input
              type="text"
              placeholder="Name" // 입력칸에 흐리게 보이는 문구
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <input
              type="password"
              placeholder="Password Check"
              value={password_check}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
        </div>
        <div className="signup-button-wrap">
          <button type="submit" className="signup-btn">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
