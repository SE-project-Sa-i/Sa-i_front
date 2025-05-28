import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function CategoryEdit({ onClose, onDeleteClick, onSaveClick }) {

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        className="relative w-96 bg-[#474545] p-6 rounded-lg shadow-lg text-white"
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 닫힘 방지
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-300 hover:text-green-500"
        >
          <FaTimes size={20} />
        </button>

        {/* 제목 */}
        <h2 className="text-3xl font-bold text-center mb-6 text-[#fef3f3]">Category</h2>

        {/* 선택할 카테고리 */}
        <select className="w-full p-2 rounded bg-[#788175] text-white mb-4">
          <option>Choose a Category...</option>
          {/* <option>카테고리1</option> 등등 필요시 추가 */}
        </select>

        {/* 이름 변경 입력 */}
        <label className="block text-sm text-gray-300 mb-1">Change Category Name</label>
        <input
          className="w-full p-2 rounded bg-[#788175] text-white mb-4 placeholder-gray-200"
          type="text"
          placeholder="New Name"
        />

        {/* 위치 변경 드롭다운 */}
        <label className="block text-sm text-gray-300 mb-1">Change Category Location</label>
        <select className="w-full p-2 rounded bg-[#788175] text-white mb-6">
          <option>Choose a Category...</option>
        </select>

        {/* 저장 버튼 */}
        <button className="w-full bg-[#4d6751] hover:bg-[#5d7d60] text-white font-semibold py-2 rounded mb-3"
        onClick={onSaveClick}>
          SAVE
        </button>

        {/* 삭제 버튼 */}
        <button className="w-full bg-[#b84444] hover:bg-[#a33c3c] text-white font-semibold py-2 rounded"
        onClick={onDeleteClick}>
          Delete Category
        </button>
      </div>
    </div>
  );
}
