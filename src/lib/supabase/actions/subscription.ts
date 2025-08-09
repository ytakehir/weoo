'use server'

import { prisma } from '@/lib/prisma/client'
import type { Subscription } from '../../../../prisma/generated'

// 1件取得（ID指定）
export const getSubscriptionById = async (id: string): Promise<Subscription | null> => {
  return await prisma.subscription.findUnique({ where: { id } })
}

// ユーザーIDに紐づく全件取得
export const getSubscriptionsByUserId = async (userId: string): Promise<Subscription[]> => {
  return await prisma.subscription.findMany({ where: { userId: userId } })
}

// 作成
export const createSubscription = async (
  subscription: Omit<Subscription, 'created_at'>
): Promise<Subscription | null> => {
  return await prisma.subscription.create({
    data: subscription
  })
}

// 更新
export const updateSubscription = async (
  id: string,
  updates: Partial<Omit<Subscription, 'id' | 'created_at'>>
): Promise<Subscription | null> => {
  return await prisma.subscription.update({
    where: { id },
    data: updates
  })
}

// 削除
export const deleteSubscription = async (id: string): Promise<boolean> => {
  try {
    await prisma.subscription.delete({ where: { id } })
    return true
  } catch (error) {
    console.error('[deleteSubscription]', error)
    return false
  }
}
