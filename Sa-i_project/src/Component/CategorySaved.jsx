import React from 'react';

export default function CategorySaved({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-[#474545] text-white p-8 rounded-lg shadow-xl w-[400px] text-center relative">
        <p className="text-base text-white mb-1">
          Successfully Saved!
        </p>
        <p classname="text-base text-white mb-1">
            Returning to the Category List Page
        </p>
        <button
          onClick={onClose}
          className="text-black font-bold py-1 px-2 w-full mt-6 rounded bg-white hover:bg-red-500 transition"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
