import { useState, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { synthesise, handleApiError } from '@/lib/elevenlabs'
import { Trash2 } from 'lucide-react'
import clsx from 'clsx'

export default function PhraseCard({ phrase }) {
  const { voiceId, voiceSettings, simulateSpeak, incrementPhrase, toast, deletePhrase } = useApp()
  const [playing, setPlaying] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const audioRef = useRef(null)

  const isCustomPhrase = phrase.id > 20 // User-added phrases have ID > 20

  const play = async () => {
    if (playing) return

    setPlaying(true)
    incrementPhrase(phrase.id)
    simulateSpeak(phrase.text)

    const activeVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM'

    try {
      const settings = {
        stability: voiceSettings.stability / 100,
        similarity_boost: voiceSettings.similarityBoost / 100,
      }

      const audioUrl = await synthesise(phrase.text, activeVoiceId, settings)

      if (audioRef.current) audioRef.current.pause()
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setPlaying(false)
      audioRef.current.play()

      toast(`🎙 "${phrase.text.slice(0, 48)}${phrase.text.length > 48 ? '…' : ''}"`)
    } catch (error) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(phrase.text)
        utterance.rate = 0.95
        utterance.onend = () => setPlaying(false)
        window.speechSynthesis.speak(utterance)
        toast(`🎙 "${phrase.text.slice(0, 48)}${phrase.text.length > 48 ? '…' : ''}"`)
      } else {
        setPlaying(false)
        toast(`❌ ${handleApiError(error)}`, 'error')
      }
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${phrase.text}"?`)) {
      await deletePhrase(phrase.id)
      toast('🗑️ Phrase deleted', 'default')
    }
  }

  return (
    <button
      onClick={play}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      disabled={playing}
      className={clsx(
        'relative group text-left w-full rounded-xl p-4 border transition-all duration-200',
        'hover:-translate-y-[2px] hover:shadow-xl',
        phrase.urgent
          ? 'bg-red/5 border-red/20 hover:border-red/50 hover:shadow-red/10'
          : 'bg-card border-border hover:border-border2 hover:shadow-black/40',
        playing && !phrase.urgent && 'border-green/40 bg-green/5 shadow-[0_0_0_2px_rgba(16,217,138,.15)]',
        playing && phrase.urgent  && 'border-red/60 shadow-[0_0_0_2px_rgba(232,54,93,.25)]',
        playing && 'cursor-wait',
      )}
    >
      <div className={clsx(
        'absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity',
        phrase.urgent
          ? 'bg-gradient-to-r from-transparent via-red to-transparent'
          : 'bg-gradient-to-r from-transparent via-blue to-transparent',
      )} />

      {/* Delete button for custom phrases */}
      {isCustomPhrase && showDelete && !playing && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red/90 hover:bg-red
                     flex items-center justify-center text-white transition-all
                     hover:scale-110 z-10"
          title="Delete phrase"
        >
          <Trash2 size={13} />
        </button>
      )}

      <span className="text-2xl mb-2 block">{phrase.icon}</span>
      <p className="text-sm font-medium text-ink leading-snug mb-2">{phrase.text}</p>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted bg-surf px-2 py-0.5 rounded">{phrase.cat}</span>
        <span className="text-[10px] text-subtle">{phrase.uses} uses</span>
      </div>

      {playing && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="flex gap-[3px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ '--wc': phrase.urgent ? '#ff4d6d' : '#00b8ff', animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </button>
  )
}
