'use server'

import { PrismaClient } from '@prisma/client'
import type { User } from '../../../../prisma/generated'
import { supabaseServer } from '../server'

const prisma = new PrismaClient()

export const getUser = async (): Promise<User | null> => {
  const supabase = await supabaseServer
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session?.user?.id) return null

  return await prisma.user.findUnique({
    where: { id: session.user.id }
  })
}

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export const getUserByStripeId = async (stripeCustomerId: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { stripeCustomerId: stripeCustomerId }
  })
}

export const createUser = async (user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> => {
  return await prisma.user.create({
    data: user
  })
}

export const updateUser = async (
  id: string,
  updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: updates
  })
}

export const deleteUser = async (id: string): Promise<boolean> => {
  await prisma.user.delete({
    where: { id }
  })
  return true
}
