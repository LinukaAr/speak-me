import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App.jsx'
import { Btn, Input, PulseDot } from '../components/UI.jsx'

export default function LoginPage() {
  const { login, showToast } = useApp()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { showToast('⚠️ Please fill in all fields', 'warning'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1100))
    login()
    navigate('/speak')
    setLoading(false)
  }

  const handleSSO = async (provider) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login()
    showToast(`✓ Signed in with ${provider}`, 'success')
    navigate('/speak')
    setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

      {/* ── LEFT HERO ── */}
      <div style={{
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px 64px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:-120, left:-80, width:400, height:400, borderRadius:'50%', background:'rgba(232,54,93,.05)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, right:-60, width:300, height:300, borderRadius:'50%', background:'rgba(155,109,255,.05)', filter:'blur(60px)', pointerEvents:'none' }} />

        <div className="animate-fadeUp" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--red-dim)', border: '1px solid var(--red-glow)',
          padding: '5px 14px', borderRadius: 'var(--r-full)',
          fontSize: 11, fontWeight: 700, letterSpacing: '1.5px',
          textTransform: 'uppercase', color: 'var(--red)', marginBottom: 32,
          width: 'fit-content',
        }}>
          <PulseDot color="var(--red)" />
          ElevenLabs Voice Cloning
        </div>

        <h1 className="animate-fadeUp delay-1" style={{
          fontSize: 'clamp(42px, 5vw, 68px)',
          lineHeight: .93, marginBottom: 20,
        }}>
          Your voice.<br />
          <span style={{ color: 'var(--red)' }}>Always yours.</span>
        </h1>

        <p className="animate-fadeUp delay-2" style={{
          fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7,
          maxWidth: 380, marginBottom: 48,
        }}>
          Bank your voice before it changes. Recover it from old recordings if it's already gone. Speak in real time — in your own voice, forever.
        </p>

        <div className="animate-fadeUp delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['🎙', 'ElevenLabs voice cloning — 10 minutes to bank'],
            ['🔬', 'Voice Recovery — recover from old recordings'],
            ['👨‍👩‍👧', 'Family access with emergency protocols'],
            ['🌍', 'Multilingual — Sinhala, Tamil, Hindi + 70 more (future)'],
            ['🤟', 'Sign language camera input — coming in Phase 3'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 14, color: 'var(--text-2)' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'var(--red-dim)', border: '1px solid var(--red-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{icon}</div>
              {text}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="animate-fadeUp delay-4" style={{ display: 'flex', gap: 32, marginTop: 52 }}>
          {[['376K+','ALS patients by 2040'],['1B+','People need speech support'],['<2s','Synthesis latency']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--red)', letterSpacing: '-.03em' }}>{num}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="animate-fadeIn" style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '60px',
        maxWidth: 500, margin: '0 auto', width: '100%',
      }}>
        <h2 style={{ fontSize: 32, marginBottom: 6 }}>
          {isRegister ? 'Create account' : 'Welcome back'}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 32 }}>
          {isRegister ? 'Start restoring your voice today' : 'Sign in to your SpeakMe account'}
        </p>

        <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        {isRegister && <Input label="Full name" type="text" placeholder="Your full name" />}

        <Btn
          size="lg"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}
        >
          {loading
            ? <><span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin .8s linear infinite' }} />Signing in…</>
            : isRegister ? 'Create Account →' : 'Sign In →'
          }
        </Btn>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 12, color: 'var(--text-3)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          or continue with
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* SSO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[['🔵','Google'],['🍎','Apple']].map(([icon, name]) => (
            <button key={name} onClick={() => handleSSO(name)} style={{
              padding: '11px', borderRadius: 11, background: 'var(--card)',
              border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 13, cursor: 'pointer', transition: 'all var(--t-base)',
              fontFamily: 'var(--font-body)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--card-hi)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)' }}
            >
              {icon} {name}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <span style={{ color: 'var(--red)', cursor: 'pointer' }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Sign in' : 'Create one'}
          </span>
        </p>
      </div>
    </div>
  )
}
