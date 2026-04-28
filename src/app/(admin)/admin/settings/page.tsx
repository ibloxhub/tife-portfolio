import { getSettings } from '@/lib/services/settings.service'
import { SettingsForm } from '@/components/admin/settings-form'

export default async function SettingsPage() {
  const result = await getSettings()
  const settings = result.data

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-medium text-white tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm">Configure your website and branding.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
