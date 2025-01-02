"use client"

import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { useState, useEffect, useCallback } from 'react'
import { Star, Sparkles } from 'lucide-react'
import Yokai from './components/Yokai'
import DropZone from './components/DropZone'
import { DragLayer } from './components/DragLayer'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const baseImageUrl = 'https://pub-b0a13c9ab7ec4974bfbfe83ef043063b.r2.dev'

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

export default function YokaiMatchingGame() {
  const [yokai, setYokai] = useState<typeof allYokai>([])
  const [dropZones, setDropZones] = useState<typeof allYokai>([])
  const [matchedYokai, setMatchedYokai] = useState<number[]>([])
  const [gameCount, setGameCount] = useState(1)
  const [score, setScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isSoundAvailable, setIsSoundAvailable] = useState(false)

  const shuffleArray = (array: typeof allYokai) => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  const startNewGame = useCallback(() => {
    const shuffled = shuffleArray(allYokai)
    const gameYokaiCount = gameCount >= 3 ? 4 : 3
    const gameYokai = shuffled.slice(0, gameYokaiCount)
    setYokai(gameYokai)
    setDropZones(shuffleArray([...gameYokai]))
    setMatchedYokai([])
    setShowCelebration(false)
    setShowConfetti(false)
  }, [gameCount])

  useEffect(() => {
    startNewGame()
  }, [gameCount, startNewGame])

  const playSound = useCallback((soundType: 'match' | 'success') => {
    if (!isSoundAvailable) {
      console.log('Sound is not available on this device')
      return
    }

    const audio = new Audio(soundType === 'match' ? '/match-sound.mp3' : '/success-sound.mp3')
    audio.play().catch(error => {
      console.error('Error playing sound:', error)
      setIsSoundAvailable(false)
    })
  }, [isSoundAvailable])

  const handleDrop = useCallback((yokaiId: number) => {
    setMatchedYokai(prev => {
      if (!prev.includes(yokaiId)) {
        const newMatched = [...prev, yokaiId]
        setScore(score => score + 20)
        if (newMatched.length === yokai.length) {
          setShowConfetti(true)
          setShowCelebration(true)
          playSound('success')
        } else {
          playSound('match')
        }
        return newMatched
      }
      return prev
    })
  }, [yokai.length, playSound])

  useEffect(() => {
    if (matchedYokai.length === yokai.length && yokai.length > 0) {
      const nextGameTimer = setTimeout(() => {
        setGameCount(prevCount => prevCount + 1)
      }, 5000)

      return () => clearTimeout(nextGameTimer)
    }
  }, [matchedYokai.length, yokai.length])

  useEffect(() => {
    const checkAudioAvailability = async () => {
      try {
        const audio = new Audio()
        await audio.play()
        setIsSoundAvailable(true)
      } catch (error) {
        console.log('Audio playback is not available:', error)
        setIsSoundAvailable(false)
      }
    }

    checkAudioAvailability()
  }, [])

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <div className="min-h-screen bg-gradient-to-b from-purple-200 via-indigo-200 to-blue-200 p-4 sm:p-8 relative overflow-hidden">
        <DragLayer yokai={allYokai} />
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-yellow-400 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${0.5 + Math.random()})`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        <div className="bg-indigo-600 rounded-full px-4 sm:px-8 py-2 text-yellow-300 text-xl sm:text-2xl font-bold mx-auto w-fit mb-4 shadow-lg">
          スコア: {score}
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {[...Array(Math.min(3, Math.floor(score / 60)))].map((_, i) => (
            <Star key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-indigo-800 relative">
          <Sparkles className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 text-yellow-400" />
          妖怪マッチングゲーム
          <Sparkles className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 text-yellow-400" />
        </h1>

        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 sm:p-8 max-w-6xl mx-auto shadow-xl">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-4 sm:mb-8">
            {yokai.map((y) => (
              <Yokai
                key={`${y.id}-${y.type}`}
                id={y.id}
                type={y.type}
                imagePath={`${baseImageUrl}/${y.imagePath}`}
                color={y.color}
                isMatched={matchedYokai.includes(y.id)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {dropZones.map((y) => (
              <DropZone
                key={y.id}
                type={y.type}
                imagePath={`${baseImageUrl}/${y.imagePath}`}
                color={y.color}
                onDrop={() => handleDrop(y.id)}
                isMatched={matchedYokai.includes(y.id)}
              />
            ))}
          </div>
        </div>
        <Link href="/" className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-colors">
          ゲーム選択に戻る
        </Link>
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white/90 rounded-3xl p-8 text-center shadow-2xl">
                <h2 className="text-4xl font-bold text-indigo-600 mb-4">おめでとう！</h2>
                <p className="text-2xl text-gray-700 mb-6">全部そろったよ！</p>
                <div className="flex justify-center space-x-4">
                  {yokai.map((y) => (
                    <motion.div
                      key={y.id}
                      animate={{
                        y: [0, -20, 0],
                        transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
                      }}
                    >
                      <img src={`${baseImageUrl}/${y.imagePath}`} alt={y.type} className="w-16 h-16 object-contain" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  )
}

