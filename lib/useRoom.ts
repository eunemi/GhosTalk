'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from './supabaseClient'
import { useGhostAuth } from './useGhostAuth'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Message {
  id: string
  content: string
  room_id: string
  sender_name: string
  created_at: string
}

const MAX_MESSAGE_LENGTH = 500
const RATE_LIMIT_MS = 500

export function useRoom(room_id: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { ghostName, user } = useGhostAuth()

  // Stable supabase client — created exactly once per hook mount
  const [supabase] = useState(() => createClient())

  // Store channel in a ref so sendMessage can reuse the SAME subscribed channel
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Rate limiting: track last send timestamp
  const lastSendRef = useRef<number>(0)

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      try {
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', room_id)
          .order('created_at', { ascending: true })
          .limit(100)

        if (fetchError) throw fetchError
        if (data && mounted) {
          setMessages(data)
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Failed to load messages')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadHistory()

    const channel = supabase.channel(`room:${room_id}`)
    channelRef.current = channel

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (mounted) {
          setMessages(prev => {
            // Prevent duplicates (from optimistic update + broadcast echo)
            if (prev.some(m => m.id === payload.id)) return prev
            return [...prev, payload]
          })
        }
      })
      .subscribe((status) => {
        if (mounted) {
          setConnected(status === 'SUBSCRIBED')
          if (status === 'CHANNEL_ERROR') {
            setError('Connection lost. Trying to reconnect...')
          }
        }
      })

    return () => {
      mounted = false
      channelRef.current = null
      supabase.removeChannel(channel)
    }
  }, [room_id, supabase])

  const sendMessage = useCallback(async (content: string) => {
    if (!ghostName || !user) return
    
    const trimmed = content.trim()
    if (!trimmed) return

    // Rate limiting — block if sending too fast
    const now = Date.now()
    if (now - lastSendRef.current < RATE_LIMIT_MS) {
      setError('Slow down ghost! Wait a moment before sending again.')
      setTimeout(() => setError(null), 1500)
      return
    }
    lastSendRef.current = now

    // Truncate to max length
    const sanitized = trimmed.slice(0, MAX_MESSAGE_LENGTH)

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: sanitized,
      room_id,
      sender_name: ghostName,
      created_at: new Date().toISOString()
    }

    // Optimistically update local state so sender sees it instantly
    setMessages(prev => [...prev, newMessage])
    setError(null)

    // Broadcast to others via the SAME subscribed channel
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'message',
        payload: newMessage
      })
    }

    // Persist to DB for late joiners
    try {
      const { error: insertError } = await supabase.from('messages').insert({
        id: newMessage.id,
        content: newMessage.content,
        room_id: newMessage.room_id,
        sender_name: newMessage.sender_name,
      })
      if (insertError) throw insertError
    } catch {
      setError('Message may not have been saved. Try again.')
      setTimeout(() => setError(null), 3000)
    }
  }, [ghostName, room_id, supabase, user])

  const clearError = useCallback(() => setError(null), [])

  return { messages, connected, loading, error, sendMessage, clearError, MAX_MESSAGE_LENGTH }
}
