'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { ToastProvider } from '@/components/admin/admin-toast'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-[100dvh] w-full bg-[#050505] text-text-primary relative overflow-x-hidden">
        
        {/* ----------------------------------------------------------------------
            GLOBAL AMBIENT BACKGROUND (Luxury Atmosphere)
            ---------------------------------------------------------------------- */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          
          {/* Subtle Glowing Orbs */}
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[30%] rounded-full bg-gold/5 blur-[120px] opacity-40 animate-pulse duration-[10s]" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[30%] rounded-full bg-white/5 blur-[100px] opacity-20" />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-1 flex-col md:pl-64 transition-all duration-300">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
