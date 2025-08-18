'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ReactionRow = Database['public']['Tables']['reactions']['Row']
type ReactionInsert = Database['public']['Tables']['reactions']['Insert']

export type ReactionWithCount = {
  url: string
  count: number
  rows: ReactionRow[]
}

async function getReactionSummary(postId: string): Promise<ReactionWithCount[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('reactions').select('*').eq('post_id', postId)

  if (error) throw error

  const map = new Map<string, ReactionRow[]>()
  for (const r of (data ?? []) as ReactionRow[]) {
    const arr = map.get(r.url) ?? []
    arr.push(r)
    map.set(r.url, arr)
  }

  return Array.from(map.entries()).map(([url, rows]) => ({
    url,
    count: rows.length,
    rows
  }))
}

/**
 * リアクションのトグル
 * - まず upsert(ignoreDuplicates) で「付与」を試す
 * - 1行も返らなければ既に付いてた → delete して「解除」
 * - 集計を ReactionWithCount[] で返す
 */
export async function toggleReaction(postId: string, url: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userErr
  } = await supabase.auth.getUser()
  if (userErr || !user) throw new Error('Not authenticated')

  const payload: ReactionInsert = {
    post_id: postId,
    profile_id: user.id,
    url
  }

  // 付与トライ（重複時は無視される）
  const { data: upserted, error: upsertErr } = await supabase
    .from('reactions')
    .upsert(payload, {
      onConflict: 'post_id,profile_id,url',
      ignoreDuplicates: true
    })
    .select() // returning rows if inserted

  if (upsertErr) throw upsertErr

  let action: 'added' | 'removed' = 'added'

  // 無視された（= 既に付いていた）→ 解除
  if (!upserted || upserted.length === 0) {
    const { error: delErr } = await supabase
      .from('reactions')
      .delete()
      .match({ post_id: postId, profile_id: user.id, url })
    if (delErr) throw delErr
    action = 'removed'
  }

  const summary = await getReactionSummary(postId)
  return { action, summary } satisfies { action: 'added' | 'removed'; summary: ReactionWithCount[] }
}
