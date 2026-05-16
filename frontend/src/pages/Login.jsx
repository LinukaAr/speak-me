import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'

export default function Login() {
  const { state, signIn } = useAuthContext()
  const { login, toast } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.isAuthenticated) {
      login(state.username || state.email || '')
      toast('✓ Welcome back! Your voice is ready.')
      navigate('/speak')
    }
  }, [state.isAuthenticated])

  return (
    <div className="min-h-screen z-content grid grid-cols-1 lg:grid-cols-2">

      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 py-12
                      bg-card border-r border-border">
        <div className="inline-flex items-center gap-2 bg-blue/10 border border-blue/20
                        px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest
                        uppercase text-blue mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue animate-[pulse-dot_2s_ease_infinite]" />
          Voice Restoration Platform
        </div>

        <h1 className="font-display font-black text-6xl leading-[0.9] tracking-[-3px] mb-5">
          Your voice.<br />
          <span className="text-blue">Always yours.</span>
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
              <div className="w-8 h-8 rounded-lg bg-blue/10 border border-blue/15
                              flex items-center justify-center text-base shrink-0">
                {icon}
              </div>
              {text}
            </div>
          ))}
        </div>

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
            <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">🎙</div>
            Silent<span className="text-blue">Stage</span>
          </div>

          <h2 className="font-display font-black text-3xl tracking-tight mb-1.5">
            Welcome back
          </h2>
          <p className="text-muted text-sm mb-8">
            Sign in to your SilentStage account
          </p>

          <button
            onClick={() => signIn()}
            disabled={state.isLoading}
            className="w-full py-3.5 bg-blue text-bg rounded-xl
                       font-semibold text-sm tracking-wide
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue/25
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                       transition-all active:scale-[.98] flex items-center justify-center gap-2"
          >
            {state.isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In→'
            )}
          </button>

          <p className="text-center text-xs text-muted mt-8">
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
