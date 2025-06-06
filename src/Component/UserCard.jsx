import React, { useState, useEffect } from 'react';
import { Heart, Star, CircleUserRound } from 'lucide-react';
// UserCard 디자인 불러오기
import { useNavigate } from 'react-router-dom';
import './UserCard.css';

// visible: 보여줄지 여부
// onClose: 팝업 닫기
// x, y: 클릭 위치
// nodeData: 선택된 노드 데이터
// onNodeUpdate: 데이터 변경 시, MainScreen에 알려줌
export default function UserCard({ visible, onClose, x, y, nodeData, onNodeUpdate }) {
  // 클릭된 하트 갯수
  const [heartCount, setHeartCount] = useState(0);
  // 즐겨찾기 여부
  const [starFilled, setStarFilled] = useState(false);
  // One line Introduction
  const [introText, setIntroText] = useState('');
  // Note.
  const [noteText, setNoteText] = useState('');
  // 등록일 (자동 등록)
  const [registeredDate, setRegisteredDate] = useState('');
  // 사용자 이름 (nodeData.name 기준)
  const [displayName, setDisplayName] = useState('');
  //이동 함수 
  const navigate = useNavigate();

  // 데이터 변경 시, MainScreen에 알려줌
  const handleDataChange = (field, value) => {
    if (nodeData && onNodeUpdate) {
      const mappedField = {
        intro: 'introduction',
        note: 'note',
        favorites: 'isFavorite',
        heartCount: 'heartCount',
        likeability: 'likeability',
        date: 'date'
      }[field] || field;
      const updatedData = { ...nodeData, [mappedField]: value };
      // heartCount → likeability 동기화
      if (field === 'heartCount') {
        const newLikeability = Math.round((value / 3) * 5); // 0~3 → 0~5
        updatedData.likeability = newLikeability;
      }
      onNodeUpdate(updatedData);
      const payload = {
        introduction: updatedData.introduction,
        note: updatedData.note,
        likeability: updatedData.likeability,
        name: updatedData.name,
      };
      updatePersonInfo(payload);
    }
  };

  const handleAddFavorite = async () => {
    // API 연결 (즐겨찾기 추가)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/persons/${nodeData.originalId}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.resultType === "SUCCESS") {
        setStarFilled(true); // UI 반영
        handleDataChange("favorites", true); // MainScreen에도 반영
      } else {
        alert("즐겨찾기 추가 실패");
      }
    } catch (err) {
      console.error("즐겨찾기 추가 중 오류", err);
    }
  };

  const updatePersonInfo = async (updatedData) => {
    // API 연결 (노드 팝업 수정)
    try {
      const response = await fetch(`http://localhost:3000/api/v1/persons/${nodeData.originalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.resultType === "SUCCESS") {
        console.log("인물 정보 수정 성공:", data.success);
      } else {
        console.error("인물 수정 실패:", data.error?.reason);
      }
    } catch (err) {
      console.error("인물 정보 수정 중 오류 발생", err);
    }
  };

  useEffect(() => {
    // API 연결 (노드 팝업 조회)
    if (nodeData && nodeData.originalId) {
      fetch(`http://localhost:3000/api/v1/persons/${nodeData.originalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("백엔드 응답:", data);
          if (data.resultType === "SUCCESS") {
            const person = data.success;
            setStarFilled(Boolean(data.success.isFavorite));
            setRegisteredDate(person.createdAt?.split("T")[0] || "");

          }
        })
        .catch((err) => {
          console.error("즐겨찾기 여부 조회 실패", err);
        });
    }
  }, [nodeData]);

  useEffect(() => { // nodeData 변경 시, UserCard 업데이트
    if (nodeData) {
      setDisplayName(nodeData.name || ''); // 사용자 이름
      setIntroText(nodeData.introduction || ''); // One line Introduction
      setNoteText(nodeData.note || ''); // Note.
      setStarFilled(Boolean(nodeData.isFavorite)); // 즐겨찾기
      // likeability → heartCount
      const mappedHeartCount = Math.round((nodeData.likeability || 0) / 5 * 3);
      setHeartCount(mappedHeartCount);
      if (nodeData.date) { // 등록일 자동 생성
        setRegisteredDate(nodeData.date);
      }
      // else {
      //  const now = new Date();
      //  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      //  const dateStr = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      //  setRegisteredDate(dateStr);
      //  handleDataChange('date', dateStr); // MainScreen에 알려줌
      //}
    } else { // nodeData 없어 초기화
      setDisplayName('');
      setIntroText('');
      setNoteText('');
      setStarFilled(false);
    }
  }, [nodeData]);

  if (!visible) return null; // not visible이면 null (화면 표시 X)

  return (
    // 클릭 위치 기준 절대 위치
    <div className="user-card" style={{ top: y + 'px', left: x + 'px' }}>
      <div className="card-header">
        <div className="card-name-heart">
          <div className="card-name">{displayName}</div>
          <div className="heart-group">
            {[0, 1, 2].map((i) => (
              <Heart
                key={i}
                onClick={() => {
                  const newCount = i === heartCount - 1 ? i : i + 1;
                  setHeartCount(newCount);
                  handleDataChange('heartCount', newCount)
                  const newLikeability = Math.round(newCount / 3 * 5);
                  handleDataChange('likeability', newLikeability);
                }}
                fill={i < heartCount ? '#CE5F5C' : 'none'}
                stroke="#CE5F5C"
                size={30}
              />
            ))}
            <span className="heart-percent">{heartCount * 33}%</span>
          </div>
        </div>
        {/* 읽기 전용 */}
        <input type="text" value={registeredDate} readOnly placeholder="Auto date" className="card-date" />
      </div>

      <div className="card-body">
        <div className="profile-section">
          <div className="profile-image">
            <CircleUserRound size={140} color="white" />
          </div>
          <div className="star-icon" onClick={() => { // 클릭 시, MainScreen에 알려줌
            if (!starFilled) {
              handleAddFavorite();
            } else {
              alert("이미 즐겨찾기 추가됨");
            }
          }}>
            <Star size={30} color="#FCBA2A" fill={starFilled ? "#FCBA2A" : "none"} />
          </div>
        </div>
        <div className="intro-note">
          <div className="intro-box">
            <div className="intro-label">&lt; One line Introduction &gt;</div>
            <input
              type="text"
              value={introText}
              onChange={(e) => {
                setIntroText(e.target.value);
                handleDataChange('intro', e.target.value);
              }}
              placeholder="Enter introduction .."
              className="intro-input"
            />
          </div>
          <div className="note-box">
            <div className="note-label">Note.</div>
            <textarea
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                handleDataChange('note', e.target.value);
              }}
              rows={3}
              placeholder="Enter Note .."
              className="note-textarea"
            />
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button className="view-button" onClick={() => navigate("/Memory")}>View More Memories</button>
      </div>
    </div>
  );
} 