import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import PhraseCard from '@/components/ui/PhraseCard'
import Waveform from '@/components/ui/Waveform'
import { synthesise, handleApiError } from '@/lib/elevenlabs'
import { Play, Loader2, Globe, ArrowRight, AlertTriangle, Mic, Info } from 'lucide-react'
import clsx from 'clsx'

const LANGS = [
  { code: 'en', label: '🇬🇧 English', live: true  },
  { code: 'si', label: '🇱🇰 Sinhala', live: false },
  { code: 'ta', label: '🇱🇰 Tamil',   live: false },
  { code: 'hi', label: '🇮🇳 Hindi',   live: false },
  { code: 'fr', label: '🇫🇷 French',  live: false },
]

const QTABS  = ['all', 'daily', 'medical', 'emergency']

export default function Speak() {
  const { user, voiceId, voiceName, voiceSettings, updateVoiceSettings, speaking, lastSpoken, simulateSpeak, phrases, toast, outputLang, setOutputLang } = useApp()
  const navigate = useNavigate()
  const [text,      setText]      = useState('')
  const [qTab,      setQTab]      = useState('all')
  const [voiceIn,   setVoiceIn]   = useState(false)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const textRef = useRef(null)
  const audioRef = useRef(null)

  const handleSpeak = async () => {
    const t = text.trim() || "Good morning, how are you feeling today?"
    const activeVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM' // Rachel voice fallback

    if (!voiceId) {
      toast('ℹ️ Using ElevenLabs demo voice. Clone your voice in Voice Banking for personalised speech.')
    }

    try {
      setIsSynthesizing(true)
      simulateSpeak(t)

      const settings = {
        stability: voiceSettings.stability / 100,
        similarity_boost: voiceSettings.similarityBoost / 100,
      }

      const audioUrl = await synthesise(t, activeVoiceId, settings)

      if (audioRef.current) audioRef.current.pause()
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()

      toast(`🎙 Speaking in ${voiceId ? 'your cloned voice' : 'ElevenLabs demo voice'}…`)
    } catch (error) {
      if ('speechSynthesis' in window) {
        toast('⚠️ ElevenLabs unavailable — falling back to browser speech.')
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(t)
        utterance.rate = 0.95
        window.speechSynthesis.speak(utterance)
      } else {
        toast(`❌ ${handleApiError(error)}`, 'error')
      }
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
      <div className="min-h-[calc(100vh-65px)]">

        {/* ── MAIN ── */}
        <div className="px-4 sm:px-8 py-8">

          {/* Voice badge
          {voiceId ? (
            <div className="inline-flex items-center gap-3
                            bg-green/8 border border-green/20
                            px-4 py-2.5 rounded-full mb-6">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red to-purple
                              flex items-center justify-center
                              font-display font-black text-xs text-white">
                {user?.initials}
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3
                            bg-blue/8 border border-blue/20
                            px-4 py-2.5 rounded-full mb-6">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue to-purple
                              flex items-center justify-center
                              font-display font-black text-xs text-white">
                🎤
              </div>
              <div>
                <strong className="text-blue text-xs block leading-none mb-0.5">● Demo Mode</strong>
                <span className="text-muted text-[11px]">Using Rachel (ElevenLabs) · 
                  <button 
                    onClick={() => navigate('/voice-banking')}
                    className="text-blue hover:underline ml-1"
                  >
                    Clone your voice →
                  </button>
                </span>
              </div>
            </div>
          )} */}

          {/* Language selector */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted mr-1"><Globe size={13} /> Output:</span>
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
                    ? 'bg-blue/12 border-blue/35 text-blue'
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
                         px-5 pt-5 pb-24 text-ink text-[15px] leading-relaxed
                         placeholder:text-muted focus:border-blue/40 transition-colors
                         font-body"
            />
            {/* Toolbar inside textarea */}
            <div className="absolute bottom-0 left-0 right-0
                            flex flex-col gap-2
                            px-4 py-2.5 border-t border-border
                            bg-card/90 rounded-b-2xl backdrop-blur-sm">
              {/* Top row: info link + waveform */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate('/voice-banking')}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-blue transition-colors shrink-0"
                >
                  <Info size={12} />
                  Speak in your own voice
                </button>

                {/* Waveform inline */}
                <div className="hidden sm:flex justify-center">
                  <Waveform bars={10} active={speaking} />
                </div>
              </div>

              {/* Bottom row: Speak button */}
              <button
                onClick={handleSpeak}
                disabled={isSynthesizing}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2 w-full justify-center",
                  "text-sm font-semibold rounded-xl transition-all",
                  !isSynthesizing
                    ? "bg-red text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red/30 active:scale-[.97]"
                    : "bg-border text-subtle cursor-not-allowed"
                )}
              >
                {isSynthesizing
                  ? <><Loader2 size={15} className="animate-spin" /> Synthesizing…</>
                  : <><Play size={15} /> Speak Me</>
                }
              </button>
            </div>
          </div>

          {/* Quick phrases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-ink">Quick Phrases</h3>
              <button onClick={() => navigate('/phrases')} className="flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors">
                View all <ArrowRight size={12} />
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
                        : 'bg-blue/10 border-blue/20 text-ink'
                      : t === 'emergency'
                        ? 'border-red/15 text-red/70 hover:border-red/30'
                        : 'border-border text-muted hover:text-ink'
                  )}
                >
                  {t === 'emergency' && <AlertTriangle size={11} className="inline mr-1" />}{t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {filtered.map(p => <PhraseCard key={p.id} phrase={p} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
