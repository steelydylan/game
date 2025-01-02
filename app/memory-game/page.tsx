"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import Confetti from 'react-confetti'
import Link from 'next/link'

const baseImageUrl = 'https://pub-b0a13c9ab7ec4974bfbfe83ef043063b.r2.dev'

const allYokai = [
  { id: 1, type: 'kappa', imagePath: 'daizinikyuriwokakaeteirukappa.png' },
  { id: 2, type: 'hitotsumekozou', imagePath: 'obake_hitotumekozou.png' },
  { id: 3, type: 'kyuubinokitsune', imagePath: 'obake_kyubinokitune.png' },
  { id: 4, type: 'nekomata', imagePath: 'obake_nekomata.png' },
  { id: 5, type: 'nurarihyon', imagePath: 'obake_nurarihyon.png' },
  { id: 6, type: 'rokurokubi', imagePath: 'obake_rokurokubi.png' },
  { id: 7, type: 'tyouchinobake', imagePath: 'obake_tyoutinobake.png' },
  { id: 8, type: 'tengu', imagePath: 'utiwawomotteirutengu.png' },
  { id: 9, type: 'amabie', imagePath: 'youkai_amabie.png' },
  { id: 10, type: 'yukionna', imagePath: 'obake_yukionna.png' },
  { id: 11, type: 'azukiarai', imagePath: 'youkai_azukiarai.png' },
  { id: 12, type: 'tohukozou', imagePath: 'youkai_tohukozou.png' },
]

interface Card {
  id: number
  type: string
  imagePath: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [showCelebration, setShowCelebration] = useState<boolean>(false)
  const [stage, setStage] = useState<number>(1)

  const shuffleCards = useCallback(() => {
    const pairsCount = Math.min(4 + stage - 1, 6)
    const shuffledYokai = [...allYokai].sort(() => Math.random() - 0.5).slice(0, pairsCount)
    const gameCards = [...shuffledYokai, ...shuffledYokai]
      .sort(() => Math.random() - 0.5)
      .map((yokai, index) => ({
        ...yokai,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(gameCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setShowConfetti(false)
    setShowCelebration(false)
  }, [stage])

  useEffect(() => {
    shuffleCards()
  }, [shuffleCards, stage])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].isMatched) return

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    )

    setFlippedCards(prev => [...prev, id])
    setMoves(prev => prev + 1)
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      if (cards[first].type === cards[second].type) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === first || card.id === second ? { ...card, isMatched: true } : card
          )
        )
        setMatchedPairs(prev => prev + 1)
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first || card.id === second ? { ...card, isFlipped: false } : card
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      setShowConfetti(true)
      setShowCelebration(true)
      setTimeout(() => {
        setShowConfetti(false)
        setShowCelebration(false)
        setStage(prev => prev + 1)
      }, 5000)
    }
  }, [matchedPairs, cards.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-indigo-200 p-4 sm:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-indigo-800 relative">
        <Sparkles className="absolute -left-4 sm:-left-8 top-1/2 -translate-y-1/2 text-yellow-400" />
        妖怪メモリーゲーム
        <Sparkles className="absolute -right-4 sm:-right-8 top-1/2 -translate-y-1/2 text-yellow-400" />
      </h1>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 sm:p-8 max-w-4xl mx-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-indigo-800">ステージ: {stage}</div>
          <div className="text-xl font-bold text-indigo-800">マッチした数: {matchedPairs}</div>
          <div className="text-xl font-bold text-indigo-800">移動回数: {moves}</div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <motion.div
              key={card.id}
              className={`aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer ${
                card.isFlipped || card.isMatched ? '' : 'bg-indigo-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
            >
              <AnimatePresence>
                {(card.isFlipped || card.isMatched) && (
                  <motion.img
                    src={`${baseImageUrl}/${card.imagePath}`}
                    alt={card.type}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        {[...Array(3)].map((_, i) => (
          <Star key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400 mx-1" />
        ))}
      </div>

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
              <p className="text-2xl text-gray-700 mb-6">ステージ {stage} クリア！</p>
              <div className="flex justify-center space-x-4">
                {cards.filter(card => card.isMatched).map((card) => (
                  <motion.div
                    key={card.id}
                    animate={{
                      y: [0, -20, 0],
                      transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
                    }}
                  >
                    <img src={`${baseImageUrl}/${card.imagePath}`} alt={card.type} className="w-16 h-16 object-contain" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Link href="/" className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-colors">
        ゲーム選択に戻る
      </Link>
    </div>
  )
}

