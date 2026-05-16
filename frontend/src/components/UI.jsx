import React from 'react'

// ── BUTTON ────────────────────────────────────────
export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, style, className }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font-body)', fontWeight: 600,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--t-base)', borderRadius: 'var(--r-md)',
    opacity: disabled ? .45 : 1,
    userSelect: 'none',
  }
  const sizes = {
    sm: { padding: '7px 16px',  fontSize: 13 },
    md: { padding: '11px 22px', fontSize: 14 },
    lg: { padding: '14px 32px', fontSize: 15 },
  }
  const variants = {
    primary: {
      background: 'var(--red)',
      color: '#fff',
      boxShadow: '0 2px 12px rgba(232,54,93,.25)',
    },
    secondary: {
      background: 'var(--card)',
      color: 'var(--text)',
      border: '1px solid var(--border2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-2)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--red-dim)',
      color: 'var(--red)',
      border: '1px solid var(--red-glow)',
    },
    success: {
      background: 'var(--green-dim)',
      color: 'var(--green)',
      border: '1px solid rgba(15,219,138,.3)',
    },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      className={className}
    >
      {children}
    </button>
  )
}

// ── CARD ──────────────────────────────────────────
export function Card({ children, style, className, onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        transition: 'all var(--t-base)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}

// ── BADGE ─────────────────────────────────────────
export function Badge({ children, color = 'red', style }) {
  const colors = {
    red:    { bg: 'var(--red-dim)',    text: 'var(--red)',    border: 'var(--red-glow)' },
    green:  { bg: 'var(--green-dim)', text: 'var(--green)',  border: 'rgba(15,219,138,.3)' },
    amber:  { bg: 'var(--amber-dim)', text: 'var(--amber)',  border: 'rgba(245,158,11,.3)' },
    blue:   { bg: 'var(--blue-dim)',  text: 'var(--blue)',   border: 'rgba(64,128,255,.3)' },
    purple: { bg: 'var(--purple-dim)',text: 'var(--purple)', border: 'rgba(155,109,255,.3)' },
    muted:  { bg: 'rgba(255,255,255,.04)', text: 'var(--text-2)', border: 'var(--border)' },
  }
  const c = colors[color] || colors.muted
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 'var(--r-full)',
      fontSize: 11, fontWeight: 600, letterSpacing: '.4px',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      ...style,
    }}>
      {children}
    </span>
  )
}

// ── PULSE DOT ─────────────────────────────────────
export function PulseDot({ color = 'var(--red)', size = 6 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: color,
      animation: 'pulse 2s ease infinite',
    }} />
  )
}

// ── WAVEFORM ──────────────────────────────────────
export function Waveform({ bars = 20, color = 'var(--red)', height = 56, active = true }) {
  const heights = [22,35,48,30,54,42,28,50,38,60,44,32,52,40,26,56,34,46,58,24]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: color,
          height: heights[i % heights.length],
          animation: active ? `waveBar ${.6 + (i % 4) * .1}s ease ${(i * .04).toFixed(2)}s infinite` : 'none',
          transform: active ? undefined : 'scaleY(.25)',
          opacity: active ? 1 : .35,
          transition: 'opacity .3s ease',
        }} />
      ))}
    </div>
  )
}

// ── SECTION EYEBROW ───────────────────────────────
export function Eyebrow({ children, color = 'var(--red)' }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 11, fontWeight: 700, letterSpacing: '2px',
      textTransform: 'uppercase', color,
      marginBottom: 16,
    }}>
      <span style={{ width: 18, height: 1, background: color, display: 'inline-block' }} />
      {children}
    </div>
  )
}

// ── DIVIDER ───────────────────────────────────────
export function Divider({ margin = '20px 0' }) {
  return <div style={{ height: 1, background: 'var(--border)', margin }} />
}

// ── INPUT ─────────────────────────────────────────
export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
          color: 'var(--text-2)', marginBottom: 7,
        }}>
          {label}
        </label>
      )}
      <input style={{
        width: '100%',
        background: 'var(--card)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: '12px 16px',
        color: 'var(--text)', fontSize: 14,
        outline: 'none',
        transition: 'border-color var(--t-base)',
        fontFamily: 'var(--font-body)',
      }}
        onFocus={e => e.target.style.borderColor = 'rgba(232,54,93,.45)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props}
      />
    </div>
  )
}

// ── TOGGLE ────────────────────────────────────────
export function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: on ? 'var(--green)' : 'var(--border2)',
        position: 'relative', cursor: 'pointer',
        transition: 'background var(--t-base)', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 4, borderRadius: '50%',
        width: 16, height: 16, background: '#fff',
        left: on ? 22 : 4, transition: 'left var(--t-base)',
        boxShadow: '0 1px 4px rgba(0,0,0,.3)',
      }} />
    </div>
  )
}

// ── PHRASE CARD ───────────────────────────────────
export function PhraseCard({ phrase, onPlay, playing }) {
  return (
    <div
      onClick={() => onPlay(phrase)}
      style={{
        background: playing ? 'rgba(15,219,138,.06)' : 'var(--card)',
        border: `1.5px solid ${playing ? 'rgba(15,219,138,.4)' : phrase.emergency ? 'rgba(232,54,93,.25)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)',
        padding: '18px', cursor: 'pointer',
        transition: 'all var(--t-base)',
        boxShadow: playing ? 'var(--shadow-green)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!playing) e.currentTarget.style.borderColor = 'var(--red-glow)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
      onMouseLeave={e => { if (!playing) e.currentTarget.style.borderColor = phrase.emergency ? 'rgba(232,54,93,.25)' : 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = playing ? 'var(--shadow-green)' : 'none' }}
    >
      <span style={{ fontSize: 26, display: 'block', marginBottom: 10 }}>{phrase.icon}</span>
      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, marginBottom: 10 }}>{phrase.text}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--surf)', padding: '2px 8px', borderRadius: 6 }}>{phrase.cat}</span>
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{phrase.uses} uses</span>
      </div>
    </div>
  )
}

// ── AVATAR ────────────────────────────────────────
export function Avatar({ initials, gradient, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: gradient || 'linear-gradient(135deg,var(--red),var(--purple))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800,
      fontSize: size * 0.38, color: '#fff', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}
