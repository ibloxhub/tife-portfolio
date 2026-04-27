// ============================================================
// Services Service — CRUD + Click Tracking
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSlug, validateRequired } from './validation'
import type {
  ServiceResponse,
  PaginationParams,
  Service,
  ServiceInsert,
  ServiceUpdate,
} from './types'

/**
 * Get all active services with optional pagination.
 * RLS enforces is_active = true for public access.
 */
export async function getAllServices(
  pagination?: PaginationParams
): Promise<ServiceResponse<Service[]>> {
  try {
    const supabase = await createClient()
    const page = pagination?.page ?? 1
    const limit = pagination?.limit ?? 20
    const sortBy = pagination?.sortBy ?? 'sort_order'
    const sortOrder = pagination?.sortOrder ?? 'asc'
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('services')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get a single active service by its URL slug.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceResponse<Service>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get any service by ID (admin — includes inactive).
 */
export async function getServiceById(id: string): Promise<ServiceResponse<Service>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Create a new service.
 */
export async function createService(
  input: Omit<ServiceInsert, 'slug'> & { slug?: string }
): Promise<ServiceResponse<Service>> {
  try {
    const missing = validateRequired({ name: input.name })
    if (missing.length > 0) {
      return { data: null, error: `Missing required fields: ${missing.join(', ')}` }
    }

    const slug = input.slug || generateSlug(input.name)
    const supabase = await createClient()

    const { data, error } = await (supabase.from('services') as any)
      .insert({ ...input, slug })
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Update an existing service.
 */
export async function updateService(
  id: string,
  updates: ServiceUpdate
): Promise<ServiceResponse<Service>> {
  try {
    const supabase = await createClient()

    if (updates.name && !updates.slug) {
      updates.slug = generateSlug(updates.name)
    }

    const { data, error } = await (supabase.from('services') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Delete a service. Checks for linked contacts first.
 */
export async function deleteService(id: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Check for linked contacts
    const { count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', id)

    if (count && count > 0) {
      return {
        data: null,
        error: `Cannot delete: ${count} contact(s) are linked to this service. Archive it instead.`,
      }
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (error) return { data: null, error: error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Increment the click count for a service (public, fire-and-forget).
 */
export async function incrementServiceClickCount(id: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = createAdminClient()
    const { data: current } = await supabase
      .from('services')
      .select('click_count')
      .eq('id', id)
      .single()

    if (current) {
      await (supabase.from('services') as any)
        .update({ click_count: ((current as any).click_count ?? 0) + 1 })
        .eq('id', id)
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('[SERVICES] Click count increment failed:', err)
    return { data: false, error: null }
  }
}

/**
 * Batch-update sort_order for drag-and-drop reordering.
 */
export async function reorderServices(
  items: { id: string; sort_order: number }[]
): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = await createClient()

    const updates = items.map((item) =>
      (supabase.from('services') as any)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
    )

    const results = await Promise.all(updates)
    const failed = results.find((r) => r.error)

    if (failed?.error) return { data: null, error: failed.error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}
