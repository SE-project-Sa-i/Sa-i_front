import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";

function DeleteAccount() {
  const [password, setPasswordchk] = useState("");

  const navigate = useNavigate();
  const checkpwd = (e) => {
    e.preventDefault();

    // test 비밀번호
    const actualPassword = "test"; // 실제 비밀번호 -----------> API

    console.log("비밀번호 입력:", { password });

    if (password === actualPassword) {
      alert("계정삭제가 완료되었습니다.");
      navigate("/", { replace: true }); // 삭제 후 LogIn Page로 이동
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  /* 
  서버 연동시...
  const checkpwd = async (e) => {
  e.preventDefault();

  const res = await fetch("/api/delete-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const result = await res.json();

  if (result.success) {
    alert("계정삭제가 완료되었습니다.");
    navigate("/SignIn");
  } else {
    alert("비밀번호가 일치하지 않습니다.");
  }
}; */

  return (
    <div className="page-center-col">
      <div className="justcomment">
        Are you certain you wish to delete your account?
      </div>
      <div className="justcomment">
        Your personal information and usage history will all be securely
        deleted.
      </div>
      <div className="warncomment">
        Keep in mind that account deletion is irreversible.
      </div>

      <form onSubmit={checkpwd}>
        <div className="input-button-row">
          <div className="delete-form">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPasswordchk(e.target.value)}
            />
          </div>
          <div className="del-button-wrap">
            <button type="submit" className="del-btn">
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DeleteAccount;
