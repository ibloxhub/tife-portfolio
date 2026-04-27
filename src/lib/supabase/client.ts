import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database' // We'll create this type file soon

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
