import React from 'react';
import Image from 'next/image';

interface PuzzlePieceProps {
  value: number;
  index: number;
  onClick: (index: number) => void;
}

const baseImageUrl = 'https://pub-b0a13c9ab7ec4974bfbfe83ef043063b.r2.dev';

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ value, index, onClick }) => {
  if (value === 8) return <div className="w-full h-full bg-gray-200 rounded-md" />;

  const imageUrl = `${baseImageUrl}/obake_${value + 1}.png`;

  return (
    <button
      className="w-full h-full bg-white rounded-md shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={() => onClick(index)}
    >
      <Image
        src={imageUrl}
        alt={`Puzzle piece ${value + 1}`}
        width={100}
        height={100}
        className="w-full h-full object-cover"
      />
    </button>
  );
};


