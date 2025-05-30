import { useState } from 'react';
import { useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import "./List.css";

const people = [
  { name: '김명윤', starred: true, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: '김에서', starred: true, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: '노현웅', starred: true, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: '안수빈', starred: true, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: '최지운', starred: true, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: '정옥란', starred: false, tags: ['University', 'Professor'] },
  { name: 'user1', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user2', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user3', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user4', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user5', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user6', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
  { name: 'user7', starred: false, tags: ['University', 'Team Project', 'Software Engineering'] },
];
//이 const 부분을 수정해서 데이터베이스와 연동되게 하면 될 듯. 현재는 더미데이터 선입력 해놓은 상태. 

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

  if (!visible) return null;

  // 백엔드 연동 가능하도록 useEffect로 데이터 불러오는 구조
  useEffect(() => {
    // 나중에 실제 fetch로 교체
    // fetch('/api/people').then(res => res.json()).then(setPeopleState);
    setPeopleState(people); // 지금은 더미데이터로 대체
  }, []);
  //잘 모르지만 백엔드 연동 GPT한테 물어봐서 이렇게 해두면 편하다고 하네요...ㅎㅎㅎ

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#F8F2F0] select-none">
      {/* 왼쪽: 40% */}
      <div className="w-[35%] h-full flex items-center justify-center">
        <h1 className="list_text mb-1 text-center">
          List <br />
          <span className="sai_text">Sa:i</span>
        </h1>
      </div>

      {/* 오른쪽: 60% */}
      <div className="relative w-[65%] h-screen bg-[#F8F2F0] flex flex-col">
        {/* 제목 & 닫기 버튼 (고정) */}
        <div className="flex justify-between items-center px-[5%] h-[10%] mb-2 select-none"> 
          {/* mb는 margin-bottom => 제목과 카드리스트 사이 공간 */}
          <h2 className="people_text">People</h2>
          <button
            onClick={() => {
              setVisible(false);
              navigate('/MainScreen');}}
            className="text-gray-400 hover:text-gray-600 text-4xl">
            <IoClose />
          </button>
        </div>

        {/* 카드 리스트 영역 (남은 80%에서 하단 마진 10%) */}
        <div className="h-[90%] px-[5%] pb-[5%]">
          <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto space-y-4">
            {peopleState.map((person, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2"
              >
                {/* 이름 및 태그 */}
                <div className="flex items-center space-x-4">
                  <div className="font-bold text-[#2f2f2f] text-2xl">{person.name}</div>
                  {/* Memory with 000 page와 연결, import하고 onclick 이벤트 넣으면 될듯듯 */}
                  <div className="text-md italic text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                    {person.tags.join(' › ')}
                  </div>
                </div>

                {/* 별 아이콘 */}
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
