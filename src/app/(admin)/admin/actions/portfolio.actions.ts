'use server'

import { revalidatePath } from 'next/cache'
import { createPortfolio, updatePortfolio, deletePortfolio, reorderPortfolios } from '@/lib/services/portfolio.service'
import { requireAuth } from '@/lib/api/helpers'

export async function createPortfolioAction(data: any) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await createPortfolio(data)
  if (!result.error) {
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio') // Revalidate public portfolio
    revalidatePath('/') // Revalidate home page (featured)
  }
  return result
}

export async function updatePortfolioAction(id: string, data: any) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await updatePortfolio(id, data)
  if (!result.error) {
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    revalidatePath('/')
  }
  return result
}

export async function deletePortfolioAction(id: string) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await deletePortfolio(id)
  if (!result.error) {
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    revalidatePath('/')
  }
  return result
}

export async function reorderPortfolioAction(items: { id: string; sort_order: number }[]) {
  const auth = await requireAuth()
  if (!auth.authenticated) return { error: 'Unauthorized' }

  const result = await reorderPortfolios(items)
  if (!result.error) {
    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    revalidatePath('/')
  }
  return result
}
