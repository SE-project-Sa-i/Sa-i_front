import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaHeart, FaCheck } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { GiRoundStar } from "react-icons/gi";
import { CircleUserRound } from "lucide-react";
import {
  getPersonInfo,
  postPersonMemory,
  updatePersonInfo,
  postPersonFavorite,
  deletePersonFavorite,
} from "../apis/person";
import "./Memory.css";

function Memory() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personData, setPersonData] = useState(null);
  const [newMemory, setNewMemory] = useState("");

  const navigate = useNavigate();
  const { personId } = useParams();

  const [isFavorite, setIsFavorite] = useState(false);
  const [memories, setMemories] = useState([]);
  const [extraInfos, setExtraInfos] = useState([]);

  const [editData, setEditData] = useState({
    name: "",
    introduction: "",
    note: "",
    likeability: 0,
  });

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        const response = await getPersonInfo(personId || 1);

        if (response.resultType === "SUCCESS") {
          const data = response.success;

          setPersonData(data);
          setIsFavorite(!!data.is_favorite || !!data.isFavorite);
          setMemories(data.memories || []);
          setExtraInfos(data.extraInfos || []);

          setEditData({
            name: data.name || "",
            introduction: data.introduction || "",
            note: data.note || "",
            likeability: data.likeability || 0,
          });
        } else {
          setError(
            response.error?.reason || "데이터를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/");
          return;
        }
        setError("서버와 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchPersonData();
  }, [personId, navigate]);

  const toggleEditMode = () => {
    if (editMode) {
      setEditData({
        name: personData.name || "",
        introduction: personData.introduction || "",
        note: personData.note || "",
        likeability: personData.likeability || 0,
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      if (!editData.name.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      if (editData.likeability < 0 || editData.likeability > 100) {
        alert("호감도는 0~100 사이의 값이어야 합니다.");
        return;
      }

      const updateData = {
        name: editData.name.trim(),
        introduction: editData.introduction.trim(),
        note: editData.note.trim(),
        likeability: parseInt(editData.likeability),
      };

      const response = await updatePersonInfo(personId, updateData);

      if (response.resultType === "SUCCESS") {
        setPersonData((prev) => ({
          ...prev,
          ...updateData,
        }));

        setEditMode(false);
        alert("정보가 성공적으로 수정되었습니다.");
      } else {
        alert(response.error?.reason || "정보 수정에 실패했습니다.");
      }
    } catch (err) {
      if (err.response?.data?.error?.reason) {
        alert(err.response.data.error.reason);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  const addMemory = async () => {
    if (newMemory.trim()) {
      try {
        const memoryData = {
          content: newMemory.trim(),
        };

        const response = await postPersonMemory(personId, memoryData);

        if (response.resultType === "SUCCESS") {
          const newMemoryItem = {
            id: response.success.id || Date.now(),
            content: newMemory.trim(),
            registeredAt: new Date().toISOString(),
          };
          setMemories((prev) => [...prev, newMemoryItem]);
          setNewMemory("");
          alert("추억이 성공적으로 추가되었습니다.");
        } else {
          alert(response.error?.reason || "추억 추가에 실패했습니다.");
        }
      } catch (err) {
        alert("서버와 연결할 수 없습니다.");
      }
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      setFavoriteLoading(true);

      if (!isFavorite) {
        const response = await postPersonFavorite(personId);

        if (response.resultType === "SUCCESS") {
          setIsFavorite(true);
        } else {
          alert(response.error?.reason || "즐겨찾기 추가에 실패했습니다.");
        }
      } else {
        const response = await deletePersonFavorite(personId);

        if (response.resultType === "SUCCESS") {
          setIsFavorite(false);
        } else {
          alert(response.error?.reason || "즐겨찾기 해제에 실패했습니다.");
        }
      }
    } catch (err) {
      if (err.response?.data?.error?.reason) {
        alert(err.response.data.error.reason);
      } else {
        alert("서버와 연결할 수 없습니다.");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReturn = (e) => {
    e.preventDefault();
    navigate("/MainScreen");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "잘못된 날짜";

      return date
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "/")
        .replace(/ /g, "");
    } catch (error) {
      return "날짜 오류";
    }
  };

  if (loading) {
    return (
      <div className="memory-page">
        <div className="loading-container">
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="memory-page">
        <div className="error-container">
          <div>오류: {error}</div>
          <button onClick={handleReturn}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  if (!personData) {
    return (
      <div className="memory-page">
        <div className="error-container">
          <div>데이터를 찾을 수 없습니다.</div>
          <button onClick={handleReturn}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-page">
      <div className="memory-header-new">
        <div className="header-content">
          <h1 className="memory-title">
            Memory with{" "}
            <span className="user-name">
              {editMode ? editData.name : personData.name || "이름 없음"}
            </span>
          </h1>
          <div className="registration-date">
            Registered{" "}
            {formatDate(personData.createdAt || personData.created_at)}
          </div>
        </div>
        <button className="home-button" onClick={handleReturn}>
          <AiFillHome size={24} />
        </button>
      </div>

      <div className="memory-main-container">
        <div className="left-section">
          <div className="top-indicators">
            <div className="star-container">
              <button
                className={`star-button ${isFavorite ? "clicked" : ""} ${
                  favoriteLoading ? "loading" : ""
                }`}
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                title={
                  favoriteLoading
                    ? "처리 중..."
                    : isFavorite
                    ? "즐겨찾기 해제"
                    : "즐겨찾기 추가"
                }
              >
                <GiRoundStar size={24} />
              </button>
            </div>

            <div className="likeability-container">
              {editMode ? (
                <>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editData.likeability}
                    onChange={(e) =>
                      handleInputChange("likeability", e.target.value)
                    }
                    className="edit-input-inline"
                  />
                  <span>%</span>
                  <FaHeart size={22} color="#CE5F5C" />
                </>
              ) : (
                <>
                  <span className="heart-percentage">
                    {`${editData.likeability || 0}%`}
                  </span>
                  <FaHeart size={22} color="#CE5F5C" />
                </>
              )}
            </div>
          </div>

          <div className="profile-container">
            <div className="profile-circle">
              {personData.image_url ? (
                <img
                  src={personData.image_url}
                  alt={personData.name}
                  className="profile-image-api"
                />
              ) : (
                <CircleUserRound size={120} color="#9BB4A0" />
              )}
            </div>
          </div>

          {extraInfos.length > 0 && (
            <div className="extra-info-section">
              {extraInfos.map((info) => (
                <div key={info.id} className="info-row">
                  <div className="info-label">{info.title}</div>
                  <div className="info-value">{info.info}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="right-section">
          <div className="category-header">
            <span className="category-path">
              {personData.allPath ||
                personData.categoryPath ||
                "카테고리 정보 없음"}
            </span>
            <div className="action-buttons">
              <button
                className="edit-icon"
                onClick={editMode ? handleSaveChanges : toggleEditMode}
                disabled={saving}
              >
                {editMode ? (
                  saving ? (
                    "저장 중..."
                  ) : (
                    <FaCheck size={20} />
                  )
                ) : (
                  <GoPencil size={20} />
                )}
              </button>
              {editMode && (
                <button className="cancel-icon" onClick={toggleEditMode}>
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="content-section">
            <div className="section-title">
              {editMode ? (
                <input
                  type="text"
                  value={editData.introduction}
                  onChange={(e) =>
                    handleInputChange("introduction", e.target.value)
                  }
                  placeholder="소개를 입력하세요"
                  className="edit-input-title"
                />
              ) : (
                editData.introduction || "소개를 추가해주세요"
              )}
            </div>

            <div className="notes-section">
              <div className="notes-label">Note:</div>
              <div className="notes-content">
                {editMode ? (
                  <textarea
                    value={editData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    placeholder="노트를 입력하세요"
                    className="edit-textarea"
                    rows={4}
                  />
                ) : (
                  <div className="note-item">
                    {editData.note || "노트를 추가해주세요"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <div className="timeline-header">
              <span className="timeline-title">Memory Timeline</span>
              <span className="timeline-date">
                Registered{" "}
                {formatDate(personData.createdAt || personData.created_at)}
              </span>
            </div>

            <div className="memories-container">
              {memories.map((memory) => (
                <div key={memory.id} className="memory-item">
                  <div className="memory-content">{memory.content}</div>
                  <div className="memory-date">
                    {formatDate(memory.registeredAt)}
                  </div>
                </div>
              ))}

              {editMode && (
                <div className="add-memory-section">
                  <textarea
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                    placeholder="새로운 추억을 입력하세요..."
                    className="memory-input"
                    rows={3}
                  />
                  <button onClick={addMemory} className="add-memory-btn">
                    추억 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Memory;
