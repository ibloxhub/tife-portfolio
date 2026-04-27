// ============================================================
// API Route Helpers — Shared Utilities
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Standardized JSON success response.
 */
export function jsonResponse<T>(data: T, status = 200, count?: number) {
  return NextResponse.json(
    { success: true, data, ...(count !== undefined && { count }) },
    { status }
  )
}

/**
 * Standardized JSON error response.
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  )
}

/**
 * Auth guard — checks if the request is from an authenticated admin.
 * Returns the user if authenticated, or null if not.
 */
export async function requireAuth(): Promise<{ authenticated: boolean; userId?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { authenticated: false }
    return { authenticated: true, userId: user.id }
  } catch {
    return { authenticated: false }
  }
}

/**
 * Parse pagination and filter params from a URL search string.
 */
export function parseSearchParams(url: string) {
  const { searchParams } = new URL(url)
  return {
    page: parseInt(searchParams.get('page') ?? '1', 10),
    limit: parseInt(searchParams.get('limit') ?? '20', 10),
    sortBy: searchParams.get('sortBy') ?? undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    featured: searchParams.get('featured') ?? undefined,
    startDate: searchParams.get('start') ?? undefined,
    endDate: searchParams.get('end') ?? undefined,
    serviceId: searchParams.get('serviceId') ?? undefined,
  }
}

// ============================================================
// Simple In-Memory Rate Limiter
// ============================================================
// Tracks requests per IP. Resets after the window expires.
// For production scale, replace with Redis or Upstash.

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const RATE_LIMIT_MAX = 5 // max submissions per window

/**
 * Check if an IP has exceeded the rate limit.
 * Returns true if the request should be BLOCKED.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    // First request or window expired — reset
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true // BLOCKED
  }

  entry.count++
  return false
}
