'use server'

import { trackEvent } from '@/lib/services/events.service'
import { incrementPortfolioViewCount } from '@/lib/services/portfolio.service'
import { TrackingEventInsert } from '@/lib/services/types'

export async function trackEventAction(event: TrackingEventInsert) {
  try {
    const result = await trackEvent(event)
    
    // If it's a portfolio view, increment the total view count on the portfolio table
    if (event.event_type === 'portfolio_view' && event.entity_id) {
      await incrementPortfolioViewCount(event.entity_id)
    }

    return { success: !!result.data, error: result.error }
  } catch (err) {
    return { success: false, error: 'Tracking failed' }
  }
}
