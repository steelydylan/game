"use client";

import React, { useState } from 'react';

interface PuzzlePieceProps {
  value: number;
  index: number;
  onClick: (index: number) => void;
  isMovable: boolean;
}

const baseImageUrl = 'https://pub-b0a13c9ab7ec4974bfbfe83ef043063b.r2.dev';

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ value, index, onClick, isMovable }) => {
  const [isShaking, setIsShaking] = useState(false);

  if (value === 8) return <div className="w-full h-full bg-gray-200 rounded-md" />;

  const imageUrl = `${baseImageUrl}/obake_${value + 1}.png`;

  const handleClick = () => {
    if (isMovable) {
      onClick(index);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <button
      className={`w-full h-full bg-white rounded-md shadow-md transition-all duration-200 overflow-hidden
  ${isMovable 
    ? 'hover:shadow-lg hover:scale-105 border-4 border-yellow-400' 
    : ''}`}
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={`Puzzle piece ${value + 1}`}
        width={100}
        height={100}
        className={`w-full h-full object-cover ${isShaking && !isMovable ? 'animate-shake' : ''}`}
      />
    </button>
  );
};

