// src/Popup.js
import React from "react";

const Popup = ({ score, onRestart }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Game Over</h2>
        <p>Your score: {score}</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
};

export default Popup;
