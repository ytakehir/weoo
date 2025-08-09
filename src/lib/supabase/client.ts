import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import type { Database } from '@/types/database'

export const useSupabaseClient = () => {
  const { data: session } = useSession()

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${session?.supabaseAccessToken ?? ''}`
        }
      }
    }
  )

  return supabase
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  {
    auth: { persistSession: false }
  }
)
