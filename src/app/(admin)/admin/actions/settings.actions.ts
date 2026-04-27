'use server'

import { revalidatePath } from 'next/cache'
import { updateSettings } from '@/lib/services/settings.service'
import { requireAuth } from '@/lib/api/helpers'

export async function updateSettingsAction(data: any) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await updateSettings(data)
  if (!result.error) {
    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout') // Revalidate everything as settings affect layout (nav, footer, etc)
  }
  return result
}
