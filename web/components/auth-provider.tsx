"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
      // Re-fetch session if window is focused
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}
