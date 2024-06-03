// src/App.js
import React, { useState } from "react";
import GameGrid from "./components/GameGrid";
import "./App.css";

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const handleStartStop = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScore(0);
      setLevel(1);
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <div className="App">
      <button onClick={handleStartStop}>{isPlaying ? "Stop" : "Start"}</button>
      <div>Score: {score}</div>
      <div>Level: {level}</div>
      {isPlaying && (
        <GameGrid
          level={level}
          score={score}
          setScore={setScore}
          setLevel={setLevel}
          gameOver={!isPlaying}
        />
      )}
    </div>
  );
};

export default App;
