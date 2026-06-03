'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#C8A97E"
        options={{ showSpinner: false, easing: 'ease', speed: 400 }}
      />
    </>
  )
}
