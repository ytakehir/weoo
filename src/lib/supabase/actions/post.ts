// src/repositories/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type PostRow = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']
type MissionRow = Database['public']['Tables']['missions']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type PostWithRelations = PostRow & {
  mission: MissionRow
  profile: Pick<ProfileRow, 'id' | 'display_name' | 'avatar_url'>
}

export type PostWithRelationsAndUrl = PostWithRelations & {
  image_url_signed: string | null
}

export type PostWithPage = {
  items: PostWithRelationsAndUrl[]
} & {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

const POST_SELECT = '*, mission:missions(*), profile:profiles(id, display_name, avatar_url)'

// 署名URLを一括付与
async function attachSignedUrls(rows: PostWithRelations[], expiresInSec = 60 * 5): Promise<PostWithRelationsAndUrl[]> {
  if (!rows.length) return []

  const supabase = await createClient()
  const paths = rows.map((r) => r.image_url).filter((p): p is string => !!p)

  if (paths.length === 0) {
    return rows.map((r) => ({ ...r, image_url_signed: null }))
  }

  const { data: signed, error: signErr } = await supabase.storage.from('posts').createSignedUrls(paths, expiresInSec)
  if (signErr) throw signErr

  const urlMap = new Map<string, string>()
  for (const s of signed ?? []) {
    if (s.path && s.signedUrl) urlMap.set(s.path, s.signedUrl)
  }

  return rows.map((r) => ({
    ...r,
    image_url_signed: r.image_url ? (urlMap.get(r.image_url) ?? null) : null
  }))
}

// 共通：ページメタ生成
function buildPageMeta(total: number, page: number, limit: number) {
  const totalPages = total ? Math.ceil(total / limit) : 0
  const hasMore = total ? (page - 1) * limit + limit < total : false
  return { total, page, limit, totalPages, hasMore }
}

// 一覧（新着順）
export async function getPosts(
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsAndUrl[] } & ReturnType<typeof buildPageMeta>> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  const items = await attachSignedUrls((data ?? []) as PostWithRelations[], opts?.expiresInSec)

  return { items, ...buildPageMeta(count ?? 0, page, limit) }
}

// ユーザー別
export async function getPostsByUser(
  userId: string,
  sort: 'asc' | 'desc' = 'desc',
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsAndUrl[] } & ReturnType<typeof buildPageMeta>> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .eq('profile_id', userId)
    .order('created_at', { ascending: sort === 'asc' })
    .range(from, to)

  if (error) throw error

  const items = await attachSignedUrls((data ?? []) as PostWithRelations[], opts?.expiresInSec)

  return { items, ...buildPageMeta(count ?? 0, page, limit) }
}

// ミッション別
export async function getPostsByMission(
  missionId: string,
  sort: 'asc' | 'desc' = 'desc',
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsAndUrl[] } & ReturnType<typeof buildPageMeta>> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .eq('mission_id', missionId)
    .order('created_at', { ascending: sort === 'asc' })
    .range(from, to)

  if (error) throw error

  const items = await attachSignedUrls((data ?? []) as PostWithRelations[], opts?.expiresInSec)

  return { items, ...buildPageMeta(count ?? 0, page, limit) }
}

// 作成
export async function createPost(input: { userId: string; missionId: string; imageUrl: string }): Promise<PostRow> {
  const supabase = await createClient()
  const payload: PostInsert = {
    profile_id: input.userId,
    mission_id: input.missionId,
    image_url: input.imageUrl
  }

  const { data, error } = await supabase.from('posts').insert(payload).select('*').single()

  if (error) throw error
  return data as PostRow
}

// 更新
export async function updatePost(
  id: string,
  updates: Partial<Omit<PostRow, 'id' | 'created_at' | 'updated_at'>>
): Promise<PostRow | null> {
  const supabase = await createClient()
  const patch: PostUpdate = {}

  if (updates.image_url !== undefined) patch.image_url = updates.image_url
  if (updates.mission_id !== undefined) patch.mission_id = updates.mission_id

  const { data, error } = await supabase.from('posts').update(patch).eq('id', id).select('*').single()

  if (error) throw error
  return (data ?? null) as PostRow | null
}

// 削除
export async function deletePost(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
  return true
}
