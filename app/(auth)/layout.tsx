export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-sm font-mono font-bold">BT</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Bank<span className="text-primary">Training</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
            Система подготовки сотрудников
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
