export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      portfolio: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category: 'photo' | 'video' | 'event' | 'marketing'
          media_urls: Json
          thumbnail_url: string | null
          is_featured: boolean
          is_published: boolean
          sort_order: number
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category: 'photo' | 'video' | 'event' | 'marketing'
          media_urls?: Json
          thumbnail_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          category?: 'photo' | 'video' | 'event' | 'marketing'
          media_urls?: Json
          thumbnail_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          sort_order?: number
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          category: string | null
          description: string | null
          short_description: string | null
          icon_name: string | null
          cta_text: string
          is_active: boolean
          sort_order: number
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category?: string | null
          description?: string | null
          short_description?: string | null
          icon_name?: string | null
          cta_text?: string
          is_active?: boolean
          sort_order?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string | null
          description?: string | null
          short_description?: string | null
          icon_name?: string | null
          cta_text?: string
          is_active?: boolean
          sort_order?: number
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          service_id: string | null
          service_name: string | null
          status: 'new' | 'read' | 'replied' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          service_id?: string | null
          service_name?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          service_id?: string | null
          service_name?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          event_type: 'page_view' | 'portfolio_view' | 'service_click' | 'contact_submit' | 'cta_click'
          page: string | null
          entity_id: string | null
          metadata: Json
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: 'page_view' | 'portfolio_view' | 'service_click' | 'contact_submit' | 'cta_click'
          page?: string | null
          entity_id?: string | null
          metadata?: Json
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: 'page_view' | 'portfolio_view' | 'service_click' | 'contact_submit' | 'cta_click'
          page?: string | null
          entity_id?: string | null
          metadata?: Json
          session_id?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          site_name: string
          tagline: string | null
          logo_url: string | null
          about_text: string | null
          about_image_url: string | null
          contact_email: string | null
          whatsapp_number: string | null
          social_links: Json
          seo_defaults: Json
          updated_at: string
        }
        Insert: {
          id?: string
          site_name?: string
          tagline?: string | null
          logo_url?: string | null
          about_text?: string | null
          about_image_url?: string | null
          contact_email?: string | null
          whatsapp_number?: string | null
          social_links?: Json
          seo_defaults?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          site_name?: string
          tagline?: string | null
          logo_url?: string | null
          about_text?: string | null
          about_image_url?: string | null
          contact_email?: string | null
          whatsapp_number?: string | null
          social_links?: Json
          seo_defaults?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
