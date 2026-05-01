export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-gold animate-spin" />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
          Loading Data...
        </span>
      </div>
    </div>
  )
}
