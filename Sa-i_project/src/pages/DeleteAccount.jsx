import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteAccount.css";

function DeleteAccount() {
  const [password, setPasswordchk] = useState("");

  const navigate = useNavigate();
  const checkpwd = (e) => {
    e.preventDefault();
    console.log("비밀번호 입력:", { password });

    //navigate("/SignIn"); // 클릭 시 "/signin" 페이지로 이동
  };

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
