import React, { useState } from 'react';
import { ClipboardPlus, UserPlus, SquareX } from 'lucide-react';
// AddPopup 디자인 불러오기
import './AddPopup.css';

// visible: 보여줄지 여부
// onClose: 팝업 닫기
// onCategoryCreated: 카테고리 생성
// onNodeCreated: 노드 생성
// existingCategories: 현재 카테고리 목록 (객체 배열)
export default function AddPopup({ visible, onClose, onCategoryCreated, onNodeCreated, existingCategories = [] }) {
  const [categoryName, setCategoryName] = useState(''); // 카테고리 이름
  const [categoryError, setCategoryError] = useState(''); // 카테고리 오류
  const [selectedColor, setSelectedColor] = useState('#507060'); // 선택 색상
  const [nodeName, setNodeName] = useState(''); // 노드 이름
  const [nodeIntro, setNodeIntro] = useState(''); // 노드 소개
  const [nodeNote, setNodeNote] = useState(''); // 노드 설명
  const [addToFavorites, setAddToFavorites] = useState(false); // 즐겨찾기
  // 카테고리의 상위 카테고리 ID
  const [selectedCategoryForCategory, setSelectedCategoryForCategory] = useState('');
  // 노드의 카테고리 ID
  const [selectedCategoryForNode, setSelectedCategoryForNode] = useState('');
  // 색상 리스트
  const colors = ['#3C5146', '#507060', '#85A394', '#ACC0B6', '#DDD8C9', '#F2F4E6'];

  // Create New Category 버튼 클릭 시, 카테고리 생성
  const handleCreateCategory = async () => {
    const trimmedName = categoryName.trim(); // 이름 앞뒤 공백 제거
    // 빈 이름이면 오류 처리
    if (trimmedName.length === 0) {
      setCategoryError("카테고리 이름을 입력해주세요.");
      return; // 생성 중단
    }
    // 이미 존재하는 이름이면 오류 처리
    if (existingCategories.some(cat => cat.title === trimmedName)) {
      setCategoryError("이미 존재하는 카테고리입니다.");
      return; // 생성 중단
    }
    
    // 부모 카테고리 정보 찾기
    const parentCategory = selectedCategoryForCategory ? 
      existingCategories.find(cat => cat.originalId === parseInt(selectedCategoryForCategory)) : null;
    
    // 부모 ID 및 루트 여부 설정
    const parentCategoryId = selectedCategoryForCategory ? parseInt(selectedCategoryForCategory) : null;
    const isRootValue = selectedCategoryForCategory ? false : true;
    
    // 전송할 카테고리 데이터 (camelCase + snake_case)
    const categoryData = {
      parentId: parentCategoryId,           // camelCase
      parent_id: parentCategoryId,          // snake_case 
      name: trimmedName,                    // 카테고리 제목
      color: selectedColor,                 // 색상 코드
      is_root: isRootValue,                 // snake_case
      isRoot: isRootValue,                  // camelCase
      user_id: parseInt(localStorage.getItem("userId"))
    };
    
    try {
      // API 요청
      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(categoryData)
      });
      const result = await response.json();

      if (result.resultType === "SUCCESS") {        
        // MainScreen으로 전달할 카테고리 데이터에 부모 카테고리 이름 포함
        const categoryDataForMainScreen = {
          ...result.success,
          // 서버 응답의 parentId를 사용하여 부모 카테고리 정보 찾기
          parentCategory: result.success.parentId ? 
            existingCategories.find(cat => cat.originalId === result.success.parentId)?.title : null,
          parentCategoryId: result.success.parentId,
          // originalId 필드 추가 (MainScreen에서 사용)
          originalId: result.success.id,
          // title 필드 추가 (MainScreen에서 사용)
          title: result.success.name
        };

        if (onCategoryCreated) { // 카테고리 생성 시, MainScreen에 알려줌
          onCategoryCreated(categoryDataForMainScreen);
        }
        
        // 상태 초기화
        setCategoryName(''); // 입력 이름 초기화
        setSelectedColor('#507060'); // 색상 기본값
        setSelectedCategoryForCategory(''); // 카테고리 선택 초기화
        setCategoryError(''); // 에러 메시지 제거
        onClose(); // 팝업 닫기
      } else {
        setCategoryError(result.error?.reason || "카테고리 생성 실패");
      }
    } catch (error) {
      console.error("카테고리 생성 요청 실패:", error);
      setCategoryError("서버와 연결할 수 없습니다.");
    }
  };
    
  // Create New Node 버튼 클릭 시, 노드 생성
  const handleCreateNode = async () => {
    if (!nodeName.trim() || !selectedCategoryForNode) {
      alert("이름과 카테고리를 모두 입력해주세요.");
      return;
    }
    
    // 선택된 카테고리 정보 찾기
    const selectedCategory = existingCategories.find(cat => cat.originalId === parseInt(selectedCategoryForNode));

    const nodeData = { // 입력값 기반 노드 데이터
      category_id: parseInt(selectedCategoryForNode), // 카테고리 ID
      name: nodeName.trim(), // 노드 이름
      introduction: nodeIntro.trim() || "", // 노드 소개
      note: nodeNote.trim() || "", // 노드 설명
      is_favorite: addToFavorites === true // 즐겨찾기
    };

    try {
      // API 요청
      const response = await fetch("http://localhost:3000/api/v1/persons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(nodeData),
      });
      const result = await response.json();

      if (result.resultType === "SUCCESS") {        
        // MainScreen으로 전달할 노드 데이터에 카테고리 이름 포함
        const nodeDataForMainScreen = {
          ...result.success,
          category: selectedCategory ? selectedCategory.title : null, // 카테고리 이름 추가
          is_favorite: nodeData.is_favorite
        };
                
        if (onNodeCreated) { // 노드 생성 시, MainScreen에 알려줌
          onNodeCreated(nodeDataForMainScreen);
        }
        
        // 상태 초기화
        setNodeName(''); // 입력 이름 초기화
        setNodeIntro(''); // 입력 소개 초기화
        setNodeNote(''); // 입력 설명 초기화
        setAddToFavorites(false); // 즐겨찾기 해제
        setSelectedCategoryForNode(''); // 카테고리 선택 초기화
        onClose(); // 팝업 닫기
      } else {
        alert(result.error?.reason || "노드 생성 실패");
      }
    } catch (error) {
      console.error("노드 생성 중 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  // 컴포넌트가 보이지 않으면 null 반환
  if (!visible) return null;

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
              onChange={(e) => {
                setSelectedCategoryForCategory(e.target.value);
              }}
            >
              <option value="">Choose a Category ...</option>
              {existingCategories.map((category) => (
                <option key={category.originalId} value={category.originalId}>{category.title}</option>
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
              {existingCategories.map((category) => (
                <option key={category.originalId} value={category.originalId}>{category.title}</option>
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