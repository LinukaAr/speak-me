import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import EmergencyStrip from '@/components/layout/EmergencyStrip'
import PhraseCard from '@/components/ui/PhraseCard'
import Waveform from '@/components/ui/Waveform'
import { synthesise, handleApiError } from '@/lib/elevenlabs'
import clsx from 'clsx'

const LANGS = [
  { code: 'en', label: '🇬🇧 English', live: true  },
  { code: 'si', label: '🇱🇰 Sinhala', live: false },
  { code: 'ta', label: '🇱🇰 Tamil',   live: false },
  { code: 'hi', label: '🇮🇳 Hindi',   live: false },
  { code: 'fr', label: '🇫🇷 French',  live: false },
]

const SPEEDS = ['0.75×', '1.0×', '1.25×', '1.5×']
const QTABS  = ['all', 'daily', 'medical', 'emergency']

export default function Speak() {
  const { user, voiceId, voiceName, voiceSettings, updateVoiceSettings, speaking, lastSpoken, simulateSpeak, phrases, toast, outputLang, setOutputLang } = useApp()
  const navigate = useNavigate()
  const [text,      setText]      = useState('')
  const [speed,     setSpeed]     = useState('1.0×')
  const [qTab,      setQTab]      = useState('all')
  const [voiceIn,   setVoiceIn]   = useState(false)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const textRef = useRef(null)
  const audioRef = useRef(null)

  const handleSpeak = async () => {
    if (!voiceId) {
      toast('⚠️ No voice cloned yet. Please visit Voice Banking first.', 'error')
      return
    }

    const t = text.trim() || "Good morning, how are you feeling today?"
    
    try {
      setIsSynthesizing(true)
      simulateSpeak(t) // Start visual feedback immediately
      
      // Convert voice settings from 0-100 to 0-1 range for API
      const settings = {
        stability: voiceSettings.stability / 100,
        similarity_boost: voiceSettings.similarityBoost / 100,
      }
      
      const audioUrl = await synthesise(t, voiceId, settings)
      
      // Play the synthesized audio
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      
      toast('🎙 Speaking in your cloned voice…')
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast(`❌ ${errorMessage}`, 'error')
      console.error('Speech synthesis error:', error)
    } finally {
      setIsSynthesizing(false)
    }
  }

  const filtered = phrases
    .filter(p => !p.urgent)
    .filter(p => qTab === 'all' ? true : p.cat === qTab)
    .slice(0, 8)

  return (
    <div className="z-content screen-enter">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] min-h-[calc(100vh-65px)]">

        {/* ── MAIN ── */}
        <div className="px-8 py-8 border-r border-border">
          <EmergencyStrip />

          {/* Voice badge */}
          {voiceId ? (
            <div className="inline-flex items-center gap-3
                            bg-green/8 border border-green/20
                            px-4 py-2.5 rounded-full mb-6">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red to-purple
                              flex items-center justify-center
                              font-display font-black text-xs text-white">
                {user?.initials}
              </div>
              <div>
                <strong className="text-green text-xs block leading-none mb-0.5">● Voice Active</strong>
                <span className="text-muted text-[11px]">{voiceName} · ElevenLabs Clone</span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3
                            bg-amber/8 border border-amber/20
                            px-4 py-2.5 rounded-full mb-6">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber to-orange
                              flex items-center justify-center
                              font-display font-black text-xs text-white">
                ⚠️
              </div>
              <div>
                <strong className="text-amber text-xs block leading-none mb-0.5">No Voice Cloned</strong>
                <button 
                  onClick={() => navigate('/voice-banking')}
                  className="text-muted text-[11px] hover:text-ink underline"
                >
                  Visit Voice Banking to clone your voice →
                </button>
              </div>
            </div>
          )}

          {/* Language selector */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            <span className="text-xs text-muted mr-1">🌍 Output:</span>
            {LANGS.map(l => (
              <button
                key={l.code}
                disabled={!l.live}
                onClick={() => {
                  if (!l.live) { toast(`${l.label.split(' ')[1]} support coming post-hackathon`); return }
                  setOutputLang(l.label)
                }}
                title={!l.live ? 'Coming post-hackathon' : ''}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                  outputLang === l.label
                    ? 'bg-purple/12 border-purple/35 text-purple'
                    : l.live
                      ? 'border-border text-muted hover:text-ink hover:border-border2'
                      : 'border-border text-subtle opacity-50 cursor-not-allowed'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Compose area */}
          <div className="relative mb-4">
            <textarea
              ref={textRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSpeak() }}
              placeholder={"Type what you want to say…\n\nTry: \"Good morning, how are you feeling today?\""}
              rows={5}
              className="w-full bg-card border-[1.5px] border-border rounded-2xl
                         px-5 pt-5 pb-16 text-ink text-[15px] leading-relaxed
                         placeholder:text-subtle focus:border-red/40 transition-colors
                         font-body"
            />
            {/* Toolbar inside textarea */}
            <div className="absolute bottom-0 left-0 right-0
                            flex items-center justify-between
                            px-4 py-2.5 border-t border-border
                            bg-card/90 rounded-b-2xl backdrop-blur-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => { setVoiceIn(p => !p); toast(voiceIn ? '🎤 Voice input off' : '🎤 Voice input active — speak now…') }}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all',
                    voiceIn
                      ? 'bg-blue/10 border-blue/30 text-blue'
                      : 'border-border text-muted hover:text-ink hover:border-border2'
                  )}
                >
                  🎤 {voiceIn ? 'Listening…' : 'Voice Input'}
                </button>
                <button
                  onClick={() => toast('💾 Phrase saved to Quick Phrases!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border text-muted hover:text-ink hover:border-border2 transition-all"
                >
                  💾 Save
                </button>
              </div>
              <button
                onClick={handleSpeak}
                disabled={!voiceId || isSynthesizing}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2",
                  "text-sm font-semibold rounded-xl transition-all",
                  voiceId && !isSynthesizing
                    ? "bg-red text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red/30 active:scale-[.97]"
                    : "bg-border text-subtle cursor-not-allowed"
                )}
              >
                {isSynthesizing ? '⏳ Synthesizing...' : '▶ Speak Now'}
              </button>
            </div>
          </div>

          {/* Playback card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold tracking-widest uppercase text-green">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_ease_infinite]" />
              Speaking in your voice
            </div>
            <Waveform bars={18} active={speaking} className="mb-3" />
            {lastSpoken && (
              <div className="mt-3 px-4 py-3 bg-surf rounded-xl
                              text-sm text-muted italic border-l-2 border-red">
                "{lastSpoken.slice(0, 90)}{lastSpoken.length > 90 ? '…' : ''}"
              </div>
            )}
          </div>

          {/* Quick phrases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-ink">Quick Phrases</h3>
              <button onClick={() => navigate('/phrases')} className="text-xs text-muted hover:text-ink transition-colors">
                View all →
              </button>
            </div>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {QTABS.map(t => (
                <button
                  key={t}
                  onClick={() => setQTab(t)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                    qTab === t
                      ? t === 'emergency'
                        ? 'bg-red/10 border-red/20 text-red'
                        : 'bg-red/10 border-red/20 text-ink'
                      : t === 'emergency'
                        ? 'border-red/15 text-red/70 hover:border-red/30'
                        : 'border-border text-muted hover:text-ink'
                  )}
                >
                  {t === 'emergency' ? '🚨 ' : ''}{t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {filtered.map(p => <PhraseCard key={p.id} phrase={p} />)}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="px-6 py-8 bg-surf/40 hidden xl:block">
          {/* Speed */}
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-2">Playback Speed</p>
          <div className="flex gap-1.5 mb-6">
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-xs font-bold border transition-all',
                  speed === s
                    ? 'bg-red/10 border-red/30 text-red'
                    : 'bg-card border-border text-muted hover:text-ink'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Stats */}
          <SideCard title="🔬 Synthesis Stats">
            {[['Last latency','1.3s','text-green'],['Voice similarity','91%','text-blue'],['Words today','312','text-ink'],['Language',outputLang.split(' ').slice(1).join(' '),'text-purple']].map(([k,v,c]) => (
              <div key={k} className="flex justify-between items-center text-xs py-2 border-b border-white/4 last:border-0">
                <span className="text-muted">{k}</span>
                <span className={clsx('font-semibold', c)}>{v}</span>
              </div>
            ))}
          </SideCard>

          {/* Voice settings */}
          <SideCard title="⚙️ Voice Settings">
            {voiceId ? (
              <>
                <div className="mb-3">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-muted">Stability</span>
                    <span className="text-ink font-semibold">{voiceSettings.stability}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={voiceSettings.stability}
                    onChange={(e) => updateVoiceSettings({ stability: parseInt(e.target.value) })}
                    className="w-full accent-red h-1" 
                  />
                </div>
                <div className="mb-0">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-muted">Similarity Boost</span>
                    <span className="text-ink font-semibold">{voiceSettings.similarityBoost}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={voiceSettings.similarityBoost}
                    onChange={(e) => updateVoiceSettings({ similarityBoost: parseInt(e.target.value) })}
                    className="w-full accent-red h-1" 
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-muted">Clone your voice first to adjust settings</p>
            )}
          </SideCard>

          {/* Family online */}
          <SideCard title="👨‍👩‍👧 Family Online">
            {[['Sarah','Carer','green'],['Michael','Son','green'],['Rachel','Friend','subtle']].map(([n,r,c]) => (
              <div key={n} className="flex justify-between items-center text-xs py-2 border-b border-white/4 last:border-0">
                <span className="text-muted">{n} <span className="text-subtle">({r})</span></span>
                <span className={clsx('font-semibold', c === 'green' ? 'text-green' : 'text-subtle')}>
                  {c === 'green' ? '● Online' : '○ Away'}
                </span>
              </div>
            ))}
          </SideCard>
        </div>
      </div>
    </div>
  )
}

function SideCard({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4">
      <h4 className="font-display font-bold text-xs text-ink mb-3">{title}</h4>
      {children}
    </div>
  )
}
