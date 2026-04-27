// ============================================================
// Events Service — Custom Analytics Tracking
// ============================================================

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type {
  ServiceResponse,
  AnalyticsParams,
  TrackingEvent,
  TrackingEventInsert,
} from './types'

/**
 * Track a new analytics event (public, fire-and-forget).
 * Uses admin client since public users can INSERT via RLS.
 */
export async function trackEvent(
  eventData: TrackingEventInsert
): Promise<ServiceResponse<boolean>> {
  try {
    const supabase = createAdminClient()
    const { error } = await (supabase.from('events') as any)
      .insert(eventData)

    if (error) {
      console.error('[EVENTS] Track event failed:', error.message)
      return { data: false, error: null } // Non-critical — don't fail the request
    }
    return { data: true, error: null }
  } catch (err) {
    console.error('[EVENTS] Track event unexpected error:', err)
    return { data: false, error: null }
  }
}

/**
 * Get events with optional date range and type filters (admin only).
 */
export async function getEvents(
  params?: AnalyticsParams,
  limit = 100
): Promise<ServiceResponse<TrackingEvent[]>> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (params?.startDate) query = query.gte('created_at', params.startDate)
    if (params?.endDate) query = query.lte('created_at', params.endDate)
    if (params?.eventType) query = query.eq('event_type', params.eventType)

    const { data, error, count } = await query

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get an aggregated analytics overview for a date range (admin only).
 * Returns counts grouped by event type.
 */
export async function getAnalyticsOverview(
  startDate?: string,
  endDate?: string
): Promise<ServiceResponse<{
  totalEvents: number
  pageViews: number
  portfolioViews: number
  serviceClicks: number
  contactSubmissions: number
  ctaClicks: number
}>> {
  try {
    const supabase = await createClient()

    // Build base query with optional date filter
    let baseQuery = supabase.from('events').select('event_type', { count: 'exact', head: false })
    if (startDate) baseQuery = baseQuery.gte('created_at', startDate)
    if (endDate) baseQuery = baseQuery.lte('created_at', endDate)

    const { data, error } = await baseQuery

    if (error) return { data: null, error: error.message }

    // Manually aggregate counts from the returned rows
    const events: any[] = data ?? []
    const overview = {
      totalEvents: events.length,
      pageViews: events.filter((e) => e.event_type === 'page_view').length,
      portfolioViews: events.filter((e) => e.event_type === 'portfolio_view').length,
      serviceClicks: events.filter((e) => e.event_type === 'service_click').length,
      contactSubmissions: events.filter((e) => e.event_type === 'contact_submit').length,
      ctaClicks: events.filter((e) => e.event_type === 'cta_click').length,
    }

    return { data: overview, error: null }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get event history for a specific portfolio item (admin only).
 */
export async function getPortfolioEventStats(
  portfolioId: string
): Promise<ServiceResponse<TrackingEvent[]>> {
  try {
    const supabase = await createClient()
    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('entity_id', portfolioId)
      .eq('event_type', 'portfolio_view')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}

/**
 * Get event history for a specific service (admin only).
 */
export async function getServiceEventStats(
  serviceId: string
): Promise<ServiceResponse<TrackingEvent[]>> {
  try {
    const supabase = await createClient()
    const { data, error, count } = await supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('entity_id', serviceId)
      .eq('event_type', 'service_click')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return { data: null, error: error.message }
    return { data: data ?? [], error: null, count: count ?? 0 }
  } catch (err) {
    return { data: null, error: `Unexpected error: ${(err as Error).message}` }
  }
}
