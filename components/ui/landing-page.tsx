'use client'

import { useState } from 'react'
import {
  IoChatbubblesOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5'

interface LandingPageProps {
  onEnter: () => void
  ghostName: string
}

export default function LandingPage({ onEnter, ghostName }: LandingPageProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="animate-fadeInUp min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-[0_20px_50px_rgba(0,101,144,0.05)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👻</span>
          <span className="text-xl font-bold text-gray-800 font-headline tracking-tight">GhosTalk</span>
        </div>
        <div className="text-xs text-gray-400 font-mono hidden sm:block">
          Anonymous chat, zero identity required
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-16 space-y-6">

        {/* Ghost icon animated */}
        <div className="text-8xl animate-bounce">👻</div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-tight font-headline">
          Speak Freely.
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Disappear Completely.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-500 max-w-md leading-relaxed font-body">
          Anonymous rooms. No sign-up. No tracking.
          Messages vanish in 4 hours. Just pure,
          judgment-free conversation.
        </p>

        {/* Ghost Identity pill */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-full px-5 py-2 flex items-center gap-2 shadow-sm">
          <span className="text-sm">👻</span>
          <span className="text-sm font-mono text-gray-600">
            Your identity:
          </span>
          <span className="text-sm font-bold text-purple-600 font-mono">
            {ghostName || 'GENERATING...'}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="group relative mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-purple-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
        >
          <IoChatbubblesOutline className="text-2xl" />
          Enter a Room
          <IoArrowForwardOutline
            className={`text-xl transition-transform duration-300 ${hovered ? 'translate-x-1' : ''}`}
          />
        </button>

        <p className="text-xs text-gray-400">
          No account needed — you are already anonymous
        </p>

      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16 w-full px-4">

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/40 hover:scale-105 transition-all duration-300 shadow-sm">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-bold text-gray-800 mb-2 font-headline">100% Anonymous</h3>
          <p className="text-sm text-gray-500 font-body">
            No sign-up, no email, no phone.
            You get a ghost identity instantly.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/40 hover:scale-105 transition-all duration-300 shadow-sm">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-gray-800 mb-2 font-headline">Real-time Chat</h3>
          <p className="text-sm text-gray-500 font-body">
            Messages appear instantly via
            WebSockets. No refresh needed.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/40 hover:scale-105 transition-all duration-300 shadow-sm">
          <div className="text-4xl mb-3">💨</div>
          <h3 className="font-bold text-gray-800 mb-2 font-headline">Auto Vanish</h3>
          <p className="text-sm text-gray-500 font-body">
            All messages self-destruct
            after 4 hours. No traces left.
          </p>
        </div>

      </div>

      {/* Bottom tagline */}
      <div className="mt-16 mb-8 text-center">
        <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
          KEEP IT ANONYMOUS • MESSAGES VANISH IN 4 HOURS
        </p>
      </div>

    </div>
  )
}
