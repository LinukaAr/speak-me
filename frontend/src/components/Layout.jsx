import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../App.jsx'
import { PulseDot, Avatar } from './UI.jsx'

const NAV = [
  { to: '/speak',       label: '🎙 Speak'           },
  { to: '/phrases',     label: '💬 Quick Phrases'    },
  { to: '/archaeology', label: '🔬 Voice Recovery' },  
  { to: '/family',      label: '👨‍👩‍👧 Family Access'    },
  { to: '/sign',        label: '🤟 Sign Language'    },
  { to: '/settings',    label: '⚙️ Settings'          },
]

export default function Layout() {
  const { user, showToast } = useApp()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* ── TOP NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', height: 64,
        background: 'rgba(7,7,15,.88)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/speak')}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 20,
            fontWeight: 800, letterSpacing: '-.04em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            userSelect: 'none',
          }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>
            🎙
          </div>
          Speak<span style={{ color: 'var(--red)' }}>Me</span>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <button style={{
                  padding: '7px 13px', borderRadius: 9, fontSize: 12, fontWeight: 500,
                  border: isActive ? '1px solid rgba(232,54,93,.25)' : '1px solid transparent',
                  background: isActive ? 'rgba(232,54,93,.10)' : 'transparent',
                  color: isActive ? 'var(--text)' : 'var(--text-3)',
                  cursor: 'pointer', transition: 'all var(--t-base)',
                  fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => { if (!isActive) { e.target.style.color = 'var(--text-2)'; e.target.style.background = 'rgba(255,255,255,.04)' } }}
                  onMouseLeave={e => { if (!isActive) { e.target.style.color = 'var(--text-3)'; e.target.style.background = 'transparent' } }}
                >
                  {label}
                </button>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right: voice status + user avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user?.voiceId && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 'var(--r-full)',
              background: 'var(--green-dim)',
              border: '1px solid rgba(15,219,138,.25)',
              fontSize: 11, fontWeight: 600, color: 'var(--green)',
            }}>
              <PulseDot color="var(--green)" size={5} />
              Voice Active
            </div>
          )}
          <Avatar
            initials={user?.initials || '?'}
            size={32}
            gradient="linear-gradient(135deg,var(--red),var(--purple))"
          />
        </div>
      </nav>

      {/* ── PAGE CONTENT ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
