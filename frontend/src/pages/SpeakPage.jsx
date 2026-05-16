import React, { useState, useRef } from 'react'
import { useApp } from '../App.jsx'
import { Btn, Card, Badge, Waveform, SideCard, StatRow, PhraseCard, Toggle, Eyebrow } from '../components/UI.jsx'
import { PHRASES, LANGUAGES } from '../lib/data.js'
import { mockSpeak } from '../lib/elevenlabs.js'

const CATS = ['all', 'daily', 'medical', 'emergency', 'social']

export default function SpeakPage() {
  const { user, showToast, language, setLanguage } = useApp()
  const [text, setText]           = useState('')
  const [speaking, setSpeaking]   = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const [cat, setCat]             = useState('all')
  const [stability, setStability] = useState(75)
  const [similarity, setSimilarity] = useState(85)
  const [speed, setSpeed]         = useState('1.0×')
  const [lastText, setLastText]   = useState('Good morning, how are you feeling today?')
  const [voiceInput, setVoiceInput] = useState(false)

  const filtered = cat === 'all'
    ? PHRASES.filter(p => !p.emergency).slice(0, 8)
    : PHRASES.filter(p => p.cat === cat && !p.emergency).slice(0, 8)

  const handleSpeak = async () => {
    if (!text.trim()) { showToast('⚠️ Type something to say first', 'warning'); return }
    setSpeaking(true)
    setLastText(text)
    await mockSpeak(text)
    setSpeaking(false)
  }

  const handlePhrase = async (phrase) => {
    setPlayingId(phrase.id)
    setLastText(phrase.text)
    await mockSpeak(phrase.text)
    setTimeout(() => setPlayingId(null), 2200)
  }

  const handleEmergency = () => {
    showToast('🚨 EMERGENCY ALERT SENT — Sarah, Michael & Dr. Mendis notified with your location!', 'emergency')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 64px)' }}>

      {/* ── MAIN COLUMN ── */}
      <div style={{ padding: '40px 44px', borderRight: '1px solid var(--border)' }}>

        {/* Emergency strip */}
        <div className="animate-fadeUp" style={{
          background: 'rgba(232,54,93,.08)',
          border: '1.5px solid rgba(232,54,93,.3)',
          borderRadius: 'var(--r-lg)', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>🚨 Emergency Alert</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
              Sends GPS location to Sarah, Michael + Dr. Mendis
            </div>
          </div>
          <Btn variant="danger" size="sm" onClick={handleEmergency} style={{
            background: 'var(--red)', color: '#fff', border: 'none',
            fontWeight: 700, letterSpacing: '.5px',
          }}>
            SEND ALERT
          </Btn>
        </div>

        {/* Voice badge */}
        <div className="animate-fadeUp delay-1" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          background: 'var(--green-dim)', border: '1px solid rgba(15,219,138,.2)',
          padding: '9px 18px', borderRadius: 'var(--r-full)', marginBottom: 28,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg,var(--red),var(--purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, color: '#fff',
          }}>{user?.initials}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', letterSpacing: '.3px' }}>● Voice Active</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {user?.voiceName} · {user?.voiceSimilarity}% similarity
            </div>
          </div>
        </div>

        {/* Language selector */}
        <div className="animate-fadeUp delay-2" style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 9, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            🌍 Output Language
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {LANGUAGES.map(lang => {
              const active = language === lang.code
              const live   = lang.status === 'live'
              return (
                <button key={lang.code} onClick={() => {
                  if (!live) { showToast(`${lang.name} will be available in a future update`, 'warning'); return }
                  setLanguage(lang.code)
                }} style={{
                  padding: '5px 14px', borderRadius: 'var(--r-full)',
                  fontSize: 12, fontWeight: 500,
                  border: `1px solid ${active ? 'rgba(155,109,255,.4)' : 'var(--border)'}`,
                  background: active ? 'var(--purple-dim)' : 'transparent',
                  color: active ? 'var(--purple)' : live ? 'var(--text-3)' : 'var(--text-3)',
                  cursor: live ? 'pointer' : 'not-allowed',
                  opacity: live ? 1 : .45,
                  transition: 'all var(--t-base)',
                  fontFamily: 'var(--font-body)',
                }}>
                  {lang.flag} {lang.name}
                  {!live && <span style={{ fontSize: 9, marginLeft: 4, verticalAlign: 'middle', opacity: .7 }}>soon</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Compose area */}
        <div className="animate-fadeUp delay-2" style={{ position: 'relative', marginTop: 20, marginBottom: 16 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSpeak() }}
            placeholder={"Type what you want to say…\n\nTip: Press Ctrl+Enter to speak instantly"}
            style={{
              width: '100%', minHeight: 148,
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: '20px 20px 64px',
              color: 'var(--text)', fontSize: 16, lineHeight: 1.6,
              resize: 'none', outline: 'none',
              transition: 'border-color var(--t-base)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(232,54,93,.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'rgba(17,17,32,.92)', backdropFilter: 'blur(8px)',
            borderTop: '1px solid var(--border)',
            borderRadius: '0 0 var(--r-lg) var(--r-lg)',
          }}>
            <div style={{ display: 'flex', gap: 7 }}>
              {[['🎤 Voice Input', voiceInput], ['💾 Save Phrase', false], ['📋 Templates', false]].map(([label, active]) => (
                <button key={label} onClick={() => {
                  if (label.includes('Voice')) { setVoiceInput(!voiceInput); showToast(voiceInput ? '🎤 Voice input stopped' : '🎤 Listening… speak now', 'default') }
                  else if (label.includes('Save')) showToast('💾 Phrase saved to Quick Phrases!', 'success')
                  else showToast('📋 Templates coming soon', 'default')
                }} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  border: `1px solid ${active ? 'rgba(64,128,255,.35)' : 'var(--border)'}`,
                  background: active ? 'var(--blue-dim)' : 'transparent',
                  color: active ? 'var(--blue)' : 'var(--text-3)',
                  cursor: 'pointer', transition: 'all var(--t-base)',
                  fontFamily: 'var(--font-body)',
                }}>{label}</button>
              ))}
            </div>
            <Btn onClick={handleSpeak} disabled={speaking} size="sm" style={{ gap: 7 }}>
              {speaking
                ? <><span style={{ width:12,height:12,border:'2px solid rgba(255,255,255,.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin .8s linear infinite' }} /> Speaking…</>
                : '▶ Speak Now'}
            </Btn>
          </div>
        </div>

        {/* Playback visual */}
        <Card className="animate-fadeUp delay-3" style={{ padding: '22px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--green)' }}>
            <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--green)',animation:'pulse 1.5s ease infinite' }} />
            Speaking in your voice
          </div>
          <Waveform bars={22} color="var(--red)" height={52} active={speaking} />
          <div style={{
            marginTop: 14, padding: '11px 14px',
            background: 'var(--surf)', borderRadius: 9,
            fontSize: 14, color: 'var(--text-2)',
            fontStyle: 'italic', borderLeft: '2px solid var(--red)',
          }}>
            "{lastText}"
          </div>
        </Card>

        {/* Quick phrases inline */}
        <div className="animate-fadeUp delay-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Quick Phrases</div>
            <span style={{ fontSize: 12, color: 'var(--text-3)', cursor: 'pointer', textDecoration: 'none' }}
              onClick={() => window.location.href = '/phrases'}>View all →</span>
          </div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: '6px 14px', borderRadius: 9, fontSize: 12, fontWeight: 500,
                border: `1px solid ${c === cat ? 'rgba(232,54,93,.3)' : 'var(--border)'}`,
                background: c === cat ? 'var(--red-dim)' : c === 'emergency' ? 'rgba(232,54,93,.04)' : 'transparent',
                color: c === cat ? 'var(--text)' : c === 'emergency' ? 'var(--red)' : 'var(--text-3)',
                cursor: 'pointer', transition: 'all var(--t-base)',
                fontFamily: 'var(--font-body)',
                textTransform: 'capitalize',
              }}>
                {c === 'emergency' ? '🚨 Emergency' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {filtered.map(phrase => (
              <PhraseCard key={phrase.id} phrase={phrase} onPlay={handlePhrase} playing={playingId === phrase.id} />
            ))}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ padding: '40px 28px', background: 'rgba(13,13,26,.5)' }}>

        {/* Speed control */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 9 }}>
            Playback Speed
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['0.75×','1.0×','1.25×','1.5×'].map(s => (
              <button key={s} onClick={() => setSpeed(s)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                border: `1px solid ${s === speed ? 'rgba(232,54,93,.35)' : 'var(--border)'}`,
                background: s === speed ? 'var(--red-dim)' : 'var(--card)',
                color: s === speed ? 'var(--red)' : 'var(--text-3)',
                cursor: 'pointer', transition: 'all var(--t-base)',
                fontFamily: 'var(--font-body)',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <SideCard title="Synthesis Stats" icon="🔬">
          <StatRow label="Last latency" value="1.3s" color="var(--green)" />
          <StatRow label="Voice similarity" value={`${user?.voiceSimilarity}%`} color="var(--blue)" />
          <StatRow label="Words spoken today" value="312" />
          <StatRow label="Language" value="English" color="var(--purple)" />
        </SideCard>

        <SideCard title="Voice Settings" icon="⚙️">
          {[['Stability', stability, setStability], ['Similarity Boost', similarity, setSimilarity]].map(([label, val, setter]) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 7 }}>
                <span>{label}</span><span style={{ color: 'var(--text)' }}>{val}%</span>
              </div>
              <input type="range" min={0} max={100} value={val}
                onChange={e => setter(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--red)' }} />
            </div>
          ))}
        </SideCard>

        <SideCard title="Family Online" icon="👨‍👩‍👧">
          {[['Sarah (Carer)', true], ['Michael (Son)', true], ['Rachel', false]].map(([name, online]) => (
            <StatRow key={name} label={name} value={online ? '● Online' : '○ Away'} color={online ? 'var(--green)' : 'var(--text-3)'} />
          ))}
        </SideCard>

        <SideCard title="ElevenLabs API" icon="⚡">
          <StatRow label="Connection" value="● Live" color="var(--green)" />
          <StatRow label="Model" value="eleven_turbo_v2" color="var(--blue)" />
          <StatRow label="Credits remaining" value="9,847" />
        </SideCard>
      </div>
    </div>
  )
}
