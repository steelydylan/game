import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import Confetti from 'react-confetti'

interface ScoreDialogProps {
  score: number
  highScore: number
  onClose: () => void
}

export const ScoreDialog: React.FC<ScoreDialogProps> = ({ score, highScore, onClose }) => {
  const [windowSize, setWindowSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  return (
    <DialogPrimitive.Root open={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md">
          <Confetti width={windowSize.width} height={windowSize.height} />
          <h2 className="text-2xl font-bold text-center mb-4">ゲーム終了！</h2>
          <p className="text-xl text-center mb-2">あなたのスコア: <span className="font-bold text-purple-600">{score}</span></p>
          <p className="text-lg text-center mb-4">ハイスコア: <span className="font-bold text-green-600">{highScore}</span></p>
          <div className="flex justify-center">
            <Button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-lg transition-all duration-200 transform hover:scale-105">
              もう一度遊ぶ
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

