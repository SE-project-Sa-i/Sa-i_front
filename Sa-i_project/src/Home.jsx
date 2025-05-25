// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
//연결을 위해 임시로 지정한 페이지. 추후 제거될 예정

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
        onClick={() => navigate('/people')}
      >
        버튼 1 (PeopleList)
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition"
        onClick={() => navigate('/category')}
      >
        버튼 2 (Category)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_1')}
      >
        버튼 3 (CategoryCreateComplete_1)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_2')}
      >
        버튼 4 (CategoryCreateComplete_2)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_3')}
      >
        버튼 5 (CategoryCreateComplete_3)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_4')}
      >
        버튼 6 (CategoryCreateComplete_4)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_5')}
      >
        버튼 7 (CategoryCreateComplete_5)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/categoryCreateComplete_6')}
      >
        버튼 7 (CategoryCreateComplete_6)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/nodeCreateComplete_1')}
      >
        버튼 8 (NodeCreateComplete_1)
      </button>
      <button
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600 transition"
        onClick={() => navigate('/nodeCreateComplete_2')}
      >
        버튼 9 (NodeCreateComplete_2)
      </button>
    </div>
  );
}

export default Home;
