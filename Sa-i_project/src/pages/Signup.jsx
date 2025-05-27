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
    /* 비동기 API 요청 예시...?
  const checkIdExists = async (id) => {
  const res = await fetch(`/api/check-id?userId=${id}`);
  const data = await res.json();
  return data.exists; // true면 중복
  };
    */

    // 예시: 이미 존재하는 ID 목록 (실제로는 API 요청) - 테스트용입니다.
    const existingIDs = ["user1", "admin", "test123"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 기본적인 이메일 형식 정규식

    // 회원가입 유효성 검사 처리
    // 이름 - 한 글자 이상 작성
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    // 이메일 - 한 글자 이상 작성
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    // 이메일 - 이메일 형식 검사
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: user@example.com)");
      return;
    }

    // ID - 한 글자 이상 작성
    if (!id.trim()) {
      alert("ID를 입력해주세요.");
      return;
    }
    // ID - 중복 확인 -----------------------------------------------> DB랑 연동 필요한 부분
    if (existingIDs.includes(id.trim())) {
      alert("이미 존재하는 ID입니다. 다른 ID를 입력해주세요.");
      return;
    }
    /* const exists = await checkIdExists(id);
    if (exists) {
    alert("이미 존재하는 ID입니다.");
    return;
    } */

    // 비밀번호 - 일치 확인
    if (password !== password_check) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 유효성 모두 통과한 경우
    console.log("회원가입 요청:", {
      name,
      email,
      id,
      password,
      password_check,
    });

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
