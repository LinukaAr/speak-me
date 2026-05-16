import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/speak',       label: '🎙 Speak'             },
  { to: '/phrases',     label: '💬 Quick Phrases'      },
  { to: '/archaeology', label: '🔍 Voice Archaeology'  },
  { to: '/family',      label: '👨‍👩‍👧 Family Access'      },
  { to: '/sign',        label: '🤟 Sign Language'      },
  { to: '/settings',    label: '⚙️ Settings'           },
]

export default function Navbar() {
  const { user, voiceId } = useApp()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-2xl z-content">
      <div className="flex items-center justify-between px-8 h-[65px]">

        {/* Logo */}
        <button
          onClick={() => navigate('/speak')}
          className="flex items-center gap-2.5 font-display font-black text-lg tracking-tight shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center text-sm">🎙</div>
          <span>Speak<span className="text-blue">Me</span></span>
        </button>

        {/* Nav tabs */}
        <nav className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => clsx(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'bg-blue/10 text-ink border border-blue/25'
                  : 'text-muted hover:text-ink hover:bg-blue/5 border border-transparent'
              )}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5 shrink-0">
          {voiceId && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold
                            bg-green/10 border border-green/20 text-green
                            px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_ease_infinite]" />
              Voice Active
            </div>
          )}
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-blue3
                       flex items-center justify-center
                       font-display font-black text-xs text-white
                       hover:scale-105 transition-transform"
          >
            {user.initials}
          </button>
        </div>
      </div>
    </header>
  )
}
