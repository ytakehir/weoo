'use server'

import { prisma } from '@/lib/prisma/client'
import type { Post } from '../../../../prisma/generated'

// 全件取得（ページネーション＋新着順）
export const getPosts = async (page = 1, limit = 30): Promise<Post[]> => {
  return await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      mission: true
    }
  })
}

// ミッションごとに取得（新しい順 or 古い順）
export const getPostsByMission = async (missionId: string, sort: 'asc' | 'desc' = 'desc'): Promise<Post[]> => {
  return await prisma.post.findMany({
    where: { missionId },
    orderBy: { createdAt: sort },
    include: {
      user: true
    }
  })
}

// 作成
export const createPost = async (input: { userId: string; missionId: string; imageUrl: string }): Promise<Post> => {
  return await prisma.post.create({
    data: input
  })
}

// 更新
export const updatePost = async (
  id: string,
  updates: Partial<Omit<Post, 'id' | 'createdAt'>>
): Promise<Post | null> => {
  return await prisma.post.update({
    where: { id },
    data: updates
  })
}

// 削除
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    await prisma.post.delete({ where: { id } })
    return true
  } catch (error) {
    console.error('[deletePost]', error)
    return false
  }
}
