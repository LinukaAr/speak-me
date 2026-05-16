import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'
import {
  Mic, MessageSquare, Mic2, Search, Users, Hand,
  Settings, Globe, Menu, X, ChevronRight,
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/speak',         label: 'Speak',              Icon: Mic            },
  { to: '/phrases',       label: 'Quick Phrases',      Icon: MessageSquare  },
  { to: '/voice-banking', label: 'Voice Banking',      Icon: Mic2           },
  { to: '/archaeology',   label: 'Voice Archaeology',  Icon: Search         },
  { to: '/settings',      label: 'Settings',           Icon: Settings       },
]

export default function Navbar() {
  const { state } = useAuthContext()
  const { user, voiceId } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!state.isAuthenticated) return null

  const desktopLinkClass = ({ isActive }) => clsx(
    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border',
    isActive
      ? 'bg-blue/10 text-ink border-blue/25'
      : 'text-muted hover:text-ink hover:bg-blue/5 border-transparent'
  )

  const mobileLinkClass = ({ isActive }) => clsx(
    'flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border',
    isActive
      ? 'bg-blue/10 text-ink border-blue/20'
      : 'text-muted hover:text-ink hover:bg-blue/5 border-transparent'
  )

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-2 h-[65px] px-4 md:px-8">

          {/* Logo */}
          <button
            onClick={() => { navigate('/speak'); closeMenu() }}
            className="flex items-center gap-2.5 font-display font-black text-lg tracking-tight shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
              <Mic size={16} className="text-white" />
            </div>
            <span>Speak<span className="text-blue">Me</span></span>
          </button>

          {/* Desktop nav tabs */}
          <nav className="hidden md:flex flex-1 min-w-0 justify-center items-center gap-0.5 overflow-x-auto hide-scrollbar">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={desktopLinkClass}>
                <Icon size={13} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            {voiceId && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold
                              bg-green/10 border border-green/20 text-green
                              px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_ease_infinite]" />
                Voice Active
              </div>
            )}

            {/* Avatar — desktop only */}
            <button
              onClick={() => navigate('/settings')}
              className="hidden md:flex w-8 h-8 rounded-full bg-gradient-to-br from-blue to-blue3
                         items-center justify-center
                         font-display font-black text-xs text-white
                         hover:scale-105 transition-transform"
            >
              {user?.initials ?? '…'}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg
                         hover:bg-blue/5 transition-colors"
            >
              {menuOpen ? <X size={20} className="text-ink" /> : <Menu size={20} className="text-ink" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />

          <div className="fixed top-[65px] left-0 right-0 z-40 md:hidden
                          bg-bg/95 backdrop-blur-2xl border-b border-border
                          px-4 py-4 flex flex-col gap-1">
            {voiceId && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold
                              bg-green/10 border border-green/20 text-green
                              px-3 py-2 rounded-full self-start mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_ease_infinite]" />
                Voice Active
              </div>
            )}

            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={mobileLinkClass} onClick={closeMenu}>
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                <ChevronRight size={14} className="text-subtle" />
              </NavLink>
            ))}

            <div className="mt-3 pt-3 border-t border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-blue3
                              flex items-center justify-center
                              font-display font-black text-xs text-white shrink-0">
                {user?.initials ?? '…'}
              </div>
              <span className="text-sm text-muted">{user?.email ?? user?.name ?? 'Account'}</span>
            </div>
          </div>
        </>
      )}
    </>
  )
}
