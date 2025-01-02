"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Cloud } from 'lucide-react'

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

const getRandomYokai = () => {
  return allYokai[Math.floor(Math.random() * allYokai.length)]
}

const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const collisionDetection = (rect1: DOMRect, rect2: DOMRect) => {
    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    )
}

type Enemy = {
  id: number
  type: string
  imagePath: string
  x: number
};

type CloudType = {
  id: number
  x: number
  y: number
  size: number
  speed: number
};

const CloudComponent: React.FC<CloudType> = ({ x, y, size, speed }) => {
  return (
    <motion.div
      className="absolute"
      style={{ x, y }}
      initial={{ x: "100%" }}
      animate={{ x }}
      transition={{ duration: 0, ease: "linear" }}
    >
      <Cloud 
        size={size} 
        className="text-white opacity-70" 
        style={{ filter: `blur(${Math.random()}px)` }}
      />
    </motion.div>
  )
}

export default function YokaiJumpGame() {
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [clouds, setClouds] = useState<CloudType[]>([])
  const [playerY, setPlayerY] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isColliding, setIsColliding] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const playerVyRef = useRef(0)
  const playerYRef = useRef(0)
  const playerRef = useRef<HTMLDivElement>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spawnEnemy = () => {
      if (!gameOver) {
        setEnemies((prevEnemies) => {
          const newEnemies = [...prevEnemies]
          const newYokai = getRandomYokai()
          newEnemies.push({
            id: Date.now(),
            type: newYokai.type,
            imagePath: newYokai.imagePath,
            x: gameAreaRef.current?.clientWidth || window.innerWidth,
          });
          return newEnemies
        })
      }
      setTimeout(spawnEnemy, getRandom(7000, 10000))
    };

    spawnEnemy();
    return () => {};
  }, [gameOver]);

  useEffect(() => {
    const spawnCloud = () => {
      if (!gameOver) {
        setClouds((prevClouds) => {
          const newClouds = [...prevClouds]
          newClouds.push({
            id: Date.now(),
            x: gameAreaRef.current?.clientWidth || window.innerWidth,
            y: Math.random() * (gameAreaRef.current?.clientHeight || window.innerHeight * 0.8),
            size: 24 + Math.random() * 48,
            speed: 1 + Math.random() * 2,
          });
          return newClouds
        })
      }
      setTimeout(spawnCloud, getRandom(5000, 10000))
    };

    spawnCloud();
    return () => {};
  }, [gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        setEnemies((prevEnemies) =>
          prevEnemies
            .map((enemy) => ({ ...enemy, x: enemy.x - 12 }))
            .filter((enemy) => enemy.x > -50)
        );

        setClouds((prevClouds) =>
          prevClouds
            .map((cloud) => ({ ...cloud, x: cloud.x - cloud.speed }))
            .filter((cloud) => cloud.x > -cloud.size)
        );

        setScore((prevScore) => prevScore + 1);

        const playerRect = playerRef.current?.getBoundingClientRect()

        if (playerRect) {
          enemies.forEach((enemy) => {
            const enemyElement = document.getElementById(`enemy-${enemy.id}`)
            if (enemyElement) {
              const enemyRect = enemyElement.getBoundingClientRect()
              if (collisionDetection(playerRect, enemyRect)) {
                setIsColliding(true)
                setTimeout(() => {
                  setGameOver(true)
                  setTimeout(() => setShowGameOver(true), 1000)
                }, 1000)
              }
            }
          })
        }
      }
    }, 50)

    return () => clearInterval(gameLoop)
  }, [enemies, gameOver])

  const handleTouch = () => {
    if (!gameOver && !isColliding) {
      playerVyRef.current = 15
      const interval = setInterval(() => {
        const gravity = 0.5

        const playerNewY = playerYRef.current - playerVyRef.current
        playerVyRef.current -= gravity

        if (playerNewY > 0) {
          playerVyRef.current = 0
          playerYRef.current = 0
          setPlayerY(0)
          clearInterval(interval)
        } else {
          playerYRef.current = playerNewY
          setPlayerY(playerNewY)
        }
      }, 16)
    }
  }

  const resetGame = () => {
    setEnemies([])
    setClouds([])
    setScore(0)
    setGameOver(false)
    setShowGameOver(false)
    setIsColliding(false)
    setPlayerY(0)
    playerYRef.current = 0
    playerVyRef.current = 0
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-purple-800">妖怪ジャンプ</h1>
      <div 
        ref={gameAreaRef}
        className="max-w-xl w-full h-[50vh] relative overflow-hidden border-4 border-purple-500 rounded-lg shadow-lg"
        onTouchStart={handleTouch} 
        onClick={handleTouch}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-400" />
        {clouds.map((cloud) => (
          <CloudComponent key={cloud.id} {...cloud} />
        ))}
        <motion.div 
          ref={playerRef}
          className="absolute left-10 bottom-0 w-12 h-12 bg-yellow-400 rounded-full z-10"
          animate={{ 
            y: playerY,
            scale: isColliding ? [1, 1.2, 0.8, 1] : 1,
            rotate: isColliding ? [0, -10, 10, 0] : 0,
          }}
          transition={{ 
            y: { type: "spring", stiffness: 500, damping: 30 },
            scale: { duration: 0.5 },
            rotate: { duration: 0.5 },
          }}
        >
          <div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute bottom-3 left-4 w-4 h-1 bg-red-500 rounded-full"></div>
        </motion.div>
        {enemies.map((enemy) => (
          <motion.div 
            key={enemy.id}
            id={`enemy-${enemy.id}`}
            className="absolute bottom-0 w-12 h-12 z-10"
            initial={{ x: enemy.x }}
            animate={{ x: enemy.x }}
            transition={{ type: "linear" }}
          >
            <img src={`${baseImageUrl}/${enemy.imagePath}`} alt={enemy.type} className="w-full h-full object-contain" />
          </motion.div>
        ))}
        {showGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          >
            <div className="bg-white p-4 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-2">ゲームオーバー</h2>
              <p className="mb-4">スコア: {score}</p>
              <button 
                onClick={resetGame}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                もう一度遊ぶ
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <div className="mt-4 text-2xl font-bold text-purple-800">スコア: {score}</div>
    </div>
  )
}

