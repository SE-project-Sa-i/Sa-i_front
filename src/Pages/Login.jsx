import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { postSignIn } from "../apis/auth"; // API 함수 import
import "./Login.css";

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // 입력값 변경 시 에러 메시지 초기화
  const handleIdChange = (e) => {
    setId(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 에러 메시지 초기화

    // 클라이언트 사이드 유효성 검사
    if (!id.trim()) {
      setErrorMessage("ID를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await postSignIn({
        service_id: id.trim(),
        password: password.trim(),
      });

      console.log("API 응답 전체:", result); // 디버깅용

      // 성공 케이스 - 매우 엄격한 조건 확인
      if (
        result &&
        result.resultType === "SUCCESS" &&
        result.success &&
        result.success.token &&
        result.success.user
      ) {
        console.log("로그인 성공! 토큰 저장 및 페이지 이동");
        localStorage.setItem("token", result.success.token);
        localStorage.setItem("userId", result.success.user.id);
        console.log("로그인 성공 사용자:", result.success.user);
        setIsLoading(false);

        // 성공 시에만 페이지 이동
        navigate("/SignIn");
        return;
      }

      // 실패 케이스 처리 - axios 인터셉터 리다이렉트 방지
      if (result && result.resultType === "FAIL") {
        console.log("로그인 실패:", result.error);
        setErrorMessage(result.error?.reason || "로그인에 실패했습니다.");
        setIsLoading(false);
        return;
      }

      // 예상치 못한 응답 형식
      console.error("예상치 못한 응답 형식:", result);
      setErrorMessage("알 수 없는 응답 형식입니다.");
      setIsLoading(false);
    } catch (error) {
      console.error("로그인 요청 실패:", error);

      // axios 인터셉터에서 리다이렉트를 방지하기 위해 에러를 잡고 처리
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        console.log("HTTP 에러 상태:", status);
        console.log("에러 응답 데이터:", errorData);

        // 401 에러 등 인증 실패 시에도 여기서 처리하고 리다이렉트 방지
        if (status === 401) {
          setErrorMessage(
            errorData?.error?.reason ||
              errorData?.message ||
              "아이디 또는 비밀번호가 올바르지 않습니다."
          );
        } else if (status === 400) {
          setErrorMessage(
            errorData?.error?.reason ||
              errorData?.message ||
              "잘못된 요청입니다."
          );
        } else if (status === 500) {
          setErrorMessage(
            "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        } else {
          setErrorMessage(
            errorData?.error?.reason ||
              errorData?.message ||
              "로그인에 실패했습니다."
          );
        }
      } else if (error.request) {
        setErrorMessage(
          "서버와 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
        );
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }

      setIsLoading(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/Signup"); // 클릭 시 "/Signup" 페이지로 이동
  };

  // 로그인 버튼 활성화 조건
  const isLoginFormValid = id.trim() && password.trim() && !isLoading;

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
          {/* 에러 메시지 표시 */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="input-button-row">
            <div className="input-fields">
              <input
                type="text"
                placeholder="ID"
                value={id}
                onChange={handleIdChange}
                disabled={isLoading}
                className={errorMessage ? "input-error" : ""}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                className={errorMessage ? "input-error" : ""}
              />
            </div>
            <button
              type="submit"
              className={`signin-btn ${!isLoginFormValid ? "disabled" : ""}`}
              disabled={!isLoginFormValid}
            >
              {isLoading ? "로그인 중..." : "Sign in"}
            </button>
          </div>
          <div className="signup-button-wrap">
            <button
              className="signup-btn"
              onClick={handleSignup}
              disabled={isLoading}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
