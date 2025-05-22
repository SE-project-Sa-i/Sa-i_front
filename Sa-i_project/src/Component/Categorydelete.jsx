import React from 'react';

export default function CategoryDelete({ onClose, onConfirmDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#474545] text-white p-8 rounded-lg shadow-xl w-[400px] text-center relative">
        <p className="text-sm text-red-400 italic font-semibold mb-1">
          You cannot undo this action once deleted
        </p>
        <p className="text-base text-white mb-1">
          Are you sure you want to delete?
        </p>
        <p className="text-sm text-gray-200 italic mb-6">
          Not only the category but also<br />
          all the <span className="text-red-300 font-medium">information of the people within it</span> will be deleted
        </p>

        <button
          onClick={onClose}
          className="text-white font-bold py-2 px-4 mb-4 w-full rounded bg-gray-600 hover:bg-gray-500 transition"
        >
          No (Back to Category List Page)
        </button>

        <button
          onClick={onConfirmDelete}
          className="text-white font-bold py-2 px-4 w-full rounded bg-red-600 hover:bg-red-500 transition"
        >
          Delete Category
        </button>
      </div>
    </div>
  );
}
