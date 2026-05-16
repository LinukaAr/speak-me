import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

const TEAL = '#00c8d4'

function MicrophoneSVG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mglow" cx="50%" cy="38%" r="52%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.28" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient glow */}
      <ellipse cx="150" cy="185" rx="130" ry="170" fill="url(#mglow)" />

      {/* ── BODY ── */}
      {/* outer silhouette */}
      <path d="M110,58 Q110,26 150,26 Q190,26 190,58 L190,286 Q190,318 150,318 Q110,318 110,286 Z"
            stroke={TEAL} strokeWidth="1.5" fill="none" opacity="0.55" />

      {/* top + bottom cap ellipses */}
      <ellipse cx="150" cy="58"  rx="40" ry="13" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.65" />
      <ellipse cx="150" cy="286" rx="40" ry="13" stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.65" />

      {/* horizontal cross-section rings */}
      {[82,104,126,148,170,192,214,236,258].map(y => (
        <ellipse key={y} cx="150" cy={y} rx="40" ry="8"
                 stroke={TEAL} strokeWidth="0.55" fill="none" opacity="0.18" />
      ))}

      {/* vertical lines */}
      {[122,136,150,164,178].map(x => (
        <line key={x} x1={x} y1="58" x2={x} y2="286"
              stroke={TEAL} strokeWidth="0.55" opacity="0.14" />
      ))}

      {/* highlight band at top of capsule */}
      <path d="M112,58 Q112,32 150,32 Q188,32 188,58 L188,118 Q188,130 150,130 Q112,130 112,118 Z"
            stroke={TEAL} strokeWidth="0.8" fill={TEAL} fillOpacity="0.04" opacity="0.45" />

      {/* ── NECK ── */}
      <rect x="138" y="318" width="24" height="82" rx="5"
            stroke={TEAL} strokeWidth="1.2" fill="none" opacity="0.5" />
      {[336,356,376].map(y => (
        <line key={y} x1="138" y1={y} x2="162" y2={y}
              stroke={TEAL} strokeWidth="0.5" opacity="0.22" />
      ))}

      {/* ── BASE ── */}
      {/* connecting struts */}
      <line x1="140" y1="400" x2="70"  y2="420" stroke={TEAL} strokeWidth="1.1" opacity="0.38" />
      <line x1="160" y1="400" x2="230" y2="420" stroke={TEAL} strokeWidth="1.1" opacity="0.38" />
      <line x1="150" y1="400" x2="150" y2="416" stroke={TEAL} strokeWidth="1.1" opacity="0.38" />

      {/* base discs */}
      <ellipse cx="150" cy="422" rx="90" ry="22" stroke={TEAL} strokeWidth="1.3" fill="none" opacity="0.5" />
      <ellipse cx="150" cy="422" rx="64" ry="16" stroke={TEAL} strokeWidth="0.8" fill="none" opacity="0.28" />
      <ellipse cx="150" cy="440" rx="90" ry="14" stroke={TEAL} strokeWidth="0.7" fill="none" opacity="0.2" />
    </svg>
  )
}


export default function Login() {
  const { login, toast } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setLoading(true)
    setTimeout(() => {
      login('user@speakme.com')
      toast('✓ Welcome back! Your voice is ready.')
      navigate('/speak')
    }, 900)
  }

  return (
    <div className="min-h-screen z-content"
         style={{ display: 'grid', gridTemplateColumns: '55% 45%', background: '#061520', fontFamily: 'sans-serif' }}>

      {/* ── LEFT HERO ── */}
      <div className="relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg, #0d2a42 0%, #081e35 55%, #040f1c 100%)' }}>

        {/* holographic microphone */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
             style={{ opacity: 0.75 }}>
          <div style={{ width: '68%', height: '90%' }}>
            <MicrophoneSVG />
          </div>
        </div>

        {/* animated marketing cards */}
        <style>{`
          @keyframes border-flow {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes shimmer {
            0%   { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          @keyframes ring-pulse {
            0%, 100% { transform: scale(1);   opacity: 0.55; }
            50%       { transform: scale(1.25); opacity: 0; }
          }
          @keyframes card-float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-5px); }
          }
        `}</style>

        <div className="absolute inset-0 flex flex-col justify-center gap-5 px-14 pt-10">

          {/* Card 1 — Record New Voice */}
          <div style={{
            borderRadius: 20, padding: 2,
            background: 'linear-gradient(135deg, #00c8d4, #0077aa, #00c8d4)',
            backgroundSize: '300% 300%',
            animation: 'border-flow 3.5s ease infinite, card-float 6s ease-in-out infinite',
          }}>
            <div style={{
              borderRadius: 18,
              background: 'linear-gradient(135deg, #0b2236 0%, #0a1e30 100%)',
              padding: '22px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              overflow: 'hidden', position: 'relative',
              backdropFilter: 'blur(16px)',
            }}>
              {/* shimmer sweep */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                animation: 'shimmer 3.5s ease infinite',
              }} />

              {/* icon with pulse rings */}
              <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
                <div style={{
                  position: 'absolute', inset: -10, borderRadius: '50%',
                  border: '1px solid rgba(0,200,220,0.45)',
                  animation: 'ring-pulse 2s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%',
                  border: '1px solid rgba(0,200,220,0.3)',
                  animation: 'ring-pulse 2s ease-in-out infinite 0.4s',
                }} />
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(0,160,190,0.35), rgba(0,100,140,0.55))',
                  border: '1px solid rgba(0,200,220,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                       stroke="#7de8f4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8"  y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
                  textTransform: 'uppercase', color: '#00c8d4', marginBottom: 5,
                }}>Bank Your Voice</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 5 }}>
                  Record New Voice
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)' }}>
                  Preserve your voice in just 10 minutes
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Recover from Old Files */}
          <div style={{
            borderRadius: 20, padding: 2,
            background: 'linear-gradient(135deg, #7c4dff, #00c8d4, #7c4dff)',
            backgroundSize: '300% 300%',
            animation: 'border-flow 4s ease infinite 0.8s, card-float 7s ease-in-out infinite 1s',
          }}>
            <div style={{
              borderRadius: 18,
              background: 'linear-gradient(135deg, #0d1b30 0%, #0b1828 100%)',
              padding: '22px 24px',
              display: 'flex', alignItems: 'center', gap: 20,
              overflow: 'hidden', position: 'relative',
              backdropFilter: 'blur(16px)',
            }}>
              {/* shimmer sweep */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
                animation: 'shimmer 4s ease infinite 1.2s',
              }} />

              {/* icon with pulse rings */}
              <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
                <div style={{
                  position: 'absolute', inset: -10, borderRadius: '50%',
                  border: '1px solid rgba(124,77,255,0.45)',
                  animation: 'ring-pulse 2.4s ease-in-out infinite 0.3s',
                }} />
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(100,60,200,0.35), rgba(0,100,140,0.45))',
                  border: '1px solid rgba(124,77,255,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                       stroke="#c4aaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <polyline points="12,17 9,14 12,11" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '1.8px',
                  textTransform: 'uppercase', color: '#a080ff', marginBottom: 5,
                }}>Voice Archaeology™</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 5 }}>
                  Recover from Old Files
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)' }}>
                  Restore your voice from any old recording
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col justify-center px-14 py-12 relative" style={{ background: '#061520' }}>

        {/* back button + tagline */}
        <div className="flex items-center gap-4 mb-16">
          <button className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#00b8d4', border: 'none', cursor: 'pointer',
                  }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Reclaim Your Voice.</span>
        </div>

        {/* heading */}
        <h1 className="font-black text-white"
            style={{ fontSize: 54, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 10 }}>
          Welcome back
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 17, marginBottom: 44 }}>
          Sign in to SpeakMe
        </p>

        {/* primary CTA */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full font-bold text-white"
          style={{
            padding: '18px 24px',
            borderRadius: 50,
            background: 'linear-gradient(90deg, #00a8be 0%, #00c48a 100%)',
            border: 'none',
            fontSize: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 0 40px rgba(0,180,200,0.4), 0 0 80px rgba(0,180,200,0.15)',
            marginBottom: 14,
            transition: 'opacity 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? 'Signing in…' : "Let's Get Started! →"}
        </button>

        {/* family member CTA */}
        <button
          onClick={() => toast('👨‍👩‍👧 Enter the family access code sent to you by a patient')}
          className="w-full"
          style={{
            padding: '14px 24px',
            borderRadius: 6,
            background: 'transparent',
            border: '1px solid rgba(0,200,230,0.38)',
            color: 'rgba(0,200,230,0.72)',
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.4px',
            fontFamily: 'monospace',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,230,0.65)'; e.currentTarget.style.color = 'rgba(0,200,230,1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,200,230,0.38)'; e.currentTarget.style.color = 'rgba(0,200,230,0.72)' }}
        >
          [ was invited as a family member ] →
        </button>
      </div>
    </div>
  )
}
