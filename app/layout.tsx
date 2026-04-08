import type { Metadata, Viewport } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GhostAuthProvider } from '@/lib/useGhostAuth'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: '//GHOST_PROTOCOL_CHAT',
  description: 'A privacy-first, anonymous, ephemeral chat web app.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Good for mobile apps to prevent zooming on inputs
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-background font-body text-on-background antialiased selection:bg-primary/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <GhostAuthProvider>
            {children}
          </GhostAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
