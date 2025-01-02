import { useState, useEffect, useCallback } from 'react';

export const useGameState = (gameDuration = 30, holeCount = 9, onGameEnd: () => void) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(gameDuration);
    setIsPlaying(true);
  }, [gameDuration]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setActiveMole(null);
    onGameEnd();
  }, [onGameEnd]);

  const hitMole = useCallback((index: number) => {
    if (index === activeMole) {
      setScore((prevScore) => prevScore + 1);
      setActiveMole(null);
    }
  }, [activeMole]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, endGame]);

  useEffect(() => {
    let moleTimer: NodeJS.Timeout;
    if (isPlaying) {
      moleTimer = setInterval(() => {
        setActiveMole(Math.floor(Math.random() * holeCount));
      }, 1000);
    }
    return () => clearInterval(moleTimer);
  }, [isPlaying, holeCount]);

  return { score, timeLeft, activeMole, isPlaying, startGame, hitMole };
};

