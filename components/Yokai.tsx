import { useDrag } from 'react-dnd'
import { useRef } from 'react'
import { motion } from 'framer-motion'

interface YokaiProps {
  id: number
  type: string
  imagePath: string
  color: string
  isMatched: boolean
}

export default function Yokai({ id, type, imagePath, color, isMatched }: YokaiProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'yokai',
    item: (monitor) => {
      const element = ref.current
      if (!element) {
        return { id, type, imagePath }
      }
      const { left, top, width, height } = element.getBoundingClientRect()
      const { x, y } = monitor.getClientOffset() || { x: 0, y: 0 }
      return { 
        id, 
        type, 
        imagePath, 
        initialOffset: { x: left, y: top },
        clientOffset: { x, y },
        size: { width, height }
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, type, imagePath])

  if (isMatched) {
    return null
  }

  return (
    <motion.div
      ref={(node) => {
        // @ts-expect-error
        ref.current = node
        drag(node)
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
        ${color} ${isDragging ? 'opacity-50' : ''}
        bg-white rounded-2xl shadow-lg
        cursor-grab active:cursor-grabbing
        border-4 border-${color.replace('text-', '')}
      `}
    >
      <img 
        src={imagePath} 
        alt={type} 
        className="w-full h-full object-contain p-2" 
        draggable="false" 
      />
    </motion.div>
  )
}

