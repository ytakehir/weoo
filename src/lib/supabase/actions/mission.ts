'use server'

import { prisma } from '@/lib/prisma/client'
import type { Mission } from '../../../../prisma/generated'

// 全件取得（ページネーションあり）
export const getMissions = async (page = 1, limit = 20): Promise<Mission[]> => {
  return await prisma.mission.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  })
}

// ID指定で取得
export const getMissionById = async (id: string): Promise<Mission | null> => {
  return await prisma.mission.findUnique({ where: { id } })
}

// 使用中のミッション取得（usedAt が null でない最新の1件）
export const getLatestUsedMission = async (): Promise<Mission | null> => {
  return await prisma.mission.findFirst({
    where: { usedAt: { not: null } },
    orderBy: { usedAt: 'desc' }
  })
}

// 作成
export const createMission = async (title: string): Promise<Mission> => {
  return await prisma.mission.create({
    data: { title }
  })
}

// 更新
export const updateMission = async (
  id: string,
  updates: Partial<Omit<Mission, 'id' | 'createdAt'>>
): Promise<Mission | null> => {
  return await prisma.mission.update({
    where: { id },
    data: updates
  })
}

// 削除
export const deleteMission = async (id: string): Promise<boolean> => {
  try {
    await prisma.mission.delete({ where: { id } })
    return true
  } catch (error) {
    console.error('[deleteMission]', error)
    return false
  }
}

// 未使用（usedAt: null）または、usedAtが2ヶ月以上前のものをランダムで取得（未使用を優先）
export const getRandomAvailableMission = async (): Promise<Mission | null> => {
  const twoMonthsAgo = new Date()
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

  // 未使用ミッションを優先的に取得
  const unusedMissions = await prisma.mission.findMany({
    where: { usedAt: null }
  })

  if (unusedMissions.length > 0) {
    return unusedMissions[Math.floor(Math.random() * unusedMissions.length)]
  }

  // 2ヶ月以上経過しているusedミッションを対象にランダム取得
  const oldMissions = await prisma.mission.findMany({
    where: {
      usedAt: {
        lt: twoMonthsAgo
      }
    }
  })

  if (oldMissions.length > 0) {
    return oldMissions[Math.floor(Math.random() * oldMissions.length)]
  }

  return null
}

export const markMissionAsUsed = async (id: string): Promise<Mission | null> => {
  return await prisma.mission.update({
    where: { id },
    data: {
      usedAt: new Date()
    }
  })
}
