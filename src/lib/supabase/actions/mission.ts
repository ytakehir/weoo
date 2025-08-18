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

function getWeekStartUtc(d = new Date()): Date {
  // 月曜始まりの週の月曜 00:00 (UTC) を求める
  const day = d.getUTCDay()
  const diffToMon = (day + 6) % 7
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  monday.setUTCDate(monday.getUTCDate() - diffToMon)
  // 00:00:00.000 UTC に揃える
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export const getWeekMissions = async (): Promise<MissionRow[]> => {
  const supabase = await createClient()
  const start = getWeekStartUtc()
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 7)

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .not('used_at', 'is', null)
    .gte('used_at', start.toISOString())
    .lt('used_at', end.toISOString())
    .order('used_at', { ascending: false })

  if (error) throw error
  return data ?? []
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

export const getOrPickTodayMission = async (): Promise<MissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('pick_today_mission_jst')
  if (error) {
    console.error('[pick_today_mission_jst]', error)
    return null
  }
  return data as MissionRow
}
