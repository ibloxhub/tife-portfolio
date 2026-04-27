// POST /api/analytics/track — Track an analytics event (public)

import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api/helpers'
import { trackEvent } from '@/lib/services/events.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate event_type is provided
    const validTypes = ['page_view', 'portfolio_view', 'service_click', 'contact_submit', 'cta_click']
    if (!body.event_type || !validTypes.includes(body.event_type)) {
      return errorResponse(
        `Invalid event_type. Must be one of: ${validTypes.join(', ')}`,
        400
      )
    }

    const result = await trackEvent({
      event_type: body.event_type,
      page: body.page ?? null,
      entity_id: body.entity_id ?? null,
      session_id: body.session_id ?? null,
      metadata: body.metadata ?? {},
    })

    if (result.error) return errorResponse(result.error, 500)
    return jsonResponse({ tracked: true }, 201)
  } catch {
    return errorResponse('Invalid request body', 400)
  }
}
