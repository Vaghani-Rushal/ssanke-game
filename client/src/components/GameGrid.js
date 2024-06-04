// src/GameGrid.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import Popup from "./ScoreBoard";

const getRandomPosition = (maxX, maxY) => {
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  };
};

const directions = ["up", "down", "left", "right"];

const getRandomDirection = () => {
  return directions[Math.floor(Math.random() * directions.length)];
};

const getInitialSnake = () => {
  const length = Math.floor(Math.random() * 2) + 3;
  const direction = getRandomDirection();
  const head = getRandomPosition(10, 20);
  const segments = [head];

  for (let i = 1; i < length; i++) {
    let newSegment = { ...head };

    if (direction === "right") newSegment.y -= i;
    if (direction === "left") newSegment.y += i;
    if (direction === "down") newSegment.x -= i;
    if (direction === "up") newSegment.x += i;

    if (newSegment.y < 0) newSegment.y += 20;
    if (newSegment.y >= 20) newSegment.y -= 20;
    if (newSegment.x < 0) newSegment.x += 10;
    if (newSegment.x >= 10) newSegment.x -= 10;

    segments.push(newSegment);
  }

  return { segments, direction };
};

const GameGrid = ({ level, score, setScore, setLevel }) => {
  const [diamond, setDiamond] = useState(getRandomPosition(10, 20));
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [snakes, setSnakes] = useState([getInitialSnake()]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [collisionCells, setCollisionCells] = useState([]);
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
      setSnakes([...snakes, getInitialSnake()]);
    }
  }, [player, diamond, score, setScore, level, setLevel, snakes]);

  useEffect(() => {
    const newCollisionCells = [];
    snakes.forEach((snake) => {
      snake.segments.forEach((segment) => {
        if (player.x === segment.x && player.y === segment.y) {
          newCollisionCells.push({ x: segment.x, y: segment.y });
          setIsGameOver(true);
          setFinalScore(score);
          setShowPopup(true);
        }
      });
    });
    setCollisionCells(newCollisionCells);
  }, [player, snakes, score, setScore]);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnakes = () => {
      setSnakes((prevSnakes) =>
        prevSnakes.map((snake) => {
          const newSegments = [...snake.segments];
          let newHead = { ...newSegments[0] };

          if (snake.direction === "right") newHead.y = (newHead.y + 1) % 20;
          if (snake.direction === "left") newHead.y = (newHead.y - 1 + 20) % 20;
          if (snake.direction === "down") newHead.x = (newHead.x + 1) % 10;
          if (snake.direction === "up") newHead.x = (newHead.x - 1 + 10) % 10;

          const collidesWithSelf = newSegments.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          );

          if (collidesWithSelf) {
            snake.direction = getRandomDirection();
            return snake;
          }

          newSegments.pop();
          newSegments.unshift(newHead);

          if (Math.random() < 0.1) {
            snake.direction = getRandomDirection();
          }

          return { ...snake, segments: newSegments };
        })
      );
    };

    const interval = setInterval(moveSnakes, 500);
    return () => clearInterval(interval);
  }, [snakes, isGameOver]);

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
    setSnakes([getInitialSnake()]);
    setCollisionCells([]);
    setTimeout(() => setIsGameOver(false), 3000);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {showPopup && <Popup score={finalScore} onRestart={handleRestart} />}
      <div
        className={`grid grid-cols-20  ${
          isGameOver ? "pointer-events-none" : ""
        }`}
        ref={gridRef}
      >
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: 20 }).map((_, colIndex) => {
              const isPlayer = rowIndex === player.x && colIndex === player.y;
              const isDiamond =
                rowIndex === diamond.x && colIndex === diamond.y;
              const isSnake = snakes.some((snake) =>
                snake.segments.some(
                  (segment) => segment.x === rowIndex && segment.y === colIndex
                )
              );

              const isCollision = collisionCells.some(
                (cell) => cell.x === rowIndex && cell.y === colIndex
              );

              return (
                <div
                  key={colIndex}
                  className={`w-[30px] h-[30px] border border-gray-300 
                    ${isPlayer ? "bg-green-500" : ""}
                    ${isDiamond && !isPlayer ? "bg-blue-500" : ""}
                    ${isSnake ? "bg-red-500" : ""}
                    ${
                      isCollision
                        ? "bg-gradient-to-br from-green-500 to-red-500"
                        : ""
                    }`}
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
