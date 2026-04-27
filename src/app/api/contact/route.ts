// GET /api/contact — List all contacts (admin)
// POST /api/contact — Submit a new inquiry (public, rate-limited)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, requireAuth, parseSearchParams, isRateLimited } from '@/lib/api/helpers'
import { getAllContacts, createContact } from '@/lib/services/contacts.service'
import { sendAdminNotification, sendAutoReply } from '@/lib/services/email.service'
import type { ContactFilters, PaginationParams } from '@/lib/services/types'

export async function GET(request: NextRequest) {
  const auth = await requireAuth()
  if (!auth.authenticated) return errorResponse('Unauthorized', 401)

  const params = parseSearchParams(request.url)

  const filters: ContactFilters = {
    ...(params.status && { status: params.status as ContactFilters['status'] }),
    ...(params.serviceId && { serviceId: params.serviceId }),
    ...(params.search && { search: params.search }),
  }

  const pagination: PaginationParams = {
    page: params.page,
    limit: params.limit,
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder }),
  }

  const result = await getAllContacts(filters, pagination)
  if (result.error) return errorResponse(result.error, 500)
  return jsonResponse(result.data, 200, result.count)
}

export async function POST(request: NextRequest) {
  // Rate limiting — 5 submissions per IP per hour
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  if (isRateLimited(ip)) {
    return errorResponse('Too many submissions. Please try again later.', 429)
  }

  try {
    const body = await request.json()
    const result = await createContact(body)

    if (result.error) return errorResponse(result.error, 400)

    // Fire-and-forget email notifications (don't block the response)
    if (result.data) {
      sendAdminNotification(result.data).catch(console.error)
      sendAutoReply(result.data).catch(console.error)
    }

    return jsonResponse(result.data, 201)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}
