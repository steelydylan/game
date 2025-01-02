import { useState, useEffect } from 'react'
import { Yokai } from './Yokai'

interface GameBoardProps {
  holeCount: number
  activeYokai: number | null
  onHit: (index: number) => void
  yokaiList: Array<{ id: number; type: string; imagePath: string; color: string }>
}

export const GameBoard: React.FC<GameBoardProps> = ({ holeCount, activeYokai, onHit, yokaiList }) => {
  const [hitYokai, setHitYokai] = useState<number | null>(null)

  useEffect(() => {
    if (hitYokai !== null) {
      const timer = setTimeout(() => setHitYokai(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [hitYokai])

  const handleHit = (index: number) => {
    if (index === activeYokai) {
      setHitYokai(index)
      onHit(index)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 bg-green-300 p-4 rounded-lg shadow-lg">
      {Array.from({ length: holeCount }).map((_, index) => {
        const yokai = yokaiList[index % yokaiList.length]
        return (
          <div key={index} className={`aspect-square bg-green-400 rounded-full p-2 shadow-inner ${index === hitYokai ? '' : 'overflow-hidden'}`}>
            <Yokai
              isActive={index === activeYokai}
              isHit={index === hitYokai}
              onHit={() => handleHit(index)}
              imagePath={yokai.imagePath}
              color={yokai.color}
            />
          </div>
        )
      })}
    </div>
  )
}

