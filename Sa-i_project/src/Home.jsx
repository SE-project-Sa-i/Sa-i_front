// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
//연결을 위해 임시로 지정한 페이지. 추후 제거될 예정

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
        onClick={() => navigate('/people')}
      >
        버튼 1 (PeopleList)
      </button>
      <button
        className="px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition"
        onClick={() => navigate('/category')}
      >
        버튼 2 (Category)
      </button>
    </div>
  );
}

export default Home;
