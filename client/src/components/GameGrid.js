import React, { useState, useEffect, useCallback, useRef } from "react";
import Popup from "./ScoreBoard";

const getRandomPosition = (maxX, maxY) => {
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };
};

const GameGrid = ({ level, score, setScore, setLevel, gameOver }) => {
  const [diamond, setDiamond] = useState(getRandomPosition(10, 20));
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [snakes, setSnakes] = useState([
    { x: 0, y: 1, length: 3, direction: "right" },
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const gridRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / 30);
    const y = Math.floor((e.clientX - rect.left) / 30);
    setPlayer({ x, y });
  }, []);

  const handleDiamondClick = useCallback(() => {
    if (player.x === diamond.x && player.y === diamond.y) {
      setScore(score + 10);
      setDiamond(getRandomPosition(10, 20));
      setLevel(level + 1);
      setSnakes([
        ...snakes,
        {
          x: Math.floor(Math.random() * 10),
          y: Math.floor(Math.random() * 20),
          length: 3,
          direction: "right",
        },
      ]);
    }
  }, [player, diamond, score, setScore, level, setLevel, snakes]);

  useEffect(() => {
    snakes.forEach((snake) => {
      for (let i = 0; i < snake.length; i++) {
        let x = snake.x;
        let y = snake.y;
        if (snake.direction === "right") y += i;
        if (snake.direction === "left") y -= i;
        if (snake.direction === "down") x += i;
        if (snake.direction === "up") x -= i;
        if (player.x === x && player.y === y) {
          setIsGameOver(true);
          setFinalScore(score);
          setShowPopup(true);
        }
      }
    });
  }, [player, snakes, score, setScore]);

  useEffect(() => {
    const moveSnakes = () => {
      setSnakes((prevSnakes) =>
        prevSnakes.map((snake) => {
          let newX = snake.x;
          let newY = snake.y;
          if (snake.direction === "right") {
            newY += 1;
            if (newY >= 20) newY = 0;
          } else if (snake.direction === "left") {
            newY -= 1;
            if (newY < 0) newY = 19;
          } else if (snake.direction === "down") {
            newX += 1;
            if (newX >= 10) newX = 0;
          } else if (snake.direction === "up") {
            newX -= 1;
            if (newX < 0) newX = 9;
          }
          return { ...snake, x: newX, y: newY };
        })
      );
    };
    const interval = setInterval(moveSnakes, 500);
    return () => clearInterval(interval);
  }, [snakes]);

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (grid) {
        grid.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [handleMouseMove]);

  const handleRestart = () => {
    setIsGameOver(false);
    setShowPopup(false);
    setScore(0);
    setLevel(1);
    setPlayer({ x: 0, y: 0 });
    setDiamond(getRandomPosition(10, 20));
    setSnakes([{ x: 0, y: 1, length: 3, direction: "right" }]);
    setTimeout(() => setIsGameOver(false), 3000);
  };

  if (gameOver) {
    return null;
  }

  return (
    <div className="game-container">
      {showPopup && <Popup score={finalScore} onRestart={handleRestart} />}
      <div
        className={`game-grid ${isGameOver ? "game-over" : ""}`}
        ref={gridRef}
      >
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: 20 }).map((_, colIndex) => {
              const isPlayer = rowIndex === player.x && colIndex === player.y;
              const isDiamond =
                rowIndex === diamond.x && colIndex === diamond.y;
              const isSnake = snakes.some((snake) => {
                for (let i = 0; i < snake.length; i++) {
                  if (
                    (snake.direction === "right" &&
                      rowIndex === snake.x &&
                      colIndex === snake.y + i) ||
                    (snake.direction === "left" &&
                      rowIndex === snake.x &&
                      colIndex === snake.y - i) ||
                    (snake.direction === "down" &&
                      rowIndex === snake.x + i &&
                      colIndex === snake.y) ||
                    (snake.direction === "up" &&
                      rowIndex === snake.x - i &&
                      colIndex === snake.y)
                  ) {
                    return true;
                  }
                }
                return false;
              });

              return (
                <div
                  key={colIndex}
                  className={`cell 
                    ${isPlayer ? "player" : ""}
                    ${isDiamond && !isPlayer ? "diamond" : ""}
                    ${isSnake ? "snake" : ""}`}
                  onClick={isDiamond && isPlayer ? handleDiamondClick : null}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
