import React, { useState } from "react";
import GameGrid from "./components/GameGrid";

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
    <div className="flex flex-col items-center mt-5">
      <div className="mb-4 flex">
        <div className="mr-5">Level: {level}</div>
        <div className="">Score: {score}</div>
      </div>
      <button
        onClick={handleStartStop}
        className="mb-5 px-5 py-2.5 text-lg bg-blue-500 text-white rounded"
      >
        {isPlaying ? "Stop" : "Start"}
      </button>
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
