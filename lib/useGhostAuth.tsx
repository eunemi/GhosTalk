'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabaseClient'
import { User } from '@supabase/supabase-js'

interface GhostAuthContextType {
  user: User | null
  ghostName: string | null
  loading: boolean
  error: Error | null
}

const GhostAuthContext = createContext<GhostAuthContextType>({
  user: null,
  ghostName: null,
  loading: true,
  error: null,
})

export function GhostAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ghostName, setGhostName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Stable client — created exactly once to prevent infinite re-render loop
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        let currentUser: User | null | undefined = session?.user

        if (!currentUser) {
          const { data, error: signInError } = await supabase.auth.signInAnonymously()
          if (signInError) throw signInError
          currentUser = data.user
        }

        if (!currentUser) throw new Error('Failed to create or retrieve user session')

        let currentGhostName = currentUser.user_metadata?.ghost_name

        if (!currentGhostName) {
          const adjectives = ["Vigilant", "Silent", "Phantom", "Cursed", "Neon", "Hollow", "Drifting", "Velvet"]
          const animals = ["Firefly", "Armadillo", "Pangolin", "Axolotl", "Mantis", "Wombat", "Capybara", "Narwhal"]
          
          // Deterministic seed based on first 4 chars of user id
          const seedHex = currentUser.id.substring(0, 4)
          const seedInt = parseInt(seedHex, 16)
          
          const adjIndex = seedInt % adjectives.length
          const animIndex = (seedInt * 13) % animals.length
          
          currentGhostName = `${adjectives[adjIndex]}-${animals[animIndex]}`

          const { error: updateError } = await supabase.auth.updateUser({
            data: { ghost_name: currentGhostName }
          })

          if (updateError) throw updateError
        }

        if (mounted) {
          setUser(currentUser)
          setGhostName(currentGhostName)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [supabase])

  return (
    <GhostAuthContext.Provider value={{ user, ghostName, loading, error }}>
      {children}
    </GhostAuthContext.Provider>
  )
}

export function useGhostAuth() {
  return useContext(GhostAuthContext)
}
