import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo } from "../apis/user";
import { GoPencil } from "react-icons/go";
import "./UserSetting.css";

function UserSetting() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    registrationDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();

        if (response.resultType === "SUCCESS") {
          const userData = response.success;
          const userInfoData = {
            name: userData.name || "",
            email: userData.email || "",
            registrationDate: userData.createdAt
              ? new Date(userData.createdAt)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "/")
              : "",
          };
          setUserInfo(userInfoData);
          setEditForm({
            name: userData.name || "",
            email: userData.email || "",
          });
        } else {
          setError(
            response.error?.reason || "사용자 정보를 불러올 수 없습니다."
          );
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setError("서버와 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const delaccount = (e) => {
    e.preventDefault();
    navigate("/DeleteAccount");
  };

  const handleEditToggle = () => {
    if (editMode) {
      // 편집 모드 취소 - 원래 값으로 복원
      setEditForm({
        name: userInfo.name,
        email: userInfo.email,
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!editForm.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!editForm.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setUpdating(true);

    try {
      const result = await updateUserInfo({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      });

      if (result.resultType === "SUCCESS") {
        // 성공 시 userInfo 업데이트
        setUserInfo((prev) => ({
          ...prev,
          name: editForm.name.trim(),
          email: editForm.email.trim(),
        }));
        setEditMode(false);
        alert("정보가 성공적으로 수정되었습니다.");
      } else {
        alert(result.error?.reason || "정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("정보 수정 실패:", error);
      if (error.response?.data?.error?.reason) {
        alert(error.response.data.error.reason);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-center-col">
        <div className="comment">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center-col">
        <div className="comment">User Setting</div>
        <div style={{ color: "red", fontSize: "18px", marginBottom: "2rem" }}>
          {error}
        </div>
        <button onClick={() => navigate(-1)} className="del-btn1">
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="page-center-col">
      <div className="comment">User Setting</div>

      {editMode ? (
        // 편집 모드
        <form onSubmit={handleUpdateSubmit} className="edit-form">
          <table className="info-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="edit-input"
                    disabled={updating}
                  />
                </td>
              </tr>
              <tr>
                <th>Registration Date</th>
                <td className="readonly-field">{userInfo.registrationDate}</td>
              </tr>
              <tr>
                <th>e-mail</th>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="edit-input"
                    disabled={updating}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="edit-buttons">
            <button type="submit" className="save-btn" disabled={updating}>
              {updating ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="cancel-btn"
              disabled={updating}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        // 보기 모드
        <>
          <div className="user-info-header">
            <table className="info-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{userInfo.name}</td>
                </tr>
                <tr>
                  <th>Registration Date</th>
                  <td>{userInfo.registrationDate}</td>
                </tr>
                <tr>
                  <th>e-mail</th>
                  <td>{userInfo.email}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={handleEditToggle}
              className="edit-btn"
              title="정보 수정"
            >
              <GoPencil size={24} />
            </button>
          </div>

          <div>Do you want to delete your account?</div>
          <div className="del-button-wrap">
            <button className="del-btn1" onClick={delaccount}>
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserSetting;
