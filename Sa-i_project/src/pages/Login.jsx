import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 테스트 DB -------------------> API 연결
    const fakeUsers = [
      { id: "user1", password: "pass1234" },
      { id: "test", password: "abcd1234" },
      { id: "admin", password: "adminpass" },
    ];

    const user = fakeUsers.find((u) => u.id === id);

    if (!user) {
      alert("ID가 존재하지 않습니다.");
      return;
    }

    if (user.password !== password) {
      alert("비밀번호가 틀립니다.");
      return;
    }

    console.log("로그인 성공:", { id });
    navigate("/SignIn"); // 클릭 시 "/signin" 페이지로 이동
  };

  /* 
  실제 API 코드 예시
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    const result = await response.json();

    if (result.status === "no-id") {
      alert("ID가 존재하지 않습니다.");
    } else if (result.status === "wrong-password") {
      alert("비밀번호가 틀립니다.");
    } else if (result.status === "success") {
      navigate("/SignIn");
    }
  } catch (err) {
    console.error("로그인 요청 실패:", err);
    alert("서버 오류가 발생했습니다.");
  }
};
*/

  const handleSignup = (e) => {
    e.preventDefault();
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
