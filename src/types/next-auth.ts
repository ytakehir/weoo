import type { NextRequest } from 'next/server'
import type { DefaultSession } from 'next-auth'

export interface AuthNextRequest extends NextRequest {
  auth: DefaultSession | null
}
