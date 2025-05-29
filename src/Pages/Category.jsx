import { useState, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CategoryPopupManager from '../Component/CategoryPopupManager';
import "./List.css";

export default function Category() {
  const [visible, setVisible] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredSubId, setHoveredSubId] = useState(null);
  const [clickedId, setClickedId] = useState(null);
  const [clickedSubId, setClickedSubId] = useState(null);
  const clickTimer = useRef(null);
  const navigate = useNavigate();
  //나중에 다른 페이지랑 라우팅 연결 대비한 const
  const [showPopup, setShowPopup] = useState(false);

  // 카테고리 및 인물 데이터
  const [items, setItems] = useState([
    {
      id: 1,
      label: '카테고리 A',
      children: [
        { id: 11, label: '카테고리 A-1', people: ['김철수'] },
        { id: 12, label: '카테고리 A-2', people: ['김문수'] },
      ],
    },
    {
      id: 2,
      label: '카테고리 B',
      children: [
        { id: 21, label: '카테고리 B-1', people: ['이준석'] },
        { id: 22, label: '카테고리 B-2', people: ['김연아'] },
      ],
    },
    {
      id: 3,
      label: '카테고리 C',
      children: [],
    },
  ]);

  // 꾸욱 클릭(500ms 이상) 처리
  const handleMouseDown = (id, isChild = false) => {
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      if (isChild) {
        setClickedId(null);
        setClickedSubId(id);
      } else {
        setClickedSubId(null);
        setClickedId(id);
      }
    }, 500);
  };

  // 마우스 버튼을 뗐거나 커서가 벗어났을 때 클릭 상태 해제
  const handleMouseUpOrLeave = () => {
    clearTimeout(clickTimer.current);
    setClickedId(null);
    setClickedSubId(null);
  };

  // 오른쪽 인물 목록에 표시할 사람들 결정
  const getPeopleToShow = () => {
    if (clickedId !== null) {
      const parent = items.find((item) => item.id === clickedId);
      if (parent) return parent.children.flatMap((c) => c.people || []);
    }
    if (clickedSubId !== null) {
      for (const item of items) {
        const child = item.children.find((c) => c.id === clickedSubId);
        if (child) return child.people || [];
      }
    }
    if (hoveredSubId !== null) {
      for (const item of items) {
        const child = item.children.find((c) => c.id === hoveredSubId);
        if (child) return child.people || [];
      }
    }
    if (hoveredId !== null) {
      const parent = items.find((item) => item.id === hoveredId);
      if (parent) return parent.children.flatMap((c) => c.people || []);
    }
    return [];
  };

  if (!visible) return null;

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#F8F2F0] select-none">
      {/* 왼쪽: 로고 영역 */}
      <div className="w-[35%] h-full flex items-center justify-center">
        <h1 className="list_text mb-1 text-center">
          List <br />
          <span className="sai_text">Sa:i</span>
        </h1>
      </div>

      {/* 오른쪽 전체 영역 */}
      <div className="relative w-[65%] h-screen bg-[#F8F2F0] flex flex-col">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center px-[5%] h-[10%] mb-2">
          <h2 className="category_text">Category</h2>
          <button
            onClick={() => {navigate('/MainScreen');
              setVisible(false);}}
            className="text-gray-400 hover:text-gray-600 text-4xl"
          >
            <IoClose />
          </button>
        </div>

        {/* 본문 영역 */}
        <div className="h-[90%] px-[5%] pb-[5%]">
          <div className="bg-white p-6 rounded-xl shadow-md h-full flex overflow-hidden relative">
            {/* 왼쪽 리스트 영역 (스크롤 가능) */}
            <div className="w-1/2 pr-4 relative">
              {/* 스크롤 가능한 리스트 컨테이너 */}
              <div className="overflow-y-auto h-full pr-2">
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      onMouseEnter={() => {
                        if (clickedId === null && clickedSubId === null) {
                          setHoveredId(item.id);
                          setHoveredSubId(null);
                        }
                      }}
                      onMouseLeave={() => {
                        if (clickedId === null && clickedSubId === null) {
                          setHoveredId(null);
                          setHoveredSubId(null);
                        }
                      }}
                      className="relative"
                    >
                      {/* 상위 카테고리 버튼 */}
                      <button
                        onMouseDown={() => handleMouseDown(item.id, false)}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        className={`w-full text-left px-2 py-1 font-bold text-xl rounded-lg transition-colors duration-200 ${
                          clickedId === item.id
                            ? 'text-blue-600'
                            : hoveredId === item.id
                            ? 'text-red-600'
                            : 'text-black'
                        } hover:text-gray-500 hover:bg-gray-100`}
                      >
                        {item.label}
                      </button>

                      {/* 하위 카테고리 목록 */}
                      {(hoveredId === item.id || clickedId === item.id) &&
                        item.children.length > 0 && (
                          <ul className="mt-1 ml-4 space-y-1">
                            {item.children.map((child) => (
                              <li
                                key={child.id}
                                onMouseEnter={() => {
                                  if (clickedId === null && clickedSubId === null) {
                                    setHoveredSubId(child.id);
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (clickedId === null && clickedSubId === null) {
                                    setHoveredSubId(null);
                                  }
                                }}
                              >
                                {/* 하위 카테고리 버튼 */}
                                <button
                                  onMouseDown={() => handleMouseDown(child.id, true)}
                                  onMouseUp={handleMouseUpOrLeave}
                                  onMouseLeave={handleMouseUpOrLeave}
                                  className={`w-full text-left px-2 py-1 text-xl font-medium transition-colors duration-200 ${
                                    clickedSubId === child.id
                                      ? 'text-blue-600'
                                      : hoveredSubId === child.id
                                      ? 'text-red-600'
                                      : 'text-black'
                                  } hover:text-gray-500 hover:bg-gray-100`}
                                >
                                  {child.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Edit 버튼 - 왼쪽 하단 고정 */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <button
                  className="flex items-center gap-2 bg-[#e5e2e0] text-[#4f4b48] px-4 py-2 rounded-full text-lg font-semibold shadow hover:bg-[#dcd9d7] transition"
                  onClick={() => setShowPopup(true)}>
                  <FaPen />
                  Edit
                </button>
              </div>
              {showPopup && (
                <CategoryPopupManager onClose={() => setShowPopup(false)} />
              )}
            </div>

            {/* 세로 구분선 */}
            <div className="w-px bg-gray-300 mx-2" />

            {/* 오른쪽 인물 목록 영역 (스크롤 가능) */}
            <div className="w-1/2 pl-4 overflow-y-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">인물 목록</h3>
              <ul className="space-y-1">
                {getPeopleToShow().map((person, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}