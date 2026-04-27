// ============================================================
// Supabase Admin Client (Service Role — Bypasses RLS)
// ============================================================
// WARNING: This client uses the service_role key.
// It must NEVER be exposed to the browser.
// Only use in Server Actions, API routes, and server-side services.

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
