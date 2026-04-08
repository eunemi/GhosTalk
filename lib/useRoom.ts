'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from './supabaseClient'
import { useGhostAuth } from './useGhostAuth'

export interface Message {
  id: string
  content: string
  room_id: string
  sender_name: string
  created_at: string
}

export function useRoom(room_id: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const { ghostName, user } = useGhostAuth()
  
  // Use a stable reference to avoid useEffect looping, though in React createClient in a component can sometimes recreate the client.
  // We'll init it once per hook mount.
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let mounted = true

    async function loadHistory() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room_id)
        .order('created_at', { ascending: true })
        .limit(100) // 100 for a bit more buffer
        
      if (data && mounted) {
        setMessages(data)
      }
      if (mounted) setLoading(false)
    }

    loadHistory()

    const channel = supabase.channel(`room:${room_id}`)

    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        if (mounted) {
          // Prevent duplicates by checking if the ID already exists
          setMessages(prev => {
            if (prev.some(m => m.id === payload.id)) return prev
            return [...prev, payload]
          })
        }
      })
      .subscribe((status) => {
        if (mounted) setConnected(status === 'SUBSCRIBED')
      })

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [room_id, supabase])

  const sendMessage = useCallback(async (content: string) => {
    if (!ghostName || !user || !content.trim()) return

    const newMessage: Message = {
      // Use crypto UUID so broadcast payload matches DB insert exactly
      id: crypto.randomUUID(),
      content: content.trim(),
      room_id,
      sender_name: ghostName,
      created_at: new Date().toISOString()
    }

    // Optimistically update local state so the sender sees it instantly
    setMessages(prev => [...prev, newMessage])

    // Broadcast to others on the ephemeral layer for zero-latency delivery
    const channel = supabase.channel(`room:${room_id}`)
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage
    })

    // Store in Postgres so late joiners can see history
    await supabase.from('messages').insert({
      id: newMessage.id,
      content: newMessage.content,
      room_id: newMessage.room_id,
      sender_name: newMessage.sender_name,
      // let Supabase set created_at or we can pass ours
    })
  }, [ghostName, room_id, supabase, user])

  return { messages, connected, loading, sendMessage }
}
