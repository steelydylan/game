"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const games = [
  { name: '妖怪マッチングゲーム', path: '/matching-game', color: 'from-purple-400 to-blue-500' },
  { name: '妖怪メモリーゲーム', path: '/memory-game', color: 'from-pink-400 to-red-500' },
  { name: '妖怪パズルゲーム', path: '/puzzle-game', color: 'from-yellow-400 to-green-500' },
]

export default function GameSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8 text-indigo-800 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sparkles className="absolute -left-8 top-1/2 -translate-y-1/2 text-yellow-400" />
        妖怪ゲームワールド
        <Sparkles className="absolute -right-8 top-1/2 -translate-y-1/2 text-yellow-400" />
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {games.map((game, index) => (
          <motion.div
            key={game.path}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Link href={game.path}>
              <motion.div 
                className={`w-64 h-64 rounded-2xl shadow-lg overflow-hidden cursor-pointer bg-gradient-to-br ${game.color}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold text-center p-4">
                  {game.name}
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

