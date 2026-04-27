// ============================================================
// Shared Service Types
// ============================================================

import { Database } from '@/types/database'

// --- Universal Response Wrapper ---
export type ServiceResponse<T> = {
  data: T | null
  error: string | null
  count?: number
}

// --- Pagination ---
export type PaginationParams = {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// --- Portfolio Filters ---
export type PortfolioFilters = {
  category?: 'photo' | 'video' | 'event' | 'marketing'
  isFeatured?: boolean
  isPublished?: boolean
  search?: string
}

// --- Contact Filters ---
export type ContactFilters = {
  status?: 'new' | 'read' | 'replied' | 'archived'
  serviceId?: string
  search?: string
}

// --- Analytics Params ---
export type AnalyticsParams = {
  startDate?: string
  endDate?: string
  eventType?: 'page_view' | 'portfolio_view' | 'service_click' | 'contact_submit' | 'cta_click'
}

// --- Convenience Row Type Aliases ---
export type Portfolio = Database['public']['Tables']['portfolio']['Row']
export type PortfolioInsert = Database['public']['Tables']['portfolio']['Insert']
export type PortfolioUpdate = Database['public']['Tables']['portfolio']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

export type TrackingEvent = Database['public']['Tables']['events']['Row']
export type TrackingEventInsert = Database['public']['Tables']['events']['Insert']

export type Settings = Database['public']['Tables']['settings']['Row']
export type SettingsUpdate = Database['public']['Tables']['settings']['Update']
