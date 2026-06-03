'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  SpeakerHigh,
  SpeakerX,
  CornersOut,
  CornersIn,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type VideoSource = 'file' | 'youtube' | 'vimeo'

interface CustomVideoPlayerProps {
  src: string
  type: VideoSource
  poster?: string
  className?: string
}

function detectType(url: string): VideoSource {
  if (url.includes('youtube.com/embed') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  return 'file'
}

export function CustomVideoPlayer({ src, type: typeProp, poster, className }: CustomVideoPlayerProps) {
  const type = typeProp ?? detectType(src)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isTouching, setIsTouching] = useState(false)

  // ── Format time ─────────────────────────────────────────────────────────────
  function formatTime(secs: number) {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // ── Auto-hide controls ───────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    } else {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 3000)
    }
  }, [isPlaying])

  // ── Native video event handlers ──────────────────────────────────────────────
  function handleTimeUpdate() {
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
    setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
  }

  function handleLoadedMetadata() {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }

  function handleEnded() { setIsPlaying(false) }

  // ── Play / Pause ─────────────────────────────────────────────────────────────
  function togglePlay() {
    if (type === 'file' && videoRef.current) {
      if (isPlaying) { videoRef.current.pause() } else { videoRef.current.play() }
      setIsPlaying(!isPlaying)
    } else {
      // For embeds: use postMessage
      const iframe = iframeRef.current
      if (!iframe) return
      if (type === 'youtube') {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: isPlaying ? 'pauseVideo' : 'playVideo' }),
          '*'
        )
      } else if (type === 'vimeo') {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ method: isPlaying ? 'pause' : 'play' }),
          '*'
        )
      }
      setIsPlaying(!isPlaying)
    }
    resetHideTimer()
  }

  // ── Mute ─────────────────────────────────────────────────────────────────────
  function toggleMute() {
    if (type === 'file' && videoRef.current) {
      videoRef.current.muted = !isMuted
    } else {
      const iframe = iframeRef.current
      if (!iframe) return
      if (type === 'youtube') {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: isMuted ? 'unMute' : 'mute' }),
          '*'
        )
      }
    }
    setIsMuted(!isMuted)
  }

  // ── Progress scrub ───────────────────────────────────────────────────────────
  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const pct = parseFloat(e.target.value)
    setProgress(pct)
    if (type === 'file' && videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (pct / 100) * videoRef.current.duration
    }
  }

  // ── Fullscreen ───────────────────────────────────────────────────────────────
  function toggleFullscreen() {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    function handleFSChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFSChange)
    return () => document.removeEventListener('fullscreenchange', handleFSChange)
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      onTouchStart={() => { setIsTouching(true); setControlsVisible(true) }}
      className={cn('relative group bg-black rounded-2xl overflow-hidden aspect-video', className)}
    >
      {/* ── Video / Iframe ── */}
      {type === 'file' ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
      ) : (
        <iframe
          ref={iframeRef}
          src={src}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title="Video player"
        />
      )}

      {/* ── Big play/pause overlay (centre) ── */}
      {type === 'file' && (
        <button
          onClick={togglePlay}
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          <div className="h-16 w-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xl">
            <Play weight="fill" className="h-7 w-7 text-white ml-1" />
          </div>
        </button>
      )}

      {/* ── Controls bar ── */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 transition-all duration-300',
          (controlsVisible || !isPlaying || isTouching) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}
      >
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        <div className="relative px-4 pb-3 pt-6 flex flex-col gap-2">
          {/* Progress bar — only for native video */}
          {type === 'file' && (
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleScrub}
                className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-[#C8A97E]
                  [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(200,169,126,0.8)]
                  [&::-webkit-slider-runnable-track]:rounded-full"
                style={{
                  background: `linear-gradient(to right, #C8A97E ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                }}
              />
            </div>
          )}

          {/* Buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white hover:text-gold transition-colors"
              >
                {isPlaying
                  ? <Pause weight="fill" className="h-4 w-4" />
                  : <Play weight="fill" className="h-4 w-4 ml-0.5" />
                }
              </button>

              {/* Time — native only */}
              {type === 'file' && duration > 0 && (
                <span className="text-[11px] text-white/60 font-mono tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                {isMuted
                  ? <SpeakerX weight="bold" className="h-4 w-4" />
                  : <SpeakerHigh weight="bold" className="h-4 w-4" />
                }
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="h-8 w-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              {isFullscreen
                ? <CornersIn weight="bold" className="h-4 w-4" />
                : <CornersOut weight="bold" className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
