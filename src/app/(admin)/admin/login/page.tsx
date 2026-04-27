'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowRight, Spinner } from '@phosphor-icons/react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row bg-charcoal text-text-primary">
      {/* Brand Panel (Left on Desktop, Top on Mobile) */}
      <div className="flex w-full flex-col justify-center bg-black/40 p-8 md:w-1/2 md:p-16 lg:p-24 relative overflow-hidden">
        {/* Subtle noise texture */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="z-10 flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-[10px] font-medium tracking-[0.2em] text-gold-light uppercase">Platform Admin</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-tight">
            ShotThat<br />WithTife
          </h1>
          <p className="text-text-secondary text-lg font-light leading-relaxed max-w-sm">
            Behind the lens.<br />Behind the scenes.
          </p>
        </div>
      </div>

      {/* Form Panel (Right on Desktop, Bottom on Mobile) */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2 md:p-16 relative">
        <div className="w-full max-w-[400px]">
          
          {/* The "Double-Bezel" Outer Shell */}
          <div className="rounded-[2rem] bg-white/[0.02] p-1.5 ring-1 ring-white/5 backdrop-blur-xl">
            {/* Inner Core */}
            <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              
              <div className="mb-8 flex flex-col gap-2">
                <h2 className="text-2xl font-medium text-white">Access Portal</h2>
                <p className="text-sm text-text-muted">Enter your credentials to continue.</p>
              </div>

              <form action={formAction} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-text-secondary text-xs uppercase tracking-widest">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    className="bg-black/50 border-white/10 text-white placeholder:text-text-muted focus-visible:ring-gold focus-visible:border-gold h-12 rounded-xl"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-text-secondary text-xs uppercase tracking-widest">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="bg-black/50 border-white/10 text-white placeholder:text-text-muted focus-visible:ring-gold focus-visible:border-gold h-12 rounded-xl"
                  />
                </div>

                {state?.error && (
                  <div className="rounded-lg bg-red-500/10 p-3 border border-red-500/20">
                    <p className="text-sm text-red-400 font-medium">{state.error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="group relative mt-4 h-14 w-full rounded-full bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-between pl-6 pr-2 overflow-hidden"
                >
                  <span className="font-medium text-base z-10">{isPending ? 'Authenticating...' : 'Sign In'}</span>
                  
                  {/* Button-in-Button pattern */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 z-10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    {isPending ? (
                      <Spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRight weight="bold" className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </form>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
