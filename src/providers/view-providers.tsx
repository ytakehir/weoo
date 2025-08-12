'use client'
import type { User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import type { ProfileRow } from '@/lib/supabase/actions/profile'

export type ViewerContextValue = {
  user: User | null
  profile: ProfileRow | null
  isSubscription: boolean
}

const ViewerContext = createContext<ViewerContextValue | null>(null)

export function ViewerProvider({ initial, children }: { initial: ViewerContextValue; children: React.ReactNode }) {
  return <ViewerContext value={initial}>{children}</ViewerContext>
}

export function useViewer() {
  const ctx = useContext(ViewerContext)
  if (!ctx) {
    return { user: null, profile: null, isSubscription: false }
  }
  return ctx
}
