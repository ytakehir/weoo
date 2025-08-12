'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type MissionRow = Database['public']['Tables']['missions']['Row']
type MissionInsert = Database['public']['Tables']['missions']['Insert']
type MissionUpdate = Database['public']['Tables']['missions']['Update']
type MissionSubmissionsRow = Database['public']['Tables']['mission_submissions']['Row']
type MissionSubmissionsInsert = Database['public']['Tables']['mission_submissions']['Insert']

// 全件取得（ページネーションあり）
export const getMissions = async (page = 1, limit = 20): Promise<MissionRow[]> => {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return data ?? []
}

// ID指定で取得
export const getMissionById = async (id: string): Promise<MissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('missions').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw error
  }
  return data ?? null
}

// 使用中のミッション取得（used_at が null でない最新の1件）
export const getLatestUsedMission = async (): Promise<MissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .not('used_at', 'is', null)
    .order('used_at', { ascending: false, nullsFirst: false })

  if (error) throw error
  if (!data || data.length === 0) return null
  return data[0]
}

// 作成
export const createMission = async (title: string): Promise<MissionRow> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('missions')
    .insert({ title } as MissionInsert)
    .select()
    .single()

  if (error) throw error
  return data
}

// 作成
export const createMissionSubmissions = async (titleRaw: string): Promise<MissionSubmissionsRow> => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('mission_submissions')
    .insert({ title_raw: titleRaw, created_by: user?.id } as MissionSubmissionsInsert)
    .select()
    .single()

  if (error) throw error
  return data
}

// 更新
export const updateMission = async (id: string, updates: MissionUpdate): Promise<MissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('missions').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data ?? null
}

// 削除
export const deleteMission = async (id: string): Promise<boolean> => {
  const supabase = await createClient()
  const { error } = await supabase.from('missions').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function getOrPickTodayMission(): Promise<MissionRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('pick_today_mission_jst')
  if (error) {
    console.error('[pick_today_mission_jst]', error)
    return null
  }
  return data as MissionRow
}
