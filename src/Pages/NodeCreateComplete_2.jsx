import React from 'react';
import { useNavigate } from 'react-router-dom';
import node from '../assets/Node2.png';
import "./CategoryCreateComplete.css";

export default function NodeCreateComplete_2() {
  const navigate = useNavigate();

  const handleClick = () => {
    // 클릭 시, 초기 메인 화면으로 이동해 노드 생성 안되는 것처럼 보임
    navigate('/MainScreen');
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-[#F8F2F0] text-center cursor-pointer italic"
      onClick={handleClick}
    >
      <p className="click_return_text mb-10">
        Click to return to the home screen
      </p>

      <div className="relative mb-10">
        {/* Leaf shape */}
        <img src={node} alt="node" className="node-image" />
        {/* "User" text */}
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white transform"> 
          <span className="user_text">
            User
            {/*Node 이름은 여기 text 수정, 데이터베이스에서 받아오기 */}
          </span>
        </span>
      </div>

      <h1 className="success_text">
        Successfully Added!
      </h1>
    </div>
  );
}
