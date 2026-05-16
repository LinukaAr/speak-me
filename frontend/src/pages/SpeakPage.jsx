import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import PhraseCard from '@/components/ui/PhraseCard'
import Waveform from '@/components/ui/Waveform'
import { synthesise } from '@/lib/elevenlabs'
import clsx from 'clsx'

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧', live: true  },
  { code: 'si', label: 'Sinhala', flag: '🇱🇰', live: false },
  { code: 'ta', label: 'Tamil',   flag: '🇱🇰', live: false },
  { code: 'hi', label: 'Hindi',   flag: '🇮🇳', live: false },
  { code: 'fr', label: 'French',  flag: '🇫🇷', live: false },
]

const QTABS = ['all', 'daily', 'medical', 'emergency']

export default function SpeakPage() {
  const {
    voiceId, voiceName, voiceSettings,
    speaking, lastSpoken, simulateSpeak,
    phrases, toast, outputLang, setOutputLang,
  } = useApp()
  const navigate = useNavigate()

  const [text,          setText]          = useState('')
  const [qTab,          setQTab]          = useState('all')
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const audioRef = useRef(null)

  const handleSpeak = async () => {
    const t = text.trim() || 'Good morning, how are you feeling today?'
    const activeVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM'

    try {
      setIsSynthesizing(true)
      simulateSpeak(t)

      const audioUrl = await synthesise(t, activeVoiceId, {
        stability:        voiceSettings.stability / 100,
        similarity_boost: voiceSettings.similarityBoost / 100,
      })

      if (audioRef.current) audioRef.current.pause()
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      toast(`🎙 Speaking in ${voiceId ? 'your cloned voice' : 'ElevenLabs demo voice'}…`)
    } catch {
      if ('speechSynthesis' in window) {
        toast('⚠️ ElevenLabs unavailable — falling back to browser speech.')
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(t)
        u.rate = 0.95
        window.speechSynthesis.speak(u)
      } else {
        toast('❌ Speech synthesis unavailable', 'error')
      }
    } finally {
      setIsSynthesizing(false)
    }
  }

  const filtered = phrases
    .filter(p => !p.urgent)
    .filter(p => qTab === 'all' || p.cat === qTab)
    .slice(0, 8)

  return (
    <div className="z-content screen-enter px-6 py-8 max-w-3xl mx-auto">

      {/* Voice status */}
      <div className={clsx(
        'inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-6 text-xs font-medium',
        voiceId
          ? 'bg-green/8 border-green/20 text-green'
          : 'bg-blue/8 border-blue/20 text-blue'
      )}>
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full',
          voiceId ? 'bg-green animate-[pulse-dot_2s_ease_infinite]' : 'bg-blue'
        )} />
        {voiceId
          ? `${voiceName} — Voice Active`
          : <>ElevenLabs demo voice · <button onClick={() => navigate('/voice-banking')} className="underline underline-offset-2 ml-1">Clone yours →</button></>
        }
      </div>

      {/* Output language */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-2">Output language</p>
        <div className="flex gap-1.5 flex-wrap">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => {
                if (!l.live) { toast(`${l.label} support coming post-hackathon`); return }
                setOutputLang(l.label)
              }}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                outputLang === l.label
                  ? 'bg-blue/10 border-blue/30 text-blue'
                  : l.live
                    ? 'border-border text-muted hover:border-border2 hover:text-ink'
                    : 'border-border text-subtle opacity-40 cursor-not-allowed'
              )}
            >
              {l.flag} {l.label}
              {!l.live && <span className="ml-1 text-[10px] opacity-60">soon</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Compose area */}
      <div className="relative mb-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSpeak() }}
          placeholder={"Type what you want to say…\n\nPress ⌘ Enter to speak"}
          rows={5}
          className="w-full bg-card border border-border rounded-2xl
                     px-5 pt-5 pb-16 text-ink text-[15px] leading-relaxed
                     placeholder:text-subtle focus:border-blue/40 transition-colors
                     font-body outline-none"
        />
        <div className="absolute bottom-0 left-0 right-0
                        flex items-center justify-between
                        px-4 py-2.5 border-t border-border
                        bg-card/95 rounded-b-2xl backdrop-blur-sm">
          <button
            onClick={() => toast('💾 Phrase saved to Quick Phrases!')}
            className="px-3 py-1.5 rounded-lg text-xs border border-border text-muted
                       hover:text-ink hover:border-border2 transition-all"
          >
            💾 Save
          </button>
          <button
            onClick={handleSpeak}
            disabled={isSynthesizing}
            className={clsx(
              'flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition-all',
              isSynthesizing
                ? 'bg-border text-subtle cursor-not-allowed'
                : 'bg-red text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red/25 active:scale-[.97]'
            )}
          >
            {isSynthesizing
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Synthesizing…</>
              : '▶ Speak Now'}
          </button>
        </div>
      </div>

      {/* Playback */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold tracking-widest uppercase text-muted">
          <span className={clsx(
            'w-1.5 h-1.5 rounded-full',
            speaking ? 'bg-green animate-[pulse-dot_2s_ease_infinite]' : 'bg-subtle'
          )} />
          {speaking ? 'Speaking now' : 'Ready'}
        </div>
        <Waveform bars={18} active={speaking} className="mb-3" />
        {lastSpoken && (
          <div className="px-4 py-3 bg-surf rounded-xl text-sm text-muted italic border-l-2 border-border2">
            "{lastSpoken.slice(0, 100)}{lastSpoken.length > 100 ? '…' : ''}"
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
                    : 'bg-blue/8 border-blue/20 text-ink'
                  : t === 'emergency'
                    ? 'border-border text-red/60 hover:border-red/25'
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
  )
}
