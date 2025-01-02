import { useDrop } from 'react-dnd'
import { motion } from 'framer-motion'

interface DropZoneProps {
  type: string
  imagePath: string
  color: string
  onDrop: () => void
  isMatched: boolean
}

export default function DropZone({ type, imagePath, color, onDrop, isMatched }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'yokai',
    drop: (item: { type: string }) => {
      if (item.type === type) {
        onDrop()
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <motion.div
      ref={drop}
      initial={{ scale: 1 }}
      animate={{ scale: isOver ? 1.1 : 1 }}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
        rounded-2xl border-4 border-dashed
        ${isOver ? 'border-green-500 bg-green-100' : 'border-gray-400'}
        ${isMatched ? 'border-solid border-green-500 bg-green-100' : 'bg-white/50'}
        transition-all duration-200
      `}
    >
      {isMatched ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-2xl sm:text-3xl"
        >
          ✨
        </motion.div>
      ) : (
        <img src={imagePath} alt={type} className="w-full h-full object-contain opacity-30 p-2" />
      )}
    </motion.div>
  )
}

