import React, { useState } from 'react'
import { useApp } from '../App.jsx'
import { Btn, PhraseCard, Eyebrow } from '../components/UI.jsx'
import { PHRASES } from '../lib/data.js'
import { mockSpeak } from '../lib/elevenlabs.js'

const TABS = ['all', 'daily', 'medical', 'emergency', 'social']
const COUNTS = { all: 15, daily: 7, medical: 4, emergency: 3, social: 3 }

export default function PhrasesPage() {
  const { showToast } = useApp()
  const [tab, setTab]         = useState('all')
  const [playingId, setPlayingId] = useState(null)

  const emergency = PHRASES.filter(p => p.emergency)
  const regular   = tab === 'all' ? PHRASES.filter(p => !p.emergency) : PHRASES.filter(p => p.cat === tab && !p.emergency)

  const handlePlay = async (phrase) => {
    setPlayingId(phrase.id)
    await mockSpeak(phrase.text)
    setTimeout(() => setPlayingId(null), 2400)
  }

  return (
    <div style={{ padding: '44px 48px', animation: 'fadeUp .4s ease both' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Eyebrow>One tap → your voice speaks</Eyebrow>
          <h2 style={{ fontSize: 42, marginBottom: 8 }}>Quick Phrases</h2>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>Pre-saved phrases for every moment — tap to hear your voice speak instantly</p>
        </div>
        <Btn onClick={() => showToast('✚ Add phrase — coming in the build!', 'default')}>+ Add Phrase</Btn>
      </div>

      {/* Emergency pinned always */}
      <div style={{
        background: 'rgba(232,54,93,.06)', border: '1.5px solid rgba(232,54,93,.25)',
        borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>🚨 Emergency Phrases — Always Active</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Always visible regardless of which tab is selected</div>
          </div>
          <Btn variant="danger" size="sm" style={{ background: 'var(--red)', color: '#fff', border: 'none', fontWeight: 700 }}
            onClick={() => showToast('🚨 Emergency alert sent to all contacts!', 'emergency')}>
            SEND ALERT
          </Btn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {emergency.map(p => (
            <PhraseCard key={p.id} phrase={p} onPlay={handlePlay} playing={playingId === p.id} />
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 18px', borderRadius: '10px 10px 0 0',
            fontSize: 13, fontWeight: 500, border: 'none',
            background: 'transparent',
            color: t === tab ? 'var(--text)' : 'var(--text-3)',
            cursor: 'pointer', position: 'relative', bottom: -1,
            transition: 'all var(--t-base)', fontFamily: 'var(--font-body)',
            borderBottom: `2px solid ${t === tab ? 'var(--red)' : 'transparent'}`,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span style={{
              marginLeft: 7, fontSize: 10, fontWeight: 700,
              background: t === tab ? 'var(--red)' : 'var(--border2)',
              color: t === tab ? '#fff' : 'var(--text-3)',
              padding: '1px 6px', borderRadius: 'var(--r-full)',
            }}>
              {COUNTS[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Phrase grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {regular.map(p => (
          <PhraseCard key={p.id} phrase={p} onPlay={handlePlay} playing={playingId === p.id} />
        ))}
      </div>
    </div>
  )
}
