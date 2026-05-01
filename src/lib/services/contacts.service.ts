// ============================================================
// Contacts Service — Lead/Inquiry Management
// ============================================================

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateRequired, validateEmail, sanitizeHtml, validateLength } from './validation'
import type {
  ServiceResponse,
  PaginationParams,
  ContactFilters,
  Contact,
  ContactInsert,
} from './types'
import { sendAdminNotification } from './email.service'

/**
 * Get all contacts with optional filters and pagination (admin only).
 */
export async function getAllContacts(
  filters?: ContactFilters,
  pagination?: PaginationParams
): Promise<ServiceResponse<Contact[]>> {
  try {
    const supabase = await createClient()
    const page = pagination?.page ?? 1
    const limit = pagination?.limit ?? 20
    const sortBy = pagination?.sortBy ?? 'created_at'
    const sortOrder = pagination?.sortOrder ?? 'desc'
    const offset = (page - 1) * limit

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.serviceId) query = query.eq('service_id', filters.serviceId)
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    const { data, error, count } = await query

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get a single contact by ID (admin only).
 */
export async function getContactById(id: string): Promise<ServiceResponse<Contact>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contacts')
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
 * Submit a new contact inquiry (public).
 * Uses admin client to bypass RLS for public INSERT.
 * Validates and sanitizes all input.
 */
export async function createContact(
  input: ContactInsert
): Promise<ServiceResponse<Contact>> {
  try {
    // Validate required fields
    const missing = validateRequired({
      name: input.name,
      email: input.email,
      message: input.message,
    })
    if (missing.length > 0) {
      return { data: null, error: `Missing required fields: ${missing.join(', ')}` }
    }

    // Validate email format
    if (!validateEmail(input.email)) {
      return { data: null, error: 'Invalid email address format' }
    }

    // Validate message length
    if (!validateLength(input.message, 10, 5000)) {
      return { data: null, error: 'Message must be between 10 and 5000 characters' }
    }

    // Sanitize user input
    const sanitizedInput = {
      ...input,
      name: sanitizeHtml(input.name.trim()),
      email: input.email.trim().toLowerCase(),
      message: sanitizeHtml(input.message.trim()),
      phone: input.phone ? input.phone.trim() : null,
      status: 'new' as const,
    }

    const supabase = createAdminClient()
    const { data, error } = await (supabase.from('contacts') as any)
      .insert(sanitizedInput)
      .select()
      .single()

    if (error) return { data: null, error: error.message }

    // Trigger email notifications (background)
    sendAdminNotification(data).catch(err => 
      console.error('[CONTACT] Email notification trigger failed:', err)
    )

    return { data, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Update the status of a contact (admin only).
 */
export async function updateContactStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
): Promise<ServiceResponse<Contact>> {
  try {
    const supabase = await createClient()
    const { data, error } = await (supabase.from('contacts') as any)
      .update({ status })
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
 * Permanently delete a contact (admin only).
 */
export async function deleteContact(id: string): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) return { data: null, error: error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get the count of unread (status = 'new') contacts.
 * Used for the sidebar badge in the admin dashboard.
 */
export async function getUnreadContactCount(): Promise<ServiceResponse<number>> {
  try {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')

    if (error) return { data: null, error: error.message }
    return { data: count ?? 0, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get most recent contacts for the dashboard activity feed.
 */
export async function getRecentContacts(limit = 5): Promise<ServiceResponse<Contact[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}
