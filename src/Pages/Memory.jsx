import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { GiRoundStar } from "react-icons/gi";
import { CircleUserRound } from "lucide-react";
import { getPersonInfo } from "../apis/person";
import "./Memory.css";

function Memory() {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personData, setPersonData] = useState(null);
  const [newMemory, setNewMemory] = useState("");

  const navigate = useNavigate();
  const { personId } = useParams(); // URL에서 personId 가져오기

  // API에서 받은 데이터 기반 상태들
  const [clicked, setClicked] = useState(false);
  const [memories, setMemories] = useState([]);
  const [extraInfos, setExtraInfos] = useState([]);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        const response = await getPersonInfo(personId || 1); // personId가 없으면 기본값 1 사용

        if (response.resultType === "SUCCESS") {
          const data = response.success;
          setPersonData(data);
          setClicked(!!data.is_favorite);
          setMemories(data.memories || []);
          setExtraInfos(data.extraInfos || []);
        } else {
          setError(
            response.error?.reason || "데이터를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("Person data fetch error:", err);
        setError("서버와 연결할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [personId]);

  const toggleEditMode = () => setEditMode(!editMode);

  const addMemory = async () => {
    if (newMemory.trim()) {
      // 실제로는 API 호출을 해야 하지만, 지금은 로컬 상태만 업데이트
      const newMemoryItem = {
        id: Date.now(),
        content: newMemory.trim(),
        registeredAt: new Date().toISOString(),
      };
      setMemories([...memories, newMemoryItem]);
      setNewMemory("");
    }
  };

  const handleStar = () => {
    setClicked(!clicked);
    // 실제로는 즐겨찾기 API 호출 필요
  };

  const handleReturn = (e) => {
    e.preventDefault();
    navigate("/MainScreen");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, "/")
      .replace(/ /g, "");
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
      {/* 상단 헤더 */}
      <div className="memory-header-new">
        <div className="header-content">
          <h1 className="memory-title">
            Memory with <span className="user-name">{personData.name}</span>
          </h1>
          <div className="registration-date">
            Registered {formatDate(personData.created_at)}
          </div>
        </div>
        <button className="home-button" onClick={handleReturn}>
          <AiFillHome size={24} />
        </button>
      </div>

      {/* 메인 컨테이너 */}
      <div className="memory-main-container">
        {/* 왼쪽 패널 */}
        <div className="left-section">
          {/* 즐겨찾기 별 */}
          <div className="star-container">
            <button
              className={`star-button ${clicked ? "clicked" : ""}`}
              onClick={handleStar}
            >
              <GiRoundStar size={32} />
            </button>
            <span className="heart-percentage">
              {Math.round((personData.likeability / 5) * 100)}%
            </span>
          </div>

          {/* 프로필 이미지 */}
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

          {/* 추가 정보들 */}
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

        {/* 오른쪽 섹션 */}
        <div className="right-section">
          {/* 카테고리 정보 */}
          <div className="category-header">
            <span className="category-path">{personData.allPath}</span>
            <div className="action-buttons">
              <button className="edit-icon" onClick={toggleEditMode}>
                <GoPencil size={20} />
              </button>
              <button className="check-icon">✓</button>
            </div>
          </div>

          {/* 소개 및 노트 섹션 */}
          <div className="content-section">
            <div className="section-title">
              {personData.introduction || "소개"}
            </div>

            <div className="notes-section">
              <div className="notes-label">Note:</div>
              <div className="notes-content">
                <div className="note-item">{personData.note}</div>
              </div>
            </div>
          </div>

          {/* Memory Timeline */}
          <div className="timeline-section">
            <div className="timeline-header">
              <span className="timeline-title">Memory Timeline</span>
              <span className="timeline-date">
                Registered {formatDate(personData.created_at)}
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
