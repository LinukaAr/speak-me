import { useApp } from '@/context/AppContext'

export default function Toast() {
  const { toasts } = useApp()
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-[fade-up_.3s_ease_both] bg-card border border-border2
                     px-5 py-3 rounded-xl text-sm text-ink shadow-2xl
                     flex items-center gap-2 whitespace-nowrap"
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
