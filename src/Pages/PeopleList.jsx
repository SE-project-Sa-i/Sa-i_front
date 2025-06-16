import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import './List.css';

export default function PeopleList() {
  const [visible, setVisible] = useState(true);
  const [peopleState, setPeopleState] = useState([]);
  const navigate = useNavigate();

  const toggleStar = (index) => {
    setPeopleState((prev) =>
      prev.map((person, i) =>
        i === index ? { ...person, starred: !person.starred } : person
      )
    );
  };

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3000/api/v1/persons', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Fetched people:', data);

        if (data.resultType === 'SUCCESS') {
          const formatted = data.success.map(p => ({
            name: p.name,
            starred: p.isFavorite ?? false,
            tags: p.categoryName ? [p.categoryName] : []
          }));
          setPeopleState(formatted);
        } else {
          console.error('API 응답 실패:', data);
        }
      } catch (err) {
        console.error('사람 목록 불러오기 실패:', err);
      }
    };

    fetchPeople();
  }, []);

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
          <h2 className="people_text">People</h2>
          <button
            onClick={() => {
              setVisible(false);
              navigate('/MainScreen');
            }}
            className="text-gray-400 hover:text-gray-600 text-4xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="h-[90%] px-[5%] pb-[5%]">
          <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto space-y-4">
            {peopleState.map((person, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2"
              >
                <div className="flex items-center space-x-4">
                  <div className="font-bold text-[#2f2f2f] text-2xl">{person.name}</div>
                  <div className="text-md italic text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                    {person.tags.join(' › ')}
                  </div>
                </div>

                <button
                  onClick={() => toggleStar(idx)}
                  className={`text-xl ${
                    person.starred ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <FaStar className="drop-shadow" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
