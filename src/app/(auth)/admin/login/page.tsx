'use client'

import { useActionState, useState } from 'react'
import { login } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowRight, Spinner, Eye, EyeSlash, LockKey, EnvelopeSimple, ShieldCheck } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    // Mobile & Tablet are stacked (free scroll); Desktop (xl) is locked to viewport
    <div className="flex min-h-[100dvh] xl:h-[100dvh] xl:overflow-hidden w-full flex-col xl:flex-row bg-[#050505] text-text-primary selection:bg-gold selection:text-black relative">
      
      {/* ----------------------------------------------------------------------
          AMBIENT BACKGROUND ELEMENTS (The "Luxury Depth")
          ---------------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-gold/10 blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[30%] rounded-full bg-gold/5 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[20%] rounded-full bg-white/5 blur-[80px]" />
      </div>

      {/* ----------------------------------------------------------------------
          LEFT PANEL (Top on Mobile/Tablet): BRAND SECTION
          ---------------------------------------------------------------------- */}
      <div className="relative z-10 flex w-full xl:h-full xl:w-1/2 flex-col justify-center xl:justify-between px-6 pt-20 pb-10 sm:p-16 md:p-24 xl:p-24 xl:border-r border-white/5 shrink-0">
        
        {/* Top Header Detail (Secured Status) */}
        <div className="flex items-center justify-center xl:justify-start gap-4 mb-16 xl:mb-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldCheck weight="fill" className="h-3 w-3 text-gold" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Secured Terminal</span>
          </div>
          <div className="h-[1px] w-8 bg-white/10 hidden xl:block" />
          <span className="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase hidden xl:block">ShotThatWithTife v2.0</span>
        </div>

        {/* Huge Typographic Lockup */}
        <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-4 md:gap-8 xl:mt-auto xl:mb-auto">
          {/* Subtle label */}
          <div className="flex xl:hidden items-center justify-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(200,169,126,0.8)]" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-gold-light uppercase">System Admin</span>
          </div>
          
          <h1 className="text-7xl sm:text-8xl md:text-9xl xl:text-8xl font-bold tracking-tight text-white leading-none xl:leading-[0.85]">
            ShotThat<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#C8A97E] via-[#F4D03F] to-[#C8A97E] drop-shadow-[0_0_30px_rgba(244,208,63,0.3)]">
              WithTife.
            </span>
          </h1>
          
          <p className="text-text-secondary text-sm md:text-xl xl:text-xl font-light leading-relaxed max-w-xs md:max-w-xl xl:max-w-md border-t xl:border-t-0 xl:border-l border-gold/30 pt-6 xl:pt-0 xl:pl-6 hidden sm:block">
            The photography command center. Manage your legacy with precision and style.
          </p>
        </div>

        {/* Footer info (Desktop only) */}
        <div className="mt-auto hidden xl:flex items-center justify-between text-[10px] text-text-muted font-medium tracking-widest uppercase opacity-40">
          <span>Sentinel Protocol</span>
          <span>© 2026 Secured</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RIGHT PANEL (Bottom on Mobile/Tablet): LOGIN TERMINAL
          ---------------------------------------------------------------------- */}
      <div className="relative z-10 flex w-full xl:h-full xl:w-1/2 items-start xl:items-center justify-center px-6 pt-0 pb-20 sm:pb-32 xl:p-16 shrink-0">
        
        <div className="w-full max-w-[420px] md:max-w-[500px] xl:max-w-[420px] flex flex-col">

          {/* Floating Form Container */}
          <div className="flex flex-col gap-8 rounded-[2.5rem] bg-white/[0.03] border border-white/[0.08] p-8 md:p-12 xl:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group">
            
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-4xl xl:text-3xl font-medium text-white tracking-tight">Access Portal</h2>
              <p className="text-xs md:text-base xl:text-sm text-text-muted">Initialize your secure administrative session.</p>
            </div>

            <form action={formAction} className="flex flex-col gap-6">
              
              {/* Email Field */}
              <div className="flex flex-col gap-2 group/field">
                <Label htmlFor="email" className="text-[10px] md:text-xs xl:text-[11px] uppercase tracking-widest text-text-secondary group-focus-within/field:text-gold transition-colors">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within/field:text-gold transition-colors">
                    <EnvelopeSimple weight="light" className="h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5" />
                  </div>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    required 
                    className="h-14 md:h-16 xl:h-14 pl-12 md:pl-14 pr-4 rounded-2xl bg-black/40 border-white/10 text-white placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Password Field */}
              <div className="flex flex-col gap-2 group/field">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] md:text-xs xl:text-[11px] uppercase tracking-widest text-text-secondary group-focus-within/field:text-gold transition-colors">
                    Security Key
                  </Label>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] md:text-xs xl:text-[10px] font-medium uppercase tracking-wider text-text-muted hover:text-gold transition-colors focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Reveal'}
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within/field:text-gold transition-colors">
                    <LockKey weight="light" className="h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5" />
                  </div>
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••••••"
                    required 
                    className="h-14 md:h-16 xl:h-14 pl-12 md:pl-14 pr-12 rounded-2xl bg-black/40 border-white/10 text-white placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold transition-all duration-300"
                  />
                  {/* Show/Hide Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlash weight="light" className="h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5" />
                    ) : (
                      <Eye weight="light" className="h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error State */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                state?.error ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <p className="text-xs md:text-sm text-red-200/80 leading-relaxed font-medium">{state?.error}</p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isPending}
                className="group/btn relative mt-2 h-14 md:h-16 xl:h-14 w-full rounded-2xl bg-white text-black hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center overflow-hidden border border-transparent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                
                <span className="font-bold text-[15px] md:text-lg xl:text-[15px] tracking-widest z-10 mr-2 uppercase">
                  {isPending ? 'Authenticating' : 'Initialize Session'}
                </span>
                
                <div className="z-10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-1">
                  {isPending ? (
                    <Spinner className="h-4 w-4 md:h-5 md:w-5 xl:h-4 xl:w-4 animate-spin" />
                  ) : (
                    <ArrowRight weight="bold" className="h-4 w-4 md:h-5 md:w-5 xl:h-4 xl:w-4" />
                  )}
                </div>
              </Button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  )
}
