import { useDragLayer } from 'react-dnd'
import { useEffect, useState } from 'react'

interface DragLayerProps {
  yokai: Array<{
    id: number
    type: string
    imagePath: string
    color: string
  }>
}

export function DragLayer({ yokai }: DragLayerProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const { itemType, isDragging, item, initialOffset, currentOffset, clientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isDragging) {
    return null
  }

  const { x, y } = calculateItemPosition(item, initialOffset, currentOffset, clientOffset)

  return (
    <div style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%'
    }}>
      <div style={{
        position: 'absolute',
        left: x,
        top: y,
        willChange: 'transform'
      }}>
        {itemType === 'yokai' && (
          <PreviewYokai id={item.id} imagePath={item.imagePath} type={item.type} yokai={yokai} />
        )}
      </div>
    </div>
  )
}

function calculateItemPosition(
  item: any,
  initialOffset: { x: number, y: number } | null,
  currentOffset: { x: number, y: number } | null,
  clientOffset: { x: number, y: number } | null
) {
  if (!initialOffset || !currentOffset || !clientOffset || !item.clientOffset || !item.initialOffset) {
    return { x: 0, y: 0 }
  }

  const dx = clientOffset.x - item.clientOffset.x
  const dy = clientOffset.y - item.clientOffset.y

  return {
    x: item.initialOffset.x + dx,
    y: item.initialOffset.y + dy
  }
}

function PreviewYokai({ id, imagePath, type, yokai }: { id: number, imagePath: string, type: string, yokai: DragLayerProps['yokai'] }) {
  const yokaiItem = yokai.find(y => y.id === id)
  if (!yokaiItem) return null

  return (
    <div className={`
      w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center
      ${yokaiItem.color} bg-white rounded-2xl shadow-lg
      border-4 border-${yokaiItem.color.replace('text-', '')}
    `}>
      <img src={imagePath} alt={type} className="w-full h-full object-contain p-2" draggable="false" />
    </div>
  )
}

