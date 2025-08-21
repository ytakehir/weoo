'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type SeasonsMissionRow = Database['public']['Tables']['missions']['Row']
type SeasonsMissionInsert = Database['public']['Tables']['missions']['Insert']
type SeasonsMissionUpdate = Database['public']['Tables']['missions']['Update']

// 全件取得
export const getSeasonsMissions = async (): Promise<SeasonsMissionRow[]> => {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('kind', 'season')
    .lte('publish_start_at', now) // 開始 <= now
    .gte('publish_end_at', now) // 終了 >= now
    .order('publish_start_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// 作成
export const createSeasonsMission = async (title: string): Promise<SeasonsMissionRow> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('seasons_missions')
    .insert({ title, kind: 'season' } as SeasonsMissionInsert)
    .select()
    .single()

  if (error) throw error
  return data
}

// 更新
export const updateSeasonsMission = async (
  id: string,
  updates: SeasonsMissionUpdate
): Promise<SeasonsMissionRow | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('seasons_missions').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data ?? null
}

// 削除
export const deleteSeasonsMission = async (id: string): Promise<boolean> => {
  const supabase = await createClient()
  const { error } = await supabase.from('seasons_missions').delete().eq('id', id)
  if (error) throw error
  return true
}
