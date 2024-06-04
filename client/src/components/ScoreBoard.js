// src/Popup.js
import React from "react";

const Popup = ({ score, onRestart }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded text-center min-h-5 min-w-50">
        <h2 className="text-xl mb-2">Game Over</h2>
        <p className="mb-4">Your score: {score}</p>
        <button
          onClick={onRestart}
          className="px-5 py-2 text-lg bg-blue-500 text-white rounded"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default Popup;
