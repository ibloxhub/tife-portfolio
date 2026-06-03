// ============================================================
// Events Service — Custom Analytics Tracking
// ============================================================

import { createAdminClient } from '@/lib/supabase/admin'
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
    // Use admin client to bypass RLS — events table requires authenticated role
    const supabase = createAdminClient()
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
    // Use admin client to bypass RLS — events SELECT requires authenticated role
    const supabase = createAdminClient()

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
 * Get today vs yesterday event counts for trend indicators.
 * Uses admin client to bypass RLS.
 */
export async function getAnalyticsTrends(): Promise<ServiceResponse<{
  pageViews: { today: number; yesterday: number; trendPercent: number }
  portfolioViews: { today: number; yesterday: number; trendPercent: number }
  serviceClicks: { today: number; yesterday: number; trendPercent: number }
  contactSubmissions: { today: number; yesterday: number; trendPercent: number }
  totalEvents: { today: number; yesterday: number; trendPercent: number }
}>> {
  try {
    const supabase = createAdminClient()

    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const { data: todayEvents } = await supabase
      .from('events')
      .select('*')
      .gte('created_at', todayStart.toISOString())
      .lt('created_at', tomorrowStart.toISOString())

    const { data: yesterdayEvents } = await supabase
      .from('events')
      .select('*')
      .gte('created_at', yesterdayStart.toISOString())
      .lt('created_at', todayStart.toISOString())

    const today = (todayEvents ?? []) as TrackingEvent[]
    const yesterday = (yesterdayEvents ?? []) as TrackingEvent[]

    function calcTrend(todayCount: number, yesterdayCount: number) {
      const trendPercent = yesterdayCount === 0
        ? todayCount > 0 ? 100 : 0
        : Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100)
      return { today: todayCount, yesterday: yesterdayCount, trendPercent }
    }

    return {
      data: {
        pageViews: calcTrend(
          today.filter((e) => e.event_type === 'page_view').length,
          yesterday.filter((e) => e.event_type === 'page_view').length
        ),
        portfolioViews: calcTrend(
          today.filter((e) => e.event_type === 'portfolio_view').length,
          yesterday.filter((e) => e.event_type === 'portfolio_view').length
        ),
        serviceClicks: calcTrend(
          today.filter((e) => e.event_type === 'service_click').length,
          yesterday.filter((e) => e.event_type === 'service_click').length
        ),
        contactSubmissions: calcTrend(
          today.filter((e) => e.event_type === 'contact_submit').length,
          yesterday.filter((e) => e.event_type === 'contact_submit').length
        ),
        totalEvents: calcTrend(today.length, yesterday.length),
      },
      error: null,
    }
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
    const supabase = createAdminClient()
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
    const supabase = createAdminClient()
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
