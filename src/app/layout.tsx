import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })
const notoSansThai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--font-noto-thai' })

export const metadata: Metadata = {
  title: 'midori — Waste Bank Platform',
  description:
    'Turn your recyclables into digital rewards. Midori is a serene, eco-tech waste bank platform for residents and collectors.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'midori',
  },
  icons: '/favicon.ico',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FBFBFA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light bg-[#FBFBFA] ${jakarta.variable} ${jetbrainsMono.variable} ${notoSansThai.variable}`}
    >
      <body className="antialiased font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
