'use server'

import { revalidatePath } from 'next/cache'
import { createService, updateService, deleteService, reorderServices } from '@/lib/services/services.service'
import { requireAuth } from '@/lib/api/helpers'

export async function createServiceAction(data: any) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await createService(data)
  if (!result.error) {
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath('/')
  }
  return result
}

export async function updateServiceAction(id: string, data: any) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await updateService(id, data)
  if (!result.error) {
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath('/')
  }
  return result
}

export async function deleteServiceAction(id: string) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await deleteService(id)
  if (!result.error) {
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath('/')
  }
  return result
}

export async function reorderServicesAction(items: { id: string; sort_order: number }[]) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await reorderServices(items)
  if (!result.error) {
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath('/')
  }
  return result
}
