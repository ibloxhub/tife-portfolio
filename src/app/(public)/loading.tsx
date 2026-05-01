export default function PublicLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_3s_linear_infinite]" />
          {/* Inner pulse */}
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/30 shadow-[0_0_30px_rgba(200,169,126,0.15)] animate-pulse">
            <span className="text-gold text-lg font-bold uppercase tracking-widest">T</span>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50 animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  )
}
