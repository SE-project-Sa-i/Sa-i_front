import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserSetting.css";

function UserSetting() {
  const navigate = useNavigate();
  const delaccount = (e) => {
    e.preventDefault();
    console.log("계정탈퇴 시도");

    navigate("/DeleteAccount"); // 클릭 시 "/deleteaccount" 페이지로 이동
  };

  return (
    <div className="page-center-col">
      <div className="comment">User Setting</div>
      <table className="info-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>Kim Yeseo</td>
          </tr>
          <tr>
            <th>Registration Date</th>
            <td>2025/05/21</td>
          </tr>
          <tr>
            <th>e-mail</th>
            <td>baek126@gachon.ac.kr</td>
          </tr>
        </tbody>
      </table>
      <div>Do you want to delete your account?</div>
      <div className="del-button-wrap">
        <button className="del-btn1" onClick={delaccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default UserSetting;
