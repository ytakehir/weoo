// src/repositories/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type PostRow = Database['public']['Tables']['posts']['Row']
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
  items: PostWithRelationsUrlAndReactions[]
} & {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}
type ReactionRow = Database['public']['Tables']['reactions']['Row']

export type ReactionWithCount = {
  url: string
  count: number
  rows: ReactionRow[]
}

export type PostWithRelationsUrlAndReactions = PostWithRelationsAndUrl & {
  reactions: ReactionWithCount[]
}

const POST_SELECT = '*, mission:missions(*), profile:profiles(id, display_name, avatar_url)'

// 署名URLを一括付与
const attachSignedUrls = async (
  rows: PostWithRelations[],
  expiresInSec = 60 * 5
): Promise<PostWithRelationsAndUrl[]> => {
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
const buildPageMeta = (total: number, page: number, limit: number) => {
  const totalPages = total ? Math.ceil(total / limit) : 0
  const hasMore = total ? (page - 1) * limit + limit < total : false
  return { total, page, limit, totalPages, hasMore }
}

async function attachReactions(posts: PostWithRelationsAndUrl[]): Promise<PostWithRelationsUrlAndReactions[]> {
  if (!posts.length) return []

  const supabase = await createClient()
  const ids = posts.map((p) => p.id)

  const { data: rx, error: rxErr } = await supabase.from('reactions').select('*').in('post_id', ids)

  if (rxErr) throw rxErr

  return posts.map((p) => {
    const list = (rx ?? []).filter((r) => r.post_id === p.id) as ReactionRow[]
    const counts = list.reduce<Record<string, number>>((acc, r) => {
      acc[r.url] = (acc[r.url] ?? 0) + 1
      return acc
    }, {})

    const withCount: ReactionWithCount[] = Object.entries(counts).map(([url, count]) => {
      const rows = list.filter((r) => r.url === url)

      return {
        url,
        count,
        rows
      }
    })

    return {
      ...p,
      reactions: withCount
    }
  })
}

// 一覧（新着順）
export const getPosts = async (
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsAndUrl[] } & ReturnType<typeof buildPageMeta>> => {
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
export const getPostsByUser = async (
  userId: string,
  sort: 'asc' | 'desc' = 'desc',
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsUrlAndReactions[] } & ReturnType<typeof buildPageMeta>> => {
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

  const signed = await attachSignedUrls((data ?? []) as PostWithRelations[], opts?.expiresInSec)
  const items = await attachReactions(signed)

  return { items, ...buildPageMeta(count ?? 0, page, limit) }
}

// ミッション別
export const getPostsByMission = async (
  missionId: string,
  sort: 'asc' | 'desc' = 'desc',
  page = 1,
  limit = 30,
  opts?: { expiresInSec?: number }
): Promise<{ items: PostWithRelationsUrlAndReactions[] } & ReturnType<typeof buildPageMeta>> => {
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

  const signed = await attachSignedUrls((data ?? []) as PostWithRelations[], opts?.expiresInSec)
  const items = await attachReactions(signed)

  return { items, ...buildPageMeta(count ?? 0, page, limit) }
}

// 作成
export const createPost = async (input: {
  userId: string
  missionId: string
  imageUrl: string
  caption: string | null
  isPublic: boolean
}): Promise<PostRow> => {
  const supabase = await createClient()
  const payload: PostInsert = {
    profile_id: input.userId,
    mission_id: input.missionId,
    image_url: input.imageUrl,
    caption: input.caption,
    is_public: input.isPublic
  }

  const { data, error } = await supabase.from('posts').insert(payload).select('*').single()

  if (error) throw error
  return data as PostRow
}

// 更新
export const updatePost = async (
  id: string,
  updates: Partial<Omit<PostRow, 'id' | 'created_at' | 'updated_at'>>
): Promise<PostRow | null> => {
  const supabase = await createClient()
  const patch: PostUpdate = {}

  if (updates.image_url !== undefined) patch.image_url = updates.image_url
  if (updates.mission_id !== undefined) patch.mission_id = updates.mission_id

  const { data, error } = await supabase.from('posts').update(patch).eq('id', id).select('*').single()

  if (error) throw error
  return (data ?? null) as PostRow | null
}

// 削除
export const deletePost = async (id: string): Promise<boolean> => {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
  return true
}

export const getPostsTotalCount = async () => {
  const sb = await createClient()
  const { data, error } = await sb.rpc('posts_count_total')
  if (error) throw error
  return data as number
}

export const getPostsCountByMission = async (missionId: string) => {
  const sb = await createClient()
  const { data, error } = await sb.rpc('posts_count_by_mission', { post_mission_id: missionId })
  if (error) throw error
  return data as number
}
