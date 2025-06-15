import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { postSignIn } from "../apis/auth"; // API 함수 import
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 로그인 페이지에서 뒤로 가기 비활성화 시키기
  useEffect(() => {
    const handlePopState = () => {
      // 뒤로 가기 눌렀을 때도 다시 로그인 페이지로 고정시킴
      window.history.pushState(null, "", window.location.href);
    };
    // 처음 로딩 시에 history 초기화
    window.history.pushState(null, "", window.location.href); // 초기 상태
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!id) {
      alert("ID를 입력해주세요.");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const result = await postSignIn({
        service_id: id,
        password: password,
      });

      if (result.resultType === "SUCCESS") {
        localStorage.setItem("token", result.success.token);
        localStorage.setItem("userId", result.success.user.id);
        console.log("로그인 성공 사용자:", result.success.user);
        navigate("/SignIn");
      } else if (result.resultType === "FAIL") {
        alert(result.error.reason || "로그인에 실패했습니다.");
      } else {
        alert("알 수 없는 응답 형식입니다.");
      }
    } catch (error) {
      console.error("로그인 요청 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

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
