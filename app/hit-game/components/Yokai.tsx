import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface YokaiProps {
  isActive: boolean
  isHit: boolean
  onHit: () => void
  imagePath: string
  color: string
}

export const Yokai: React.FC<YokaiProps> = ({ isActive, isHit, onHit, imagePath, color }) => {
  const baseImageUrl = 'https://pub-b0a13c9ab7ec4974bfbfe83ef043063b.r2.dev'
  const [showYokai, setShowYokai] = useState(isActive)
  const [isFlying, setIsFlying] = useState(false)

  useEffect(() => {
    if (isActive) {
      setShowYokai(true)
      setIsFlying(false)
    } else {
      if (isHit) {
        setIsFlying(true)
        setTimeout(() => setShowYokai(false), 500)
      } else {
        setShowYokai(false)
      }
    }
  }, [isActive, isHit])

  const handleHit = () => {
    if (isActive && !isFlying) {
      onHit()
    }
  }

  const flyingAnimation = {
    x: Math.random() > 0.5 ? [0, 150] : [0, -150],
    y: [-50, -150],
    rotate: Math.random() > 0.5 ? [0, 720] : [0, -720],
    scale: [1, 0.5],
  }

  return (
    <div 
      className={`w-full h-full rounded-full overflow-hidden cursor-pointer relative shadow-inner transition-colors duration-300 ${
        isHit ? 'bg-green-500' : 'bg-amber-700'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-amber-600 to-transparent"></div>
      <AnimatePresence>
        {showYokai && (
          <motion.div
            className={`w-full h-full absolute bottom-0 flex items-end justify-center ${color}`}
            initial={{ y: "100%" }}
            animate={isFlying ? flyingAnimation : { y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={handleHit}
          >
            <img 
              src={`${baseImageUrl}/${imagePath}`} 
              alt="妖怪" 
              className="w-3/4 h-3/4 object-contain mb-2"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

