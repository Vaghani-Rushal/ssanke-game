// src/GameGrid.js
import React, { useState, useEffect, useCallback, useRef } from "react";

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
  const gridRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / 30);
    const y = Math.floor((e.clientX - rect.left) / 30);
    setPlayer({ x, y });
  }, []);

  useEffect(() => {
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
    snakes.forEach((snake) => {
      for (let i = 0; i < snake.length; i++) {
        let x = snake.x;
        let y = snake.y;
        if (snake.direction === "right") y += i;
        if (snake.direction === "left") y -= i;
        if (snake.direction === "down") x += i;
        if (snake.direction === "up") x -= i;
        if (player.x === x && player.y === y) {
          setScore(score - 10);
        }
      }
    });
  }, [player, diamond, snakes, score, setScore, level, setLevel]);

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

  if (gameOver) {
    return null;
  }

  return (
    <div className="game-grid" ref={gridRef}>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: 20 }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`cell 
                            ${
                              rowIndex === player.x && colIndex === player.y
                                ? "player"
                                : ""
                            }
                            ${
                              rowIndex === diamond.x && colIndex === diamond.y
                                ? "diamond"
                                : ""
                            }
                            ${
                              snakes.some((snake) => {
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
                              })
                                ? "snake"
                                : ""
                            }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
