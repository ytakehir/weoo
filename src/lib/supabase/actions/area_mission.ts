'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type AreaMissionRow = Database['public']['Tables']['missions']['Row']
type AreaMissionInsert = Database['public']['Tables']['missions']['Insert']
type AreaMissionUpdate = Database['public']['Tables']['missions']['Update']

// 全件取得
export const getAreaMissions = async (): Promise<AreaMissionRow[]> => {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('kind', 'area')
    .lte('publish_start_at', now) // 開始 <= now
    .gte('publish_end_at', now) // 終了 >= now
    .order('publish_start_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// 作成
export const createAreaMission = async (title: string): Promise<AreaMissionRow> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('missions')
    .insert({ title, kind: 'area' } as AreaMissionInsert)
    .select()
    .single()

  if (error) throw error
  return data
}

// 更新
export const updateAreaMission = async (id: string, updates: AreaMissionUpdate): Promise<AreaMissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('missions').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data ?? null
}

// 削除
export const deleteAreaMission = async (id: string): Promise<boolean> => {
  const supabase = await createClient()
  const { error } = await supabase.from('missions').delete().eq('id', id)
  if (error) throw error
  return true
}
