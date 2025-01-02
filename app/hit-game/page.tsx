"use client"

import { useState, useCallback, useEffect } from 'react'
import { useGameState } from './hooks/useGameState'
import { GameBoard } from './components/GameBoard'
import { ScoreDialog } from './components/ScoreDialog'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const allYokai = [
  { id: 1, type: 'kappa', imagePath: 'daizinikyuriwokakaeteirukappa.png', color: 'text-green-500' },
  { id: 2, type: 'hitotsumekozou', imagePath: 'obake_hitotumekozou.png', color: 'text-blue-500' },
  { id: 3, type: 'kyuubinokitsune', imagePath: 'obake_kyubinokitune.png', color: 'text-orange-500' },
  { id: 4, type: 'nekomata', imagePath: 'obake_nekomata.png', color: 'text-gray-500' },
  { id: 5, type: 'nurarihyon', imagePath: 'obake_nurarihyon.png', color: 'text-purple-500' },
  { id: 6, type: 'rokurokubi', imagePath: 'obake_rokurokubi.png', color: 'text-red-500' },
  { id: 7, type: 'tyouchinobake', imagePath: 'obake_tyoutinobake.png', color: 'text-yellow-500' },
  { id: 8, type: 'tengu', imagePath: 'utiwawomotteirutengu.png', color: 'text-red-700' },
  { id: 9, type: 'amabie', imagePath: 'youkai_amabie.png', color: 'text-teal-500' },
  { id: 10, type: 'yukionna', imagePath: 'obake_yukionna.png', color: 'text-blue-200' },
  { id: 11, type: 'azukiarai', imagePath: 'youkai_azukiarai.png', color: 'text-red-400' },
  { id: 12, type: 'tohukozou', imagePath: 'youkai_tohukozou.png', color: 'text-green-300' },
]

export default function YokaiGame() {
  const [highScore, setHighScore] = useState(0)
  const [showScoreDialog, setShowScoreDialog] = useState(false)

  const handleGameEnd = useCallback(() => {
    setShowScoreDialog(true)
  }, [])

  const { score, timeLeft, activeMole: activeYokai, isPlaying, startGame, hitMole: hitYokai } = useGameState(
    30,
    9,
    handleGameEnd
  );

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
    }
  }, [score, highScore])

  const handleCloseScoreDialog = useCallback(() => {
    setShowScoreDialog(false)
    startGame()
  }, [startGame])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-yellow-500 text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        妖怪タッチゲーム
      </motion.h1>
      <div className="w-full max-w-3xl bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-semibold text-purple-600">
            スコア: <span className="text-2xl sm:text-3xl">{score}</span>
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-red-500">
            残り時間: <span className="text-2xl sm:text-3xl">{timeLeft}</span>秒
          </div>
        </div>
        <GameBoard holeCount={9} activeYokai={activeYokai} onHit={hitYokai} yokaiList={allYokai} />
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-semibold text-green-600">
            ハイスコア: <span className="text-2xl sm:text-3xl">{highScore}</span>
          </div>
          <Button
            onClick={() => {
              if (isPlaying) {
                handleGameEnd();
              }
              startGame();
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-lg sm:text-xl transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? 'リスタート' : 'スタート'}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center text-gray-600">
        <p>妖怪さんをタッチしてポイントゲット！</p>
        <p>たくさんタッチしてハイスコアを目指そう！</p>
      </div>
      {showScoreDialog && (
        <ScoreDialog
          score={score}
          highScore={highScore}
          onClose={handleCloseScoreDialog}
        />
      )}
    </div>
  )
}

