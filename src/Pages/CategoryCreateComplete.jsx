import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./CategoryCreateComplete.css";

// 모든 PNG 한꺼번에 import
import category1 from '../assets/Category1.png';
import category2 from '../assets/Category2.png';
import category3 from '../assets/Category3.png';
import category4 from '../assets/Category4.png';
import category5 from '../assets/Category5.png';
import category6 from '../assets/Category6.png';

export default function CategoryCreateComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { color = '#507060' } = location.state || {};

  // 색상에 따라 PNG 선택
  const colorToImageMap = {
    '#3C5146': category1,
    '#507060': category2,
    '#85A394': category3,
    '#ACC0B6': category4,
    '#DDD8C9': category5,
    '#F2F4E6': category6
  };
  
  // fallback
  const selectedImage = colorToImageMap[color] || category1;

  // 클릭 시, 초기 메인 화면으로 이동해 카테고리 생성 안되는 것처럼 보임
  const handleClick = () => {
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
        <img src={selectedImage} alt="category" className="leaf-image" />
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white transform">
          <span className="user_text">User</span>
        </span>
      </div>

      <h1 className="success_text">Successfully Added!</h1>
    </div>
  );
}