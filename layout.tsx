import { Zen_Maru_Gothic } from 'next/font/google'
import './globals.css'

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
})

export const metadata = {
  title: '妖怪ゲームワールド',
  description: '楽しい妖怪ゲームで遊ぼう！',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={zenMaruGothic.variable}>
      <body>{children}</body>
    </html>
  )
}

