'use client'
import { createContext, useContext } from 'react'
import type { Viewer } from '@/types/viewer'

const ViewerContext = createContext<Viewer | null>(null)

export function ViewerProvider({ initial, children }: { initial: Viewer; children: React.ReactNode }) {
  return <ViewerContext value={initial}>{children}</ViewerContext>
}

export function useViewer(): Viewer {
  const ctx = useContext(ViewerContext)
  if (!ctx) {
    return { user: null, profile: null, isSubscription: false, freeTrail: { isActive: false, endDate: new Date() } }
  }
  return ctx
}
