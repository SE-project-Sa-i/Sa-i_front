import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postSignUp } from "../apis/auth"; // API 함수 import
import "./Signup.css";

function Signup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password_check, setPasswordCheck] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // 이메일 형식 검증 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // 비밀번호 - 입력 확인
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // 비밀번호 - 일치 확인
    if (password !== password_check) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const result = await postSignUp({
        name: name.trim(),
        email: email.trim(),
        service_id: id.trim(),
        password: password,
      });

      if (result.resultType === "SUCCESS") {
        console.log("회원가입 성공:", result);
        navigate("/welcome"); // 성공 시 Welcome 페이지로 이동
      } else if (result.resultType === "FAIL") {
        alert(result.error?.reason || "회원가입에 실패했습니다.");
      } else {
        alert("알 수 없는 응답 형식입니다.");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);

      // 에러 응답이 있는 경우 처리
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.resultType === "FAIL") {
          alert(errorData.error?.reason || "회원가입에 실패했습니다.");
        } else {
          alert("회원가입에 실패했습니다.");
        }
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    }
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
              placeholder="Name"
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
