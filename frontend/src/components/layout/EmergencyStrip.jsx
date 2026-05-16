import { useApp } from '@/context/AppContext'

export default function EmergencyStrip() {
  const { toast } = useApp()

  return (
    <div className="flex items-center justify-between
                    bg-red/8 border border-red/25 rounded-xl px-5 py-3.5 mb-5">
      <div>
        <p className="text-sm font-bold text-ink">🚨 Emergency Alert</p>
        <p className="text-[11px] text-muted mt-0.5">
          Sends SMS + location to Sarah, Michael and 3 emergency contacts
        </p>
      </div>
      <button
        onClick={() => toast('🚨 EMERGENCY ALERT SENT — All contacts notified with your location!')}
        className="bg-red text-white text-xs font-black tracking-wider
                   px-4 py-2.5 rounded-lg hover:bg-red/80 transition-colors
                   shadow-lg shadow-red/20 active:scale-95"
      >
        SEND ALERT
      </button>
    </div>
  )
}
