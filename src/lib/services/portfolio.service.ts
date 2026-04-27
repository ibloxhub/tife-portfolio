// ============================================================
// Portfolio Service — CRUD + View Tracking
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateSlug, validateRequired } from './validation'
import type {
  ServiceResponse,
  PaginationParams,
  PortfolioFilters,
  Portfolio,
  PortfolioInsert,
  PortfolioUpdate,
} from './types'

/**
 * Get all published portfolio items with optional filters and pagination.
 * Uses the authenticated user's RLS context (public = only published items).
 */
export async function getAllPortfolios(
  filters?: PortfolioFilters,
  pagination?: PaginationParams
): Promise<ServiceResponse<Portfolio[]>> {
  try {
    const supabase = await createClient()
    const page = pagination?.page ?? 1
    const limit = pagination?.limit ?? 20
    const sortBy = pagination?.sortBy ?? 'sort_order'
    const sortOrder = pagination?.sortOrder ?? 'asc'
    const offset = (page - 1) * limit

    let query = supabase
      .from('portfolio')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.isFeatured !== undefined) query = query.eq('is_featured', filters.isFeatured)
    if (filters?.isPublished !== undefined) query = query.eq('is_published', filters.isPublished)
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

    const { data, error, count } = await query

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get a single published portfolio item by its URL slug.
 */
export async function getPortfolioBySlug(slug: string): Promise<ServiceResponse<Portfolio>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('portfolio')
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
 * Get featured + published portfolio items for the homepage.
 */
export async function getFeaturedPortfolios(limit = 6): Promise<ServiceResponse<Portfolio[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('is_featured', true)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(limit)

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get any portfolio item by ID (admin — includes drafts).
 * Uses admin client to bypass RLS is_published filter.
 */
export async function getPortfolioById(id: string): Promise<ServiceResponse<Portfolio>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('portfolio')
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
 * Create a new portfolio item.
 */
export async function createPortfolio(
  input: Omit<PortfolioInsert, 'slug'> & { slug?: string }
): Promise<ServiceResponse<Portfolio>> {
  try {
    const missing = validateRequired({ title: input.title, category: input.category })
    if (missing.length > 0) {
      return { data: null, error: `Missing required fields: ${missing.join(', ')}` }
    }

    const slug = input.slug || generateSlug(input.title)
    const supabase = await createClient()

    const { data, error } = await (supabase.from('portfolio') as any)
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
 * Update an existing portfolio item.
 */
export async function updatePortfolio(
  id: string,
  updates: PortfolioUpdate
): Promise<ServiceResponse<Portfolio>> {
  try {
    const supabase = await createClient()

    // If title is being updated and no slug provided, regenerate slug
    if (updates.title && !updates.slug) {
      updates.slug = generateSlug(updates.title)
    }

    const { data, error } = await (supabase.from('portfolio') as any)
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
 * Delete a portfolio item.
 */
export async function deletePortfolio(id: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id)

    if (error) return { data: null, error: error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Increment the view count for a portfolio item (public, fire-and-forget).
 * Uses admin client since public users can't UPDATE via RLS.
 */
export async function incrementPortfolioViewCount(id: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.rpc('increment_view_count' as never, { row_id: id } as never)

    // Fallback: If RPC doesn't exist, use a manual update
    if (error) {
      const { data: current } = await supabase
        .from('portfolio')
        .select('view_count')
        .eq('id', id)
        .single()

      if (current) {
        await (supabase.from('portfolio') as any)
          .update({ view_count: ((current as any).view_count ?? 0) + 1 })
          .eq('id', id)
      }
    }

    return { data: true, error: null }
  } catch (err) {
    // View count increment is non-critical — don't fail the request
    console.error('[PORTFOLIO] View count increment failed:', err)
    return { data: false, error: null }
  }
}

/**
 * Batch-update sort_order for drag-and-drop reordering.
 */
export async function reorderPortfolios(
  items: { id: string; sort_order: number }[]
): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Update each item's sort_order
    const updates = items.map((item) =>
      (supabase.from('portfolio') as any)
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
