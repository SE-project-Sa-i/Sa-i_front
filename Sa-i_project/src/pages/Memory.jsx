import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Memory.css";

function Memory({
  userName = "사용자",
  registerDate = "0000/00/00",
  profileImgUrl = null,
  emotionLevel = 75,
  notes = [],
  timeline = [],
  userInfo = {},
  isEditMode = false,
}) {
  const [editMode, setEditMode] = useState(isEditMode);
  const [timelineItems, setTimelineItems] = useState(timeline);
  const [noteItems, setNoteItems] = useState(notes);
  const [profileImage, setProfileImage] = useState(profileImgUrl);
  const [regDate, setRegDate] = useState(registerDate);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const addTimelineItem = () => {
    const newItem = prompt("추가할 타임라인 항목을 입력하세요:");
    if (newItem) {
      setTimelineItems([...timelineItems, newItem]);
    }
  };
  const editNotes = () => {
    const newNotes = prompt(
      "노트를 \\n으로 구분하여 입력하세요:",
      noteItems.join("\n")
    );
    if (newNotes) {
      setNoteItems(newNotes.split("\n"));
    }
  };

  const changeRegisterDate = () => {
    const newDate = prompt("새 등록일을 입력하세요 (YYYY/MM/DD):", regDate);
    if (newDate) {
      setRegDate(newDate);
    }
  };

  return (
    <div className="memory-wrapper">
      <header className="memory-header">
        <h1>
          <span className="italic">Memory with</span> {userName}
        </h1>
        <div className="header-right">
          <span className="date">Registered {regDate}</span>
          <button className="edit-icon" onClick={() => setEditMode(!editMode)}>
            🖋
          </button>
        </div>
      </header>

      <div className="memory-body">
        {/* 왼쪽 */}
        <div className="memory-left">
          <div className="profile">
            {profileImgUrl ? (
              <img src={profileImgUrl} alt="profile" />
            ) : (
              <div className="profile-placeholder">Add Photo</div>
            )}
          </div>
          <div className="emotion-status">❤️ {emotionLevel}%</div>
          {notes.map((note, idx) => (
            <div key={idx} className="note">
              {note}
            </div>
          ))}
          {userInfo && (
            <div className="extra-info">
              {userInfo.instagram && (
                <div className="info-item">
                  <strong>Instagram:</strong> {userInfo.instagram}
                </div>
              )}
              {userInfo.birthday && (
                <div className="info-item">
                  <strong>Birthday:</strong> {userInfo.birthday}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽 */}
        <div className="memory-right">
          <div className="memory-path">
            University &gt; Team Project &gt; {userName}
          </div>
          <div className="timeline-section">
            <div className="timeline-header">Memory Timeline</div>
            <div className="timeline-list">
              {timeline.map((item, i) => (
                <div key={i} className="timeline-item">
                  {item}
                </div>
              ))}
            </div>
            <button className="add-timeline" onClick={addTimelineItem}>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Memory;
