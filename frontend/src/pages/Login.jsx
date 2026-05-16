import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

const TEAL   = '#00c8d4'
const PURPLE = '#a080ff'
const W      = 840  // wave SVG width — integer-freq ensures seamless tiling

// Builds a seamlessly tiling sine wave SVG path.
// Using integer frequencies guarantees y(0) === y(W), so the double-copy scroll loops perfectly.
function wavePath(amp, freq, phase, cy = 70) {
  const pts = []
  for (let x = 0; x <= W; x += 3) {
    const y = cy + amp * Math.sin((x / W) * Math.PI * 2 * freq + phase)
    pts.push(`${x === 0 ? 'M' : 'L'}${x},${y}`)
  }
  return pts.join(' ')
}

const WAVE_LAYERS = [
  { d: wavePath(22, 4, 0),        stroke: TEAL,   sw: 2.2, opacity: 1,    dur: '3.5s'  },
  { d: wavePath(14, 4, Math.PI / 2), stroke: TEAL, sw: 1.4, opacity: 0.5, dur: '5s'    },
  { d: wavePath(30, 2, 0.8),      stroke: PURPLE, sw: 1.1, opacity: 0.28, dur: '6.5s'  },
  { d: wavePath(9,  6, 2.1),      stroke: TEAL,   sw: 0.7, opacity: 0.18, dur: '2.8s'  },
]

const BARS = Array.from({ length: 36 }, (_, i) => ({
  h:   Math.max(5, Math.abs(Math.sin(i * 0.6) * 26 + Math.sin(i * 1.1) * 13 + 6)),
  dur: `${0.75 + (i * 0.07) % 0.65}s`,
  del: `${(i * 0.055) % 1.1}s`,
}))

const PILLS = [
  { label: 'Voice Cloning',  top: '9%',  left: '5%',  anim: 'drift-a 7s ease-in-out infinite',         color: TEAL   },
  { label: '< 2s Latency',   top: '13%', left: '60%', anim: 'drift-b 6s ease-in-out infinite 1s',      color: TEAL   },
  { label: 'Voice Recovery', top: '44%', left: '3%',  anim: 'drift-c 8s ease-in-out infinite 0.5s',    color: PURPLE },
  { label: '70+ Languages',  top: '66%', left: '57%', anim: 'drift-a 9s ease-in-out infinite 2s',      color: TEAL   },
  { label: 'Family Access',  top: '76%', left: '7%',  anim: 'drift-b 7.5s ease-in-out infinite 1.5s',  color: PURPLE },
  { label: 'Sign Language',  top: '85%', left: '54%', anim: 'drift-c 6.5s ease-in-out infinite 0.8s',  color: TEAL   },
]

const PARTICLES = [
  [8,12],[23,45],[67,8],[91,23],[34,78],[56,34],[78,89],[12,67],
  [45,55],[89,44],[3,82],[62,18],[38,92],[74,6],[19,48],
  [82,72],[50,30],[27,15],[95,58],[6,95],[42,22],[70,60],
].map(([top, left], i) => ({
  top: `${top}%`, left: `${left}%`,
  dur: `${2.5 + (i * 0.18) % 2}s`,
  del: `${(i * 0.28) % 3.5}s`,
}))

const ANIM_CSS = `
  @keyframes wave-flow {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes bar-pulse {
    0%,100% { transform: scaleY(.32); opacity: .5; }
    50%     { transform: scaleY(1);   opacity: 1; }
  }
  @keyframes rec-blink {
    0%,100% { opacity: 1; box-shadow: 0 0 8px ${TEAL}, 0 0 18px ${TEAL}; }
    50%     { opacity: .3; box-shadow: none; }
  }
  @keyframes drift-a {
    0%,100% { transform: translate(0,0); }
    33%     { transform: translate(8px,-10px); }
    66%     { transform: translate(-5px,-6px); }
  }
  @keyframes drift-b {
    0%,100% { transform: translate(0,0); }
    33%     { transform: translate(-8px,-8px); }
    66%     { transform: translate(6px,-13px); }
  }
  @keyframes drift-c {
    0%,100% { transform: translate(0,0); }
    50%     { transform: translate(5px,-15px); }
  }
  @keyframes twinkle {
    0%,100% { opacity: .1; transform: scale(1); }
    50%     { opacity: .65; transform: scale(1.5); }
  }
`

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
      <div className="relative overflow-hidden flex flex-col items-center justify-center"
           style={{ background: 'linear-gradient(160deg, #091e33 0%, #061520 55%, #03101e 100%)' }}>

        <style>{ANIM_CSS}</style>

        {/* Twinkling particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.top, left: p.left,
            width: 2, height: 2, borderRadius: '50%', background: TEAL,
            animation: `twinkle ${p.dur} ease-in-out infinite ${p.del}`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Voice visualizer block */}
        <div style={{ width: '100%', position: 'relative', zIndex: 1 }}>

          {/* "Voice Active" status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: TEAL,
              animation: 'rec-blink 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '2.5px',
              color: TEAL, textTransform: 'uppercase',
            }}>Voice Active</span>
          </div>

          {/* Flowing waveform — double-width SVG scrolled left for seamless loop */}
          <div style={{ width: '100%', overflow: 'hidden', height: 140, position: 'relative' }}>
            {WAVE_LAYERS.map((wl, i) => (
              <div key={i} style={{
                position: 'absolute', top: 0, left: 0,
                width: `${W * 2}px`,
                animation: `wave-flow ${wl.dur} linear infinite`,
              }}>
                <svg width={W * 2} height={140} viewBox={`0 0 ${W * 2} 140`}
                     preserveAspectRatio="none" style={{ display: 'block' }}>
                  <path d={wl.d} stroke={wl.stroke} strokeWidth={wl.sw}
                        fill="none" opacity={wl.opacity} />
                  {/* second copy shifted by W — makes the loop seamless */}
                  <path d={wl.d} stroke={wl.stroke} strokeWidth={wl.sw}
                        fill="none" opacity={wl.opacity}
                        transform={`translate(${W}, 0)`} />
                </svg>
              </div>
            ))}
          </div>

          {/* Frequency analyzer bars */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: 3, height: 54, marginTop: 18, paddingInline: 36,
          }}>
            {BARS.map((b, i) => (
              <div key={i} style={{
                flex: 1, maxWidth: 8, height: b.h,
                borderRadius: 3,
                background: `linear-gradient(to top, ${TEAL}, ${TEAL}66)`,
                transformOrigin: 'bottom',
                animation: `bar-pulse ${b.dur} ease-in-out infinite ${b.del}`,
              }} />
            ))}
          </div>

        </div>

        {/* Floating feature pills — no emojis, just a colored dot */}
        {PILLS.map(({ label, top, left, anim, color }) => (
          <div key={label} style={{
            position: 'absolute', top, left,
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '8px 15px', borderRadius: 50,
            background: 'rgba(5,16,28,.82)',
            border: `1px solid ${color}40`,
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            animation: anim, whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,.3)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '.3px' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col items-center justify-center py-12 relative"
           style={{ background: '#061520' }}>

        {/* constrained content column */}
        <div style={{ width: '100%', maxWidth: 360, paddingInline: 8 }}>

          {/* back + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <button style={{
              width: 42, height: 42, borderRadius: '50%', background: '#00b8d4',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                   stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" />
              </svg>
            </button>
            <span style={{ color: 'rgba(255,255,255,.48)', fontSize: 15 }}>Reclaim Your Voice.</span>
          </div>

          {/* heading block */}
          <h1 style={{
            fontWeight: 900, color: 'white', fontSize: 50,
            letterSpacing: '-2.5px', lineHeight: 1.05,
            margin: 0, marginBottom: 8,
          }}>
            Welcome back
          </h1>
          <p style={{
            color: 'rgba(255,255,255,.4)', fontSize: 16,
            margin: 0, marginBottom: 40,
          }}>
            Sign in to SpeakMe
          </p>

          {/* primary CTA */}
          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              display: 'block', width: '100%',
              padding: '17px 24px', borderRadius: 50,
              background: 'linear-gradient(90deg, #00a8be 0%, #00c48a 100%)',
              border: 'none', fontSize: 17, fontWeight: 700, color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 0 40px rgba(0,180,200,.4), 0 0 80px rgba(0,180,200,.15)',
              marginBottom: 12, transition: 'opacity .2s, transform .15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? 'Signing in…' : "Let's Get Started! →"}
          </button>

          {/* family CTA */}
          <button
            onClick={() => toast('Enter the family access code sent to you by a patient')}
            style={{
              display: 'block', width: '100%',
              padding: '13px 24px', borderRadius: 6, background: 'transparent',
              border: '1px solid rgba(0,200,230,.38)', color: 'rgba(0,200,230,.72)',
              fontSize: 13, cursor: 'pointer', letterSpacing: '.4px',
              fontFamily: 'monospace', transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,200,230,.65)'; e.currentTarget.style.color = 'rgba(0,200,230,1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,200,230,.38)'; e.currentTarget.style.color = 'rgba(0,200,230,.72)' }}
          >
            [ was invited as a family member ] →
          </button>

        </div>
      </div>
    </div>
  )
}
