// ============================================================
// Email Service — Resend Integration
// ============================================================

import { Resend } from 'resend'
import { getSettings } from './settings.service'
import type { ServiceResponse, Contact } from './types'

const apiKey = process.env.RESEND_API_KEY
const isConfigured = !!apiKey && apiKey !== 'your-resend-api-key'
const resend = isConfigured ? new Resend(apiKey) : null

/**
 * Send an admin notification email when a new inquiry arrives.
 */
export async function sendAdminNotification(
  contact: Contact
): Promise<ServiceResponse<boolean>> {
  if (!resend) {
    console.warn('[EMAIL] Resend API key is missing. Skipping admin notification.')
    return { data: false, error: 'Email service not configured' }
  }

  try {
    const settings = await getSettings()
    const adminEmail = settings.data?.contact_email || 'hello@shotthatwithtife.com'
    const siteName = settings.data?.site_name || 'Tife Portfolio'

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #111;">New Inquiry Received 🎥</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
        <p><strong>Service:</strong> ${contact.service_name || 'General Inquiry'}</p>
        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px;">
          <p style="margin: 0; color: #333; line-height: 1.5;">${contact.message}</p>
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">Log in to the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">admin dashboard</a> to reply and manage this lead.</p>
      </div>
    `

    await resend.emails.send({
      from: `${siteName} Bot <onboarding@resend.dev>`,
      to: adminEmail,
      subject: `New Lead: ${contact.name} - ${contact.service_name || 'Inquiry'}`,
      html,
    })

    return { data: true, error: null }
  } catch (err) {
    console.error('[EMAIL] Failed to send admin notification:', err)
    return { data: false, error: `Email send failed: ${(err as Error).message}` }
  }
}

/**
 * Send an auto-reply confirmation email to the visitor.
 */
export async function sendAutoReply(
  contact: Contact
): Promise<ServiceResponse<boolean>> {
  if (!resend) {
    console.warn('[EMAIL] Resend API key is missing. Skipping auto-reply.')
    return { data: false, error: 'Email service not configured' }
  }

  try {
    const settings = await getSettings()
    const siteName = settings.data?.site_name || 'Shot That With Tife'
    // NOTE: Free tier Resend accounts can only send TO the verified domain email. 
    // To send to the actual customer, you must verify a custom domain in Resend.
    const toEmail = contact.email

    const html = `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #000; color: #fff; text-align: center;">
        <div style="width: 40px; height: 40px; background: #c8a97e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="color: #000; font-weight: bold; font-size: 20px;">T</span>
        </div>
        <h1 style="text-transform: uppercase; letter-spacing: 2px; font-size: 24px; margin-bottom: 20px;">Message Received</h1>
        <p style="color: #aaa; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
          Hi ${contact.name.split(' ')[0]},<br><br>
          Thank you for reaching out regarding <strong>${contact.service_name || 'our services'}</strong>. 
          I have received your inquiry and will review your details shortly. I aim to respond to all inquiries within 24-48 hours to discuss your vision in detail.
        </p>
        <p style="color: #c8a97e; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
          Stay Cinematic
        </p>
        <p style="color: #555; font-size: 12px; margin-top: 40px;">
          &copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.
        </p>
      </div>
    `

    // Attempt to send. This will fail if the domain isn't verified in Resend 
    // and the recipient isn't the account owner, but we catch the error gracefully.
    await resend.emails.send({
      from: `${siteName} <onboarding@resend.dev>`, // Must update when domain is verified
      to: toEmail,
      subject: `Thank you for your inquiry | ${siteName}`,
      html,
    })

    return { data: true, error: null }
  } catch (err) {
    console.error('[EMAIL] Failed to send auto-reply:', err)
    return { data: false, error: `Email send failed: ${(err as Error).message}` }
  }
}
