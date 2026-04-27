// ============================================================
// Settings Service — Global Site Configuration
// ============================================================

import { createClient } from '@/lib/supabase/server'
import type { ServiceResponse, Settings, SettingsUpdate } from './types'

/**
 * Get the global site settings (single-row table).
 * Publicly accessible — used by both public layout and admin settings page.
 */
export async function getSettings(): Promise<ServiceResponse<Settings>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Update global site settings (admin only).
 * Updates the single settings row by its ID.
 */
export async function updateSettings(
  updates: SettingsUpdate
): Promise<ServiceResponse<Settings>> {
  try {
    const supabase = await createClient()

    // First get the settings row ID
    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single()

    if (fetchError || !current) {
      return { data: null, error: 'Settings row not found. Run the seed migration first.' }
    }

    const { data, error } = await (supabase.from('settings') as any)
      .update(updates)
      .eq('id', (current as any).id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}
