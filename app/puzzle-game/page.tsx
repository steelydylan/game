"use client";

import React from 'react';
import { useSlidePuzzle } from './hooks/useSlidePuzzle';
import { PuzzlePiece } from './components/PuzzlePiece';

const SlidePuzzle: React.FC = () => {
  const { puzzle, movePiece, shuffleBoard, isSolved, movablePieces } = useSlidePuzzle();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <h1 className="text-3xl font-bold mb-6">おばけスライドパズル</h1>
      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl shadow-2xl">
        {puzzle.map((value, index) => (
          <PuzzlePiece
            key={index}
            value={value}
            index={index}
            onClick={movePiece}
            isMovable={movablePieces.includes(index)}
          />
        ))}
      </div>
      <button
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors duration-200"
        onClick={shuffleBoard}
      >
        シャッフル
      </button>
      {isSolved && (
        <div className="mt-4 text-xl font-bold text-green-600">
          おめでとうございます！パズルを解きました！
        </div>
      )}
    </div>
  );
};

export default SlidePuzzle;

