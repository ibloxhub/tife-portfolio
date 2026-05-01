'use server'

import { trackEvent } from '@/lib/services/events.service'
import { TrackingEventInsert } from '@/lib/services/types'

export async function trackEventAction(event: TrackingEventInsert) {
  try {
    const result = await trackEvent(event)
    return { success: !!result.data, error: result.error }
  } catch (err) {
    return { success: false, error: 'Tracking failed' }
  }
}
