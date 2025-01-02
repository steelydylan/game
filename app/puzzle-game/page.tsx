"use client";

import React from 'react';
import { useSlidePuzzle } from './hooks/useSlidePuzzle';
import { PuzzlePiece } from './components/PuzzlePiece';

const SlidePuzzle: React.FC = () => {
  const { puzzle, movePiece, shuffleBoard, isSolved } = useSlidePuzzle();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">おばけスライドパズル</h1>
      <div className="grid grid-cols-3 gap-2 bg-gray-300 p-2 rounded-lg shadow-lg">
        {puzzle.map((value, index) => (
          <PuzzlePiece key={index} value={value} index={index} onClick={movePiece} />
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

