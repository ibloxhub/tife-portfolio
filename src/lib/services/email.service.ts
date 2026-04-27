// ============================================================
// Email Service — Scaffold (Wired to Resend in Phase 8)
// ============================================================

import type { ServiceResponse, Contact } from './types'

/**
 * Send an admin notification email when a new inquiry arrives.
 * Currently logs to console — will be wired to Resend in Phase 8.
 */
export async function sendAdminNotification(
  contact: Contact
): Promise<ServiceResponse<boolean>> {
  try {
    console.log('[EMAIL] Admin notification would be sent for:', {
      name: contact.name,
      email: contact.email,
      service: contact.service_name ?? 'General Inquiry',
    })
    // Phase 8: Replace with actual Resend API call
    return { data: true, error: null }
  } catch (err) {
    console.error('[EMAIL] Failed to send admin notification:', err)
    return { data: false, error: `Email send failed: ${(err as Error).message}` }
  }
}

/**
 * Send an auto-reply confirmation email to the visitor.
 * Currently logs to console — will be wired to Resend in Phase 8.
 */
export async function sendAutoReply(
  contact: Contact
): Promise<ServiceResponse<boolean>> {
  try {
    console.log('[EMAIL] Auto-reply would be sent to:', {
      name: contact.name,
      email: contact.email,
      message: 'Thank you for your inquiry! We will get back to you soon.',
    })
    // Phase 8: Replace with actual Resend API call with dynamic template
    return { data: true, error: null }
  } catch (err) {
    console.error('[EMAIL] Failed to send auto-reply:', err)
    return { data: false, error: `Email send failed: ${(err as Error).message}` }
  }
}
