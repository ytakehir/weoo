'use server'

import { hasActiveSubscription } from '@/lib/stripe/subscription'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type TicketOk = { ok: true; ticket: NonNullable<ProfileRow['ticket']>; consumed?: boolean }
export type TicketErr = { ok: false; error: string }
export type TicketResult = TicketOk | TicketErr

/**
 * 自分の所持チケット数を取得
 */
export async function getMyTicket(): Promise<TicketResult> {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { data, error } = await supabase.from('profiles').select('ticket').eq('id', user.id).single()

  if (error) return { ok: false, error: error.message }

  const ticket = (data?.ticket ?? 0) as NonNullable<ProfileRow['ticket']>
  return { ok: true, ticket }
}

/**
 * チケットを1枚消費（0枚なら消費しない）
 * - DBに定義済みの SECURITY DEFINER RPC: public.consume_one_ticket()
 * - RLS/権限で守られている前提
 */
export const consumeOneTicket = async (): Promise<TicketResult> => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized' }
  // 事前に残数チェック
  const before = await supabase.from('profiles').select('ticket').eq('id', user.id).single()
  if (before.error) return { ok: false, error: before.error.message }

  const current = (before.data?.ticket ?? 0) as NonNullable<ProfileRow['ticket']>
  if (current <= 0) return { ok: true, ticket: 0, consumed: false }

  // 1枚消費（DBのRPC呼び出し）
  const call = await supabase.rpc('consume_one_ticket')
  if (call.error) return { ok: false, error: call.error.message }

  // 反映後を返す
  const after = await supabase.from('profiles').select('ticket').eq('id', user.id).single()
  if (after.error) return { ok: false, error: after.error.message }

  const ticket = (after.data?.ticket ?? 0) as NonNullable<ProfileRow['ticket']>
  return { ok: true, ticket, consumed: true }
}

/** キャンペーン等で「いまのユーザ」に N 枚付与（上限なし） */
export const grantMyTickets = async (n: number): Promise<{ ok: true; after: number }> => {
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error('n must be a positive number')
  }

  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  // 上限なしイベント付与（DB側RPC）
  const { error: rpcErr } = await supabase.rpc('topup_event_tickets', { inc: n })
  if (rpcErr) throw rpcErr

  // 付与後の残枚数を返す
  const { data, error } = await supabase.from('profiles').select('ticket').eq('id', user.id).single()

  if (error) throw error
  return { ok: true, after: data?.ticket ?? 0 }
}

export const consumeIfNeeded = async (): Promise<TicketResult> => {
  const isSub = await hasActiveSubscription()
  if (isSub) {
    // そのまま成功扱い（減らさない）
    const mine = await getMyTicket()
    return mine.ok ? { ok: true, ticket: mine.ticket, consumed: false } : mine
  }
  return consumeOneTicket()
}
