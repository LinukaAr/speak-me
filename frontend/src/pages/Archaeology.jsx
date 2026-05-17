import { useEffect, useRef, useState } from 'react'
import { Users, Mic, Video, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Mic,
    title: 'Audio File Upload',
    subtitle: 'Upload recordings from your device',
    color: '#00b8ff',
    rgb: '0, 184, 255',
    number: '01',
    description:
      "Upload audio recordings from voice notes, voicemails, or phone recordings. We'll process and combine them to build your personalized voice clone — no technical knowledge needed.",
    details: [
      { icon: '📁', label: 'Supported Formats', value: 'MP3 · WAV · M4A · AAC · OGG' },
      { icon: '⚡', label: 'Requirements', value: 'Min 1 min recommended · Best with 3+ min · Up to 20 files' },
      { icon: '💡', label: 'Best Sources', value: 'WhatsApp voice notes · Voicemails · Voice memos · Audio messages' },
    ],
  },
  {
    icon: Video,
    title: 'Video Processing',
    subtitle: 'Extract audio from video files',
    color: '#009bd6',
    rgb: '0, 155, 214',
    number: '02',
    description:
      "Upload any video and we'll automatically extract the audio track. Perfect for birthday videos, family events, Zoom recordings, and social media clips — video quality doesn't matter, only the audio.",
    details: [
      { icon: '🎬', label: 'Birthday & Events', value: 'Family celebrations, parties, gatherings' },
      { icon: '💼', label: 'Zoom Meetings', value: 'Automatic speaker isolation from recordings' },
      { icon: '📺', label: 'Social Media', value: 'Instagram, TikTok, YouTube clips' },
    ],
  },
  {
    icon: Users,
    title: 'Family Collaboration',
    subtitle: 'Let family members contribute recordings',
    color: '#00719c',
    rgb: '0, 113, 156',
    number: '03',
    description:
      "Family members often have recordings you don't even know exist. Send them a secure invite link and they can upload audio files directly to your voice recovery collection from any device.",
    details: [
      { icon: '🔗', label: 'Invite Links', value: 'Send secure links to family members' },
      { icon: '📤', label: 'Easy Upload', value: 'They upload from any device, no account needed' },
      { icon: '📊', label: 'Track Progress', value: 'See who contributed what and when' },
    ],
  },
  {
    icon: Sparkles,
    title: 'AI Enhancement',
    subtitle: 'Improve audio quality automatically',
    color: '#00b8ff',
    rgb: '0, 184, 255',
    number: '04',
    description:
      "Advanced AI processing cleans up old recordings and extracts the clearest possible voice sample — even from noisy, low-quality, or decades-old audio. Your voice, restored.",
    details: [
      { icon: '🎯', label: 'Noise Removal', value: 'Eliminate background music and ambient noise' },
      { icon: '🔊', label: 'Voice Isolation', value: 'Separate your voice from other speakers' },
      { icon: '✨', label: 'Quality Boost', value: 'Improve clarity of old or low-quality recordings' },
    ],
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function FeatureCard({ feature, index }) {
  const [ref, inView] = useInView(0.1)
  const [isRevealed, setIsRevealed] = useState(false)
  const Icon = feature.icon

  return (
    <div
      ref={ref}
      onClick={() => !isRevealed && setIsRevealed(true)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? 'translateY(0) scale(1)'
          : `translateY(60px) scale(0.95)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 150}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 150}ms`,
        borderRadius: 24,
        overflow: 'hidden',
        border: `2px solid rgba(${feature.rgb}, ${isRevealed ? 0.25 : 0.15})`,
        background: 'var(--card)',
        position: 'relative',
        boxShadow: inView ? (isRevealed ? `0 12px 40px rgba(${feature.rgb}, 0.2)` : `0 8px 32px rgba(${feature.rgb}, 0.12)`) : 'none',
        cursor: isRevealed ? 'default' : 'pointer',
      }}
    >
      {/* Animated glow top edge */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent, rgba(${feature.rgb}, 1), transparent)`,
        opacity: inView ? (isRevealed ? 1 : 0.5) : 0,
        transition: `opacity 0.8s ease ${index * 150 + 300}ms`,
      }} />

      {/* Blur overlay with click prompt */}
      {!isRevealed && inView && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: `linear-gradient(135deg, rgba(${feature.rgb}, 0.15) 0%, rgba(${feature.rgb}, 0.05) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.4s ease',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '24px 32px',
            borderRadius: 16,
            background: `rgba(${feature.rgb}, 0.12)`,
            border: `2px solid rgba(${feature.rgb}, 0.3)`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            <div style={{
              fontSize: 40,
              marginBottom: 12,
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
            }}>
              👆
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 800,
              color: feature.color,
              marginBottom: 6,
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              Click to Reveal
            </div>
            <div style={{
              fontSize: 13,
              color: 'var(--text-2)',
              fontWeight: 500,
            }}>
              Discover {feature.title}
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        filter: isRevealed ? 'none' : 'blur(0px)',
        transition: 'filter 0.5s ease',
      }}>

        {/* Left: description */}
        <div style={{
          padding: '44px 48px',
          borderRight: `1px solid rgba(${feature.rgb}, 0.15)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: `linear-gradient(135deg, rgba(${feature.rgb}, ${isRevealed ? 0.04 : 0.02}) 0%, transparent 100%)`,
          transition: 'background 0.5s ease',
        }}>
          {/* Number + badge row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 24,
            opacity: isRevealed ? 1 : 0.3,
            transition: 'opacity 0.5s ease',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 900,
              color: `rgba(${feature.rgb}, 0.5)`,
              letterSpacing: '1.5px',
            }}>
              {feature.number}
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 700,
              background: `rgba(${feature.rgb}, 0.15)`,
              color: feature.color,
              letterSpacing: '0.8px',
              border: `1px solid rgba(${feature.rgb}, 0.3)`,
            }}>
              PHASE 2
            </span>
          </div>

          {/* Icon + title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 18,
            opacity: isRevealed ? 1 : 0.3,
            transform: isRevealed ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `rgba(${feature.rgb}, ${isRevealed ? 0.15 : 0.08})`,
              color: feature.color,
              flexShrink: 0,
              border: `2px solid rgba(${feature.rgb}, ${isRevealed ? 0.25 : 0.15})`,
              boxShadow: isRevealed ? `0 4px 16px rgba(${feature.rgb}, 0.2)` : 'none',
              transition: 'all 0.5s ease',
            }}>
              <Icon size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 26,
                color: feature.color,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
              }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-3)', margin: '5px 0 0', fontWeight: 500 }}>
                {feature.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 16,
            color: 'var(--text-2)',
            lineHeight: 1.8,
            margin: 0,
            fontWeight: 400,
            opacity: isRevealed ? 1 : 0.3,
            transform: isRevealed ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            {feature.description}
          </p>
        </div>

        {/* Right: detail rows */}
        <div style={{
          padding: '44px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
          background: `rgba(${feature.rgb}, ${isRevealed ? 0.04 : 0.02})`,
          transition: 'background 0.5s ease',
        }}>
          {feature.details.map((d, i) => (
            <div
              key={d.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '16px 18px',
                borderRadius: 14,
                background: 'var(--card)',
                border: `1.5px solid rgba(${feature.rgb}, ${isRevealed ? 0.15 : 0.08})`,
                opacity: inView ? (isRevealed ? 1 : 0.3) : 0,
                transform: inView ? (isRevealed ? 'translateX(0)' : 'translateX(30px)') : 'translateX(30px)',
                transition: isRevealed
                  ? `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s,
                     border 0.5s ease,
                     box-shadow 0.5s ease`
                  : `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 150 + 300 + i * 100}ms,
                     transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 150 + 300 + i * 100}ms`,
                boxShadow: (inView && isRevealed) ? `0 2px 8px rgba(${feature.rgb}, 0.08)` : 'none',
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{d.icon}</span>
              <div>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text-1)',
                  marginBottom: 4,
                  letterSpacing: '0.3px',
                }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, fontWeight: 400 }}>
                  {d.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reveal success indicator */}
      {isRevealed && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          padding: '6px 12px',
          borderRadius: 20,
          background: `rgba(${feature.rgb}, 0.15)`,
          border: `1px solid rgba(${feature.rgb}, 0.3)`,
          fontSize: 11,
          fontWeight: 700,
          color: feature.color,
          opacity: 0,
          animation: 'fadeInOut 2s ease-in-out',
        }}>
          ✓ Revealed
        </div>
      )}
    </div>
  )
}

export default function Archaeology() {
  const [headerRef, headerInView] = useInView(0.1)
  const [bannerRef, bannerInView] = useInView(0.1)

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
      <div style={{ padding: '48px 64px 80px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          opacity: headerInView ? 1 : 0,
          transform: headerInView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: 40,
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#00b8ff',
          marginBottom: 16,
        }}>
          <span style={{ width: 16, height: 1, background: '#00b8ff' }} />
          Voice Recovery
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 56,
          letterSpacing: '-2.5px',
          lineHeight: 0.95,
          marginBottom: 16,
        }}>
          Recover Your Voice
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text-2)',
          lineHeight: 1.7,
          maxWidth: 600,
          margin: 0,
        }}>
          Already lost your voice? We'll help you recover it from old recordings, videos, and voice messages.
          This powerful feature is coming in Phase 2.
        </p>
      </div>

      {/* Phase 2 Banner */}
      <div
        ref={bannerRef}
        style={{
          opacity: bannerInView ? 1 : 0,
          transform: bannerInView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
          marginBottom: 48,
          padding: '28px 36px',
          borderRadius: 20,
          border: '1.5px solid rgba(0, 184, 255, 0.3)',
          background: 'rgba(0, 184, 255, 0.07)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: -60, right: -60,
          width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,184,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, position: 'relative' }}>
          <span style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>🚀</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 26,
                color: '#00b8ff',
                margin: 0,
              }}>
                Coming in Phase 2
              </h2>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(0, 184, 255, 0.15)',
                color: '#00b8ff',
                letterSpacing: '0.5px',
              }}>
                IN DEVELOPMENT
              </span>
            </div>
            <p style={{
              fontSize: 15,
              color: 'var(--text-2)',
              lineHeight: 1.75,
              marginBottom: 20,
              maxWidth: 680,
            }}>
              Voice Recovery will allow you to recreate your voice from existing recordings — even if you've
              already lost the ability to speak clearly. We'll extract and process audio from various sources
              to build your personalized voice clone.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Audio Upload', 'Video Processing', 'Family Collaboration', 'AI Enhancement'].map((f, i) => (
                <span
                  key={f}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    border: '1px solid rgba(0, 184, 255, 0.25)',
                    background: 'rgba(0, 184, 255, 0.1)',
                    color: '#00b8ff',
                    opacity: bannerInView ? 1 : 0,
                    transform: bannerInView ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.4s ease ${0.3 + i * 0.07}s, transform 0.4s ease ${0.3 + i * 0.07}s`,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {FEATURES.map((feature, idx) => (
          <FeatureCard key={feature.title} feature={feature} index={idx} />
        ))}
      </div>

    </div>
    </>
  )
}
