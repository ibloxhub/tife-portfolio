'use client'

import { useState } from 'react'
import { Spinner, FloppyDisk } from '@phosphor-icons/react'
import { AdminInput, AdminTextarea } from '@/components/admin/admin-form-field'
import { AdminImageUpload } from '@/components/admin/admin-image-upload'
import { AdminCard } from '@/components/admin/admin-card'
import { useToast } from '@/components/admin/admin-toast'
import { updateSettingsAction } from '@/app/(admin)/admin/actions/settings.actions'
import type { Settings } from '@/lib/services/types'
import type { Json } from '@/types/database'

interface SettingsFormProps {
  initialSettings: Settings | null
}

interface SocialLinks {
  instagram: string
  twitter: string
  youtube: string
  tiktok: string
  linkedin: string
}

interface SeoDefaults {
  metaTitle: string
  metaDescription: string
}

function parseSocialLinks(json: Json | null | undefined): SocialLinks {
  const obj = (typeof json === 'object' && json && !Array.isArray(json) ? json : {}) as Record<string, string>
  return {
    instagram: obj.instagram || '',
    twitter: obj.twitter || '',
    youtube: obj.youtube || '',
    tiktok: obj.tiktok || '',
    linkedin: obj.linkedin || '',
  }
}

function parseSeoDefaults(json: Json | null | undefined): SeoDefaults {
  const obj = (typeof json === 'object' && json && !Array.isArray(json) ? json : {}) as Record<string, string>
  return {
    metaTitle: obj.metaTitle || '',
    metaDescription: obj.metaDescription || '',
  }
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { showToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // General
  const [siteName, setSiteName] = useState(initialSettings?.site_name ?? '')
  const [tagline, setTagline] = useState(initialSettings?.tagline ?? '')
  const [contactEmail, setContactEmail] = useState(initialSettings?.contact_email ?? '')
  const [whatsappNumber, setWhatsappNumber] = useState(initialSettings?.whatsapp_number ?? '')

  // Branding
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logo_url ?? '')
  const [aboutText, setAboutText] = useState(initialSettings?.about_text ?? '')
  const [aboutImageUrl, setAboutImageUrl] = useState(initialSettings?.about_image_url ?? '')

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    parseSocialLinks(initialSettings?.social_links)
  )

  // SEO
  const [seoDefaults, setSeoDefaults] = useState<SeoDefaults>(
    parseSeoDefaults(initialSettings?.seo_defaults)
  )

  function updateSocial(key: keyof SocialLinks, value: string) {
    setSocialLinks((prev) => ({ ...prev, [key]: value }))
  }

  function updateSeo(key: keyof SeoDefaults, value: string) {
    setSeoDefaults((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const data = {
      site_name: siteName.trim(),
      tagline: tagline.trim() || null,
      contact_email: contactEmail.trim() || null,
      whatsapp_number: whatsappNumber.trim() || null,
      logo_url: logoUrl || null,
      about_text: aboutText.trim() || null,
      about_image_url: aboutImageUrl || null,
      social_links: socialLinks as unknown as Json,
      seo_defaults: seoDefaults as unknown as Json,
    }

    try {
      const result = await updateSettingsAction(data)
      if (result.error) {
        showToast(typeof result.error === 'string' ? result.error : 'Failed to save', 'error')
      } else {
        showToast('Settings saved successfully!')
      }
    } catch {
      showToast('An unexpected error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!initialSettings) {
    return (
      <AdminCard>
        <div className="py-12 text-center">
          <p className="text-sm text-text-muted">
            Settings not found. Make sure the settings table has been seeded with an initial row.
          </p>
        </div>
      </AdminCard>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* General */}
      <AdminCard>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium text-white">General</h2>
            <p className="text-xs text-text-muted">Basic site information and contact details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Site Name"
              placeholder="ShotThatWithTife"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <AdminInput
              label="Tagline"
              placeholder="Behind the lens. Behind the scenes."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <AdminInput
              label="Contact Email"
              type="email"
              placeholder="hello@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              helper="Where you receive inquiry notifications."
            />
            <AdminInput
              label="WhatsApp Number"
              placeholder="+234 800 000 0000"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              helper="Include country code. Used for the WhatsApp CTA."
            />
          </div>
        </div>
      </AdminCard>

      {/* Branding */}
      <AdminCard>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium text-white">Branding</h2>
            <p className="text-xs text-text-muted">Your logo and about section content.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminImageUpload
              label="Logo"
              value={logoUrl}
              onUpload={(url) => setLogoUrl(url)}
              onRemove={() => setLogoUrl('')}
              storagePath="branding"
              helper="Appears in the navbar and footer."
            />
            <AdminImageUpload
              label="About Image"
              value={aboutImageUrl}
              onUpload={(url) => setAboutImageUrl(url)}
              onRemove={() => setAboutImageUrl('')}
              storagePath="branding"
              helper="Photo for the About section."
            />
          </div>

          <AdminTextarea
            label="About Text"
            placeholder="Tell your story..."
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            helper="Displayed on the About page of your website."
          />
        </div>
      </AdminCard>

      {/* Social Links */}
      <AdminCard>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium text-white">Social Links</h2>
            <p className="text-xs text-text-muted">Connect your social media profiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminInput
              label="Instagram"
              placeholder="https://instagram.com/yourhandle"
              value={socialLinks.instagram}
              onChange={(e) => updateSocial('instagram', e.target.value)}
            />
            <AdminInput
              label="Twitter / X"
              placeholder="https://x.com/yourhandle"
              value={socialLinks.twitter}
              onChange={(e) => updateSocial('twitter', e.target.value)}
            />
            <AdminInput
              label="YouTube"
              placeholder="https://youtube.com/@yourchannel"
              value={socialLinks.youtube}
              onChange={(e) => updateSocial('youtube', e.target.value)}
            />
            <AdminInput
              label="TikTok"
              placeholder="https://tiktok.com/@yourhandle"
              value={socialLinks.tiktok}
              onChange={(e) => updateSocial('tiktok', e.target.value)}
            />
            <AdminInput
              label="LinkedIn"
              placeholder="https://linkedin.com/in/yourprofile"
              value={socialLinks.linkedin}
              onChange={(e) => updateSocial('linkedin', e.target.value)}
            />
          </div>
        </div>
      </AdminCard>

      {/* SEO */}
      <AdminCard>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium text-white">SEO Defaults</h2>
            <p className="text-xs text-text-muted">Default title and description for search engines.</p>
          </div>

          <AdminInput
            label="Default Meta Title"
            placeholder="ShotThatWithTife — Professional Cinematography"
            value={seoDefaults.metaTitle}
            onChange={(e) => updateSeo('metaTitle', e.target.value)}
            helper="The title that appears in Google search results."
          />
          <AdminTextarea
            label="Default Meta Description"
            placeholder="Professional cinematography and photography services..."
            value={seoDefaults.metaDescription}
            onChange={(e) => updateSeo('metaDescription', e.target.value)}
            helper="The description Google shows under your title. Keep it under 160 characters."
          />
        </div>
      </AdminCard>

      {/* Save Button */}
      <div className="flex justify-end pb-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4 animate-spin" />
          ) : (
            <FloppyDisk weight="light" className="h-4 w-4" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  )
}
