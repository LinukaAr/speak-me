import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

export default function Login() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [isReg, setIsReg]       = useState(false)

  const handleSubmit = () => {
    if (!email || !password) { toast('⚠️ Please enter email and password'); return }
    setLoading(true)
    setTimeout(() => {
      login(email)
      toast('✓ Welcome back, Aiden! Your voice is ready.')
      navigate('/speak')
    }, 900)
  }

  const inputCls = `w-full bg-card border border-border rounded-xl px-4 py-3
                    text-ink text-sm placeholder:text-subtle
                    focus:border-red/40 focus:bg-card/80 transition-colors outline-none`

  return (
    <div className="min-h-screen z-content grid grid-cols-1 lg:grid-cols-2">

      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 py-12
                      bg-card border-r border-border">
        <div className="inline-flex items-center gap-2 bg-red/10 border border-red/20
                        px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest
                        uppercase text-red mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-[pulse-dot_2s_ease_infinite]" />
          Voice Restoration Platform
        </div>

        <h1 className="font-display font-black text-6xl leading-[0.9] tracking-[-3px] mb-5">
          Your voice.<br />
          <span className="text-red">Always yours.</span>
        </h1>

        <p className="text-muted text-[15px] leading-relaxed max-w-sm mb-10">
          Bank your voice before it changes. Recover it from old recordings
          if it's already gone. Speak in real time in your own voice — forever.
        </p>

        <div className="flex flex-col gap-3">
          {[
            ['🎙', 'Voice cloning via ElevenLabs — 10 min to bank'],
            ['🔍', 'Voice Archaeology™ — recover from old recordings'],
            ['👨‍👩‍👧', 'Family access with emergency SOS protocols'],
            ['🌍', 'Multilingual — Sinhala, Tamil, Hindi + 70 more (future)'],
            ['🤟', 'Sign language camera input — planned post-hackathon'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-sm text-muted">
              <div className="w-8 h-8 rounded-lg bg-red/10 border border-red/15
                              flex items-center justify-center text-base shrink-0">
                {icon}
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-12 pt-8 border-t border-border">
          {[['376K+','ALS patients by 2040'],['< 2s','Synthesis latency'],['91%','Voice similarity']].map(([n,l]) => (
            <div key={l}>
              <div className="font-display font-black text-2xl text-ink">{n}</div>
              <div className="text-[11px] text-muted mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="flex flex-col justify-center px-8 py-12 max-w-md mx-auto w-full lg:mx-0 lg:max-w-none">
        <div className="max-w-sm mx-auto w-full">

          <div className="lg:hidden flex items-center gap-2.5 font-display font-black text-xl mb-8">
            <div className="w-8 h-8 rounded-lg bg-red flex items-center justify-center">🎙</div>
            Silent<span className="text-red">Stage</span>
          </div>

          <h2 className="font-display font-black text-3xl tracking-tight mb-1.5">
            {isReg ? 'Create account' : 'Welcome back'}
          </h2>
          <p className="text-muted text-sm mb-8">
            {isReg ? 'Start restoring your voice today' : 'Sign in to your SilentStage account'}
          </p>

          <div className="flex flex-col gap-4">
            {isReg && (
              <div>
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input className={inputCls} type="text" placeholder="Your full name" />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                className={inputCls}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                className={inputCls}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-5 py-3.5 bg-red text-white rounded-xl
                       font-semibold text-sm tracking-wide
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red/25
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                       transition-all active:scale-[.98]"
          >
            {loading ? 'Signing in…' : isReg ? 'Create Account →' : 'Sign In →'}
          </button>

          <div className="flex items-center gap-3 my-5 text-[11px] text-subtle">
            <div className="flex-1 h-px bg-border" />or continue with<div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['🔵','Google'], ['🍎','Apple']].map(([ic, label]) => (
              <button
                key={label}
                onClick={() => { login(`user@${label.toLowerCase()}.com`); navigate('/speak') }}
                className="flex items-center justify-center gap-2
                           py-2.5 bg-card border border-border rounded-xl
                           text-sm text-ink hover:border-border2 hover:bg-white/5
                           transition-all"
              >
                {ic} {label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted mt-5">
            {isReg ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsReg(p => !p)}
              className="text-red hover:underline"
            >
              {isReg ? 'Sign in' : 'Create one'}
            </button>
          </p>
          <p className="text-center text-xs text-muted mt-2">
            <button
              onClick={() => toast('👨‍👩‍👧 Enter the family access code sent to you by a patient')}
              className="text-muted hover:text-ink transition-colors"
            >
              I was invited as a family member →
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
