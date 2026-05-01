'use client'

import { useEffect } from 'react'
import { trackEventAction } from '@/lib/actions/events.actions'

interface ViewTrackerProps {
  portfolioId: string
  portfolioTitle: string
}

export function ViewTracker({ portfolioId, portfolioTitle }: ViewTrackerProps) {
  useEffect(() => {
    // Small delay to ensure it's a real view
    const timer = setTimeout(() => {
      trackEventAction({
        event_type: 'portfolio_view',
        metadata: {
          portfolio_id: portfolioId,
          portfolio_title: portfolioTitle,
          url: window.location.href
        }
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [portfolioId, portfolioTitle])

  return null
}
