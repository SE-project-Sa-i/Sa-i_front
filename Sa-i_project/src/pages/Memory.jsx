import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { GiRoundStar } from "react-icons/gi";
import "./Memory.css";

function Memory() {
  const [editMode, setEditMode] = useState(false);
  const [profileNodes, setProfileNodes] = useState([]);
  const [heart, setHeartLevel] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [clicked, setClicked] = useState(false);
  const toggleEditMode = () => setEditMode(!editMode);

  const navigate = useNavigate();

  const userName = "김예서";
  const regDate = "2025/05/02";
  // ... 나머지 코드

  const addProfileNode = () => {
    const label = prompt("카테고리(예: Instagram, Birthday 등)를 입력하세요 :");
    const value = prompt("내용을 입력하세요 :");
    if (label && value) {
      setProfileNodes([...profileNodes, { label, value }]);
    }
  };

  const addHeart = () => {
    const input = prompt("호감도를 입력하세요 (0~100):");
    if (input !== null && !isNaN(input)) {
      const level = Math.max(0, Math.min(100, parseInt(input))); // 0~100 제한
      setHeartLevel(level);
    }
  };

  const addTimelineItem = () => {
    const newItem = prompt("추억을 입력하세요:");
    if (newItem) setTimelineItems([...timelineItems, newItem]);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleStar = () => {
    setClicked(!clicked); // 클릭 상태 토글
    // navigate(-1) 같은 기능이 있다면 여기에 추가
  };

  const handleReturn = (e) => {
    e.preventDefault();
    navigate("/Signup"); // 클릭 시 "/Signup" 페이지로 이동ㅍ ------------ > 메인 페이지로 연결
  };

  return (
    <>
      <div className="return-button-wrap">
        <button className="return-btn" onClick={handleReturn}>
          <AiFillHome />
        </button>
      </div>
      <div className="memory-wrapper">
        <header className="memory-header">
          <h1>
            <span className="italic">Memory with</span> {userName}
          </h1>
          <div className="header-right">
            <span className="date">Registered {regDate}</span>
          </div>
        </header>
      </div>

      <div className="memory-container">
        <div className="left-panel">
          <button
            className={`Star ${clicked ? "clicked" : ""}`}
            onClick={handleStar}
          >
            <GiRoundStar />
          </button>

          <div className="heart-wrapper">
            <span className="heart-text">
              {heart !== null ? `${heart}%❤️` : "-- %"}
            </span>
            {editMode && (
              <button className="heart-edit-btn" onClick={addHeart}>
                %
              </button>
            )}
          </div>

          <div className="profile-photo">
            {editMode ? (
              <label className="photo-upload-label">
                {photo ? (
                  <img src={photo} alt="profile" className="profile-image" />
                ) : (
                  "Add Photo"
                )}
                <input
                  type="file"
                  onChange={handlePhotoUpload}
                  className="photo-input"
                />
              </label>
            ) : (
              photo && (
                <img src={photo} alt="profile" className="profile-image" />
              )
            )}
          </div>

          <div className="profile-info-list">
            {profileNodes.map((node, index) => (
              <div key={index} className="info-row">
                <div className="info-label">{node.label}</div>
                <div className="info-value">{node.value}</div>
              </div>
            ))}
          </div>

          {editMode && (
            <button className="add-profile-button" onClick={addProfileNode}>
              +
            </button>
          )}
        </div>

        <div className="right-panel">
          <div className="location_path">
            University - Term Project - 김예서
          </div>
          <div className="header">
            <h2>소공 팀플에서 만남</h2>
            <button className="edit-button" onClick={toggleEditMode}>
              <GoPencil />
            </button>
          </div>

          <div className="note">
            <p>Note:</p>
            <ul>
              <li>소프트웨어공학 2과제팀</li>
              <li>소공 팀플에서의 학생</li>
            </ul>
          </div>

          <div className="timeline">
            <h3>Memory Timeline</h3>
            <ul>
              {timelineItems.map((item, index) => (
                <li key={index} className="timeline-item">
                  {item}
                </li>
              ))}
            </ul>
            {editMode && (
              <button className="add-button" onClick={addTimelineItem}>
                +
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Memory;
