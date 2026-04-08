'use client'

import { useState, useRef, useEffect } from 'react'
import { useRoom } from '@/lib/useRoom'
import { useGhostAuth } from '@/lib/useGhostAuth'

export function ClientRoom({ room_id }: { room_id: string }) {
  const { messages, connected, loading, sendMessage } = useRoom(room_id)
  const { ghostName, loading: authLoading } = useGhostAuth()
  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    await sendMessage(content)
    setContent('')
  }

  if (authLoading || loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  return (
    <div className="flex h-screen flex-col bg-background text-foreground container mx-auto max-w-2xl">
      <div className="border-b border-border/40 p-4 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Room: {room_id}</h1>
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {connected ? 'Connected live' : 'Reconnecting...'}
          </div>
        </div>
        <div className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
          {ghostName}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">No messages yet. Be the first!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_name === ghostName
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-muted-foreground mb-1 ml-1">{msg.sender_name}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                  isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-muted-foreground rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border/40 shrink-0 mb-4 md:mb-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-secondary text-secondary-foreground rounded-full px-4 py-3 placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            placeholder="Whisper to the void..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
