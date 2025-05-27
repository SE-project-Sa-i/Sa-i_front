import React, { useState } from 'react';
import { ClipboardPlus, UserPlus, SquareX } from 'lucide-react';
// AddPopup 디자인 불러오기
import './AddPopup.css';

// visible: 보여줄지 여부
// onClose: 팝업 닫기
// onCategoryCreated: 카테고리 생성
// onNodeCreated: 노드 생성
// existingCategories: 현재 카테고리 목록
export default function AddPopup({ visible, onClose, onCategoryCreated, onNodeCreated, existingCategories = [] }) {
  const [categoryName, setCategoryName] = useState(''); // 카테고리 이름
  const [categoryError, setCategoryError] = useState(''); // 카테고리 오류
  const [selectedColor, setSelectedColor] = useState('#507060'); // 선택 색상
  const [nodeName, setNodeName] = useState(''); // 노드 이름
  const [nodeIntro, setNodeIntro] = useState(''); // 노드 소개
  const [nodeNote, setNodeNote] = useState(''); // 노드 설명
  const [addToFavorites, setAddToFavorites] = useState(false); // 즐겨찾기
  // 카테고리의 상위 카테고리
  const [selectedCategoryForCategory, setSelectedCategoryForCategory] = useState('');
  // 노드의 카테고리
  const [selectedCategoryForNode, setSelectedCategoryForNode] = useState('');
  // 색상 리스트
  const colors = ['#3C5146', '#507060', '#85A394', '#ACC0B6', '#DDD8C9', '#F2F4E6'];

  // Create New Category 버튼 클릭 시, 카테고리 생성
  const handleCreateCategory = () => {
    const trimmedName = categoryName.trim(); // 이름 앞뒤 공백 제거
    // 빈 이름이면 오류 처리
    if (trimmedName.length === 0) {
      setCategoryError('Please enter at least one character ...');
      return; // 생성 중단
    }
    // 이미 존재하는 이름이면 오류 처리
    if (existingCategories.includes(trimmedName)) {
      setCategoryError('The category already exists ...');
      return; // 생성 중단
    }
    // 생성할 카테고리 데이터
    const categoryData = {
      parentCategory: selectedCategoryForCategory, // 상위 카테고리
      name: categoryName, // 카테고리 이름
      color: selectedColor // 색상 코드
    };
    console.log('Creating category:', categoryData);
    // 카테고리 생성 시, MainScreen에 알려줌
    if (onCategoryCreated) {
      onCategoryCreated(categoryData);
    }
    setCategoryName(''); // 입력 이름 초기화
    setSelectedColor('#3C5146'); // 색상 기본값
    setSelectedCategoryForCategory(''); // 카테고리 선택 초기화
    setCategoryError(''); // 에러 메시지 제거
    onClose(); // 팝업 닫기
  };

  // Create New Node 버튼 클릭 시, 노드 생성
  const handleCreateNode = () => {
    const nodeData = { // 입력값 기반 노드 데이터
      category: selectedCategoryForNode, // 어떤 카테고리
      name: nodeName, // 노드 이름
      intro: nodeIntro, // 노드 소개
      note: nodeNote, // 노드 설명
      favorites: addToFavorites // 즐겨찾기
    };
    console.log('Creating node:', nodeData);
    // 노드 생성 시, MainScreen에 알려줌
    if (onNodeCreated) {
      onNodeCreated(nodeData);
    }
    setNodeName(''); // 입력 이름 초기화
    setNodeIntro(''); // 입력 소개 초기화
    setNodeNote(''); // 입력 설명 초기화
    setAddToFavorites(false); // 즐겨찾기 해제
    setSelectedCategoryForNode(''); // 카테고리 선택 초기화
    onClose(); // 팝업 닫기
  };

  if (!visible) return null; // not visible이면 null (화면 표시 X)

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onClose}> {/* 버튼 클릭 시, onClose() 실행 */}
          <SquareX size={40} color="#607A6D" />
        </button>

        <div className="popup-content">
          <div className="popup-section">
            <div className="popup-title">
              <ClipboardPlus size={30} color="black" />
              <h2>Create New Category</h2>
            </div>
            <select
              className="dropdown"
              value={selectedCategoryForCategory} // 현재 선택된 값
              // 선택 바뀌면 상태 업데이트
              onChange={(e) => setSelectedCategoryForCategory(e.target.value)}
            >
              <option value="">Choose a Category ...</option>
              {existingCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="text-input"
            />
            {categoryError && <div className="error-message">{categoryError}</div>}
            <p className="label">Choose a Color</p>
            <div className="color-picker">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className="color-box"
                  style={{ backgroundColor: color, border: selectedColor === color ? '3px solid black' : '1px solid white' }}
                />
              ))}
            </div>
            <button className="create-button" onClick={handleCreateCategory}>Create New Category</button>
          </div>

          <div className="divider" />

          <div className="popup-section">
            <div className="popup-title">
              <UserPlus size={30} color="black" />
              <h2>Create New Node</h2>
            </div>
            <select
              className="dropdown"
              value={selectedCategoryForNode}
              onChange={(e) => setSelectedCategoryForNode(e.target.value)}
            >
              <option value="">Choose a Category ...</option>
              {existingCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              className="text-input"
            />
            <input
              type="text"
              placeholder="One Line Introduction"
              value={nodeIntro}
              onChange={(e) => setNodeIntro(e.target.value)}
              className="text-input"
            />
            <textarea
              placeholder="Note ..."
              value={nodeNote}
              onChange={(e) => setNodeNote(e.target.value)}
              className="textarea"
            />
            <div className="favorite-check">
              <input
                type="checkbox"
                id="favorites"
                checked={addToFavorites}
                onChange={(e) => setAddToFavorites(e.target.checked)}
              />
              <label htmlFor="favorites">Would you like to add this to your favorites?</label>
            </div>
            <button className="create-button" onClick={handleCreateNode}>Create New Node</button>
          </div>
        </div>
      </div>
    </div>
  );
}
