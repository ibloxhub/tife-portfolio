'use server'

import { revalidatePath } from 'next/cache'
import { updateContactStatus, deleteContact } from '@/lib/services/contacts.service'
import { requireAuth } from '@/lib/api/helpers'
import type { ContactFilters } from '@/lib/services/types'

export async function updateContactStatusAction(id: string, status: ContactFilters['status']) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  if (!status) return { error: 'Status is required' }

  const result = await updateContactStatus(id, status)
  if (!result.error) {
    revalidatePath('/admin/messages')
  }
  return result
}

export async function deleteContactAction(id: string) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await deleteContact(id)
  if (!result.error) {
    revalidatePath('/admin/messages')
  }
  return result
}
