import { useState, useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CategoryPopupManager from '../Component/CategoryPopupManager';

export default function Category() {
  const [visible, setVisible] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredSubId, setHoveredSubId] = useState(null);
  const [clickedId, setClickedId] = useState(null);
  const [clickedSubId, setClickedSubId] = useState(null);
  const [items, setItems] = useState([]);
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const clickTimer = useRef(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch('http://localhost:3000/api/v1/home', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (data.resultType === 'SUCCESS') {
          const mappedItems = data.success.map(parent => ({
            id: parent.id,
            label: parent.name,
            children: (parent.children || []).map(child => ({
              id: child.id,
              label: child.name,
            }))
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('카테고리 데이터 요청 실패:', error);
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch('http://localhost:3000/api/v1/persons', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (data.resultType === 'SUCCESS') {
          setPersons(data.success);
        }
      } catch (error) {
        console.error('사람 목록 요청 실패:', error);
      }
    };

    fetchPersons();
  }, []);

  useEffect(() => {
    let categoryLabel = null;

    if (clickedSubId !== null) {
      for (const item of items) {
        const child = item.children.find(c => c.id === clickedSubId);
        if (child) {
          categoryLabel = child.label;
          break;
        }
      }
    } else if (clickedId !== null) {
      const parent = items.find(i => i.id === clickedId);
      if (parent) categoryLabel = parent.label;
    } else if (hoveredSubId !== null) {
      for (const item of items) {
        const child = item.children.find(c => c.id === hoveredSubId);
        if (child) {
          categoryLabel = child.label;
          break;
        }
      }
    } else if (hoveredId !== null) {
      const parent = items.find(i => i.id === hoveredId);
      if (parent) categoryLabel = parent.label;
    }

    if (categoryLabel) {
      const filtered = persons.filter(p => p.categoryName === categoryLabel);
      setFilteredPersons(filtered);
    } else {
      setFilteredPersons([]);
    }
  }, [hoveredId, hoveredSubId, clickedId, clickedSubId, items, persons]);

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

  const handleMouseUpOrLeave = () => {
    clearTimeout(clickTimer.current);
    setClickedId(null);
    setClickedSubId(null);
  };

  if (!visible) return null;

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#F8F2F0] select-none">
      <div className="w-[35%] h-full flex items-center justify-center">
        <h1 className="list_text mb-1 text-center">
          List <br />
          <span className="sai_text">Sa:i</span>
        </h1>
      </div>

      <div className="relative w-[65%] h-screen bg-[#F8F2F0] flex flex-col">
        <div className="flex justify-between items-center px-[5%] h-[10%] mb-2 select-none">
          <h2 className="category_text">Category</h2>
          <button
            onClick={() => {
              navigate('/');
              setVisible(false);
              navigate('/MainScreen');
            }}
            className="text-gray-400 hover:text-gray-600 text-4xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="h-[90%] px-[5%] pb-[5%]">
          <div className="bg-white p-6 rounded-xl shadow-md h-full flex overflow-hidden relative">
            <div className="w-1/2 pr-4 relative">
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

              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <button
                  className="flex items-center gap-2 bg-[#e5e2e0] text-[#4f4b48] px-4 py-2 rounded-full text-lg font-semibold shadow hover:bg-[#dcd9d7] transition"
                  onClick={() => setShowPopup(true)}
                >
                  <FaPen />
                  Edit
                </button>
              </div>
              {showPopup && (
                <CategoryPopupManager onClose={() => setShowPopup(false)} />
              )}
            </div>

            <div className="w-px bg-gray-300 mx-2" />

            <div className="w-1/2 pl-4 overflow-y-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">인물 목록</h3>
              <ul className="space-y-1">
                {filteredPersons.length > 0 ? (
                  filteredPersons.map((person) => (
                    <li key={person.id} className="text-lg text-gray-700">
                      {person.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">카테고리를 선택하거나 호버하세요.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
