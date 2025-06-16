import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../apis/user";
import "./DeleteAccount.css";

function DeleteAccount() {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    // 확인 모달 표시
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteUser();

      if (result.resultType === "SUCCESS") {
        alert("계정삭제가 완료되었습니다.");
        // 로컬 스토리지 정리
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/", { replace: true });
      } else {
        alert(result.error?.reason || "계정 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("계정 삭제 실패:", error);

      if (error.response?.status === 401) {
        alert("인증에 실패했습니다. 다시 로그인해주세요.");
        navigate("/");
      } else if (error.response?.data?.error?.reason) {
        alert(error.response.data.error.reason);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  return (
    <>
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

        <div className="delete-actions">
          <button
            onClick={handleDeleteClick}
            className="del-btn"
            disabled={isDeleting}
          >
            {isDeleting ? "처리중..." : "Delete Account"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="cancel-main-btn"
            disabled={isDeleting}
          >
            취소
          </button>
        </div>
      </div>

      {/* 확인 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>계정 삭제 확인</h3>
            <p>정말로 계정을 삭제하시겠습니까?</p>
            <p className="warning-text">이 작업은 되돌릴 수 없습니다.</p>
            <div className="modal-buttons">
              <button
                onClick={cancelDelete}
                className="modal-btn cancel-btn"
                disabled={isDeleting}
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="modal-btn delete-btn"
                disabled={isDeleting}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteAccount;
