'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Link2, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRoom } from '@/lib/useRoom'
import { useGhostAuth } from '@/lib/useGhostAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GhostIdentityBadge } from '@/components/GhostIdentityBadge'

export function ClientRoom({ room_id }: { room_id: string }) {
  const router = useRouter()
  const { messages, connected, loading, error, sendMessage, clearError, MAX_MESSAGE_LENGTH } = useRoom(room_id)
  const { ghostName, loading: authLoading } = useGhostAuth()
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-dismiss error after 3s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    await sendMessage(content)
    setContent('')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      setCopied(false)
    }
  }

  const charsRemaining = MAX_MESSAGE_LENGTH - content.length

  if (authLoading || loading) {
    return (
      <div className="flex bg-zinc-950 h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-bounce">👻</div>
          <div className="animate-pulse text-zinc-500 font-medium tracking-widest uppercase text-sm">
            Entering the void...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 max-w-3xl mx-auto border-x border-zinc-900/50 shadow-2xl relative">
      {/* Error Toast */}
      {error && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-rose-950/90 border border-rose-800/50 text-rose-200 text-sm px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
            {error}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md p-4 shrink-0 flex items-center justify-between sticky top-0 z-10 w-full">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-zinc-100 truncate max-w-[120px] sm:max-w-xs">{room_id}</h1>
              <Badge variant="outline" className={`text-[10px] ${connected ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'}`}>
                {connected ? '● Live' : '○ Offline'}
              </Badge>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Messages vanish after 4 hours
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full h-9 w-9"
            title="Copy room link"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Link2 className="h-4 w-4" />}
          </Button>
          <div className="hidden sm:block">
            <GhostIdentityBadge />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
            <div className="text-5xl animate-pulse">👻</div>
            <p className="text-zinc-400 text-sm">No messages yet...<br/>be the first ghost to speak!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_name === ghostName
            const showName = index === 0 || messages[index - 1].sender_name !== msg.sender_name

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${showName ? 'mt-5' : 'mt-1'}`}>
                {showName && (
                  <span className={`text-[10px] font-semibold tracking-wider uppercase mb-1 ${isMe ? 'text-zinc-500 mr-1' : 'text-zinc-400 ml-1'}`}>
                    {isMe ? 'You' : msg.sender_name}
                  </span>
                )}
                <div className="flex flex-col max-w-[85%] sm:max-w-[75%]">
                  <div className={`px-4 py-2.5 shadow-sm text-[15px] leading-relaxed ${
                    isMe
                      ? 'bg-violet-900 border border-violet-800/50 text-violet-50 rounded-2xl rounded-tr-sm'
                      : 'bg-zinc-800 border border-zinc-700/50 text-zinc-200 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                  <span className={`text-[10px] text-zinc-600 mt-1 block ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                    {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : 'just now'}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800/60 shrink-0">
        <form onSubmit={handleSend} className="flex gap-3 relative max-w-full">
          <Input
            type="text"
            className="flex-1 bg-zinc-900 border-zinc-800 text-zinc-100 rounded-full pl-5 pr-14 py-6 focus-visible:ring-violet-500/50 text-base shadow-inner"
            placeholder="Whisper to the void..."
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            disabled={!connected}
            autoComplete="off"
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <Button
            type="submit"
            disabled={!content.trim() || !connected}
            size="icon"
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
          </Button>
        </form>
        {/* Character counter — only shows when typing */}
        {content.length > 0 && (
          <div className={`text-[10px] text-right mt-1 mr-2 transition-colors ${charsRemaining < 50 ? 'text-amber-500' : charsRemaining < 10 ? 'text-rose-400' : 'text-zinc-600'}`}>
            {charsRemaining} characters remaining
          </div>
        )}
      </div>
    </div>
  )
}
