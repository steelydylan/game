import { useState, useCallback, useMemo } from 'react';

const GRID_SIZE = 3;
const EMPTY_INDEX = GRID_SIZE * GRID_SIZE - 1;

type PuzzleState = number[];

const getInitialState = (): PuzzleState => {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
};

const isSolvable = (puzzle: PuzzleState): boolean => {
  let inversions = 0;
  for (let i = 0; i < puzzle.length - 1; i++) {
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] !== EMPTY_INDEX && puzzle[j] !== EMPTY_INDEX && puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
};

const shufflePuzzle = (): PuzzleState => {
  const newPuzzle = getInitialState();
  do {
    for (let i = newPuzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPuzzle[i], newPuzzle[j]] = [newPuzzle[j], newPuzzle[i]];
    }
  } while (!isSolvable(newPuzzle) || isPuzzleSolved(newPuzzle));
  return newPuzzle;
};

const isPuzzleSolved = (puzzle: PuzzleState): boolean => {
  return puzzle.every((value, index) => value === index);
};

export const useSlidePuzzle = () => {
  const [puzzle, setPuzzle] = useState<PuzzleState>(shufflePuzzle());

  const movablePieces = useMemo(() => {
    const emptyIndex = puzzle.indexOf(EMPTY_INDEX);
    return [
      emptyIndex - GRID_SIZE,
      emptyIndex + GRID_SIZE,
      emptyIndex % GRID_SIZE !== 0 ? emptyIndex - 1 : -1,
      emptyIndex % GRID_SIZE !== GRID_SIZE - 1 ? emptyIndex + 1 : -1,
    ].filter(index => index >= 0 && index < GRID_SIZE * GRID_SIZE);
  }, [puzzle]);

  const movePiece = useCallback((index: number) => {
    if (movablePieces.includes(index)) {
      const emptyIndex = puzzle.indexOf(EMPTY_INDEX);
      setPuzzle(prev => {
        const newPuzzle = [...prev];
        [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
        return newPuzzle;
      });
    }
  }, [puzzle, movablePieces]);

  const shuffleBoard = useCallback(() => {
    setPuzzle(shufflePuzzle());
  }, []);

  const isSolved = isPuzzleSolved(puzzle);

  return { puzzle, movePiece, shuffleBoard, isSolved, movablePieces };
};

