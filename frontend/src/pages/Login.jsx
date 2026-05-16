import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'

export default function Login() {
  const { state, signIn, trySignInSilently, getBasicUserInfo } = useAuthContext()
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [triedSilent, setTriedSilent] = useState(false)

  // Attempt silent re-auth on first load — restores session without user interaction
  useEffect(() => {
    if (state.isAuthenticated || state.isLoading || triedSilent) return
    setTriedSilent(true)
    trySignInSilently().catch(() => {
      // Silent sign-in failed (no existing session) — show the Sign In button normally
    })
  }, [state.isLoading])

  // Once authenticated (either from silent or manual), fetch user info and redirect
  useEffect(() => {
    if (!state.isAuthenticated) return

    getBasicUserInfo()
      .then(info => {
        const email = info?.email || info?.username || ''
        const displayName = info?.displayName || info?.givenName || info?.username || email.split('@')[0]
        const userId = info?.sub || info?.username || email

        login(email, displayName, userId)
        toast('✓ Welcome back! Your voice is ready.')
        navigate('/speak')
      })
      .catch(() => {
        const email = state.username || ''
        login(email, email.split('@')[0], email)
        toast('✓ Signed in.')
        navigate('/speak')
      })
  }, [state.isAuthenticated])

  return (
    <div className="min-h-screen z-content grid grid-cols-1 lg:grid-cols-2">

      {/* ── LEFT HERO ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 py-12
                      bg-card border-r border-border">

        <h1 className="font-display font-black text-6xl leading-[0.9] tracking-[-3px] mb-5">
          Your voice.<br />
          <span className="text-blue">Always yours.</span>
        </h1>

        <p className="text-muted text-[15px] leading-relaxed max-w-sm mb-10">
          Bank your voice before it changes. Recover it from old recordings
          if it's already gone. Speak in real time in your own voice forever.
        </p>

        <div className="flex gap-8 mt-12 pt-8 border-t border-border">
          {[['< 2s','Speech synthesis latency'],['10 min','To bank your voice'],['Free','During beta']].map(([n,l]) => (
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
            Speak<span className="text-blue">Me</span>
          </div>

          <h2 className="font-display font-black text-3xl tracking-tight mb-1.5">
            Reclaim your voice!
          </h2>
          <p className="text-muted text-sm mb-8">
            Sign in to your SpeakMe account
          </p>

          {/* While loading or attempting silent sign-in, show a spinner instead of the button */}
          {(state.isLoading || !triedSilent) ? (
            <div className="w-full py-3.5 flex items-center justify-center gap-2 text-sm text-muted">
              <span className="w-4 h-4 border-2 border-muted/30 border-t-muted rounded-full animate-spin" />
              Checking session…
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full py-3.5 bg-blue text-bg rounded-xl
                         font-semibold text-sm tracking-wide
                         hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue/25
                         transition-all active:scale-[.98] flex items-center justify-center gap-2"
            >
              Try SpeakMe !
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
