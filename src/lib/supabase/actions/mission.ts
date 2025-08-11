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

const startOfUTCToday = () => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}
const endOfUTCToday = () => {
  const d = new Date()
  d.setUTCHours(23, 59, 59, 999)
  return d
}

export async function getTodayMissionUTC(): Promise<MissionRow | null> {
  const supabase = await createClient()
  const from = startOfUTCToday().toISOString()
  const to = endOfUTCToday().toISOString()

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .gte('used_at', from)
    .lte('used_at', to)
    .order('used_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('[getTodayMissionUTC]', error)
    return null
  }
  return data?.[0] ?? null
}

export async function getOrPickTodayMission(): Promise<MissionRow | null> {
  const supabase = await createClient()

  // まず当日分（JST）を読むだけ
  const today = await getTodayMissionUTC()
  if (today) return today

  // 候補取得: 未使用 or 2ヶ月以上前
  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)
  const twoMonthsAgoISO = twoMonthsAgo.toISOString()

  // 未使用
  const { data: unused, error: unusedErr } = await supabase.from('missions').select('*').is('used_at', null)

  if (unusedErr) {
    console.error('[getOrPickTodayMission][unused]', unusedErr)
  }
  if (unused && unused.length > 0) {
    const picked = unused[Math.floor(Math.random() * unused.length)]
    // 当日として更新（RLSで弾かれても UI は返す）
    const { error: updErr } = await supabase
      .from('missions')
      .update({ used_at: new Date().toISOString() })
      .eq('id', picked.id)
      .select()
      .single()
    if (updErr) console.warn('[getOrPickTodayMission][update unused failed]', updErr)
    return picked
  }

  // 2ヶ月以上前
  const { data: old, error: oldErr } = await supabase.from('missions').select('*').lt('used_at', twoMonthsAgoISO)

  if (oldErr) {
    console.error('[getOrPickTodayMission][old]', oldErr)
    return null
  }
  if (old && old.length > 0) {
    const picked = old[Math.floor(Math.random() * old.length)]
    const { error: updErr } = await supabase
      .from('missions')
      .update({ used_at: new Date().toISOString() })
      .eq('id', picked.id)
      .select()
      .single()
    if (updErr) console.warn('[getOrPickTodayMission][update old failed]', updErr)
    return picked
  }

  return null
}

// 使用マーク
export const markMissionAsUsed = async (id: string): Promise<MissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('missions')
    .update({ used_at: new Date().toISOString() } as MissionUpdate)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data ?? null
}
