import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App.jsx'
import { Btn, Card, Waveform, SideCard, StatRow, Eyebrow } from '../components/UI.jsx'
import { BANK_SENTENCES } from '../lib/data.js'

export default function VoiceBankingPage() {
  const { showToast } = useApp()
  const navigate = useNavigate()
  const [recordings, setRecordings] = useState({})
  const [activeIdx, setActiveIdx]   = useState(0)
  const [recording, setRecording]   = useState(false)
  const [cloning, setCloning]       = useState(false)
  const [cloned, setCloned]         = useState(false)

  const done  = Object.keys(recordings).length
  const total = BANK_SENTENCES.length
  const pct   = Math.round((done / total) * 100)

  const handleRecord = async (idx) => {
    if (recordings[idx]) return
    setRecording(true)
    setActiveIdx(idx)
    await new Promise(r => setTimeout(r, 2200))
    setRecordings(prev => ({ ...prev, [idx]: true }))
    setRecording(false)
    if (idx < total - 1) setActiveIdx(idx + 1)
    showToast(`✓ Sentence ${idx + 1} recorded`, 'success')
  }

  const handleClone = async () => {
    if (done < 3) { showToast('⚠️ Record at least 3 sentences first', 'warning'); return }
    setCloning(true)
    await new Promise(r => setTimeout(r, 2800))
    setCloned(true)
    setCloning(false)
    showToast('✅ Voice cloned successfully! Redirecting…', 'success')
    setTimeout(() => navigate('/speak'), 2000)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 'calc(100vh - 64px)' }}>

      {/* MAIN */}
      <div style={{ padding: '44px 48px', borderRight: '1px solid var(--border)' }}>
        <Eyebrow>Step 01 of 03 · Live Recording Path</Eyebrow>
        <h2 style={{ fontSize: 42, marginBottom: 12 }}>Bank your<br />voice forever.</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 480, marginBottom: 36, lineHeight: 1.65 }}>
          Read each sentence clearly into your microphone. We capture the full range of your voice — tone, emotion, rhythm — and preserve it with ElevenLabs.
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 9 }}>
            <span style={{ color: 'var(--text-3)' }}>{done} of {total} recorded</span>
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>{pct}% complete</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: 'linear-gradient(90deg, var(--red), #ff6b87)',
              borderRadius: 2, width: `${pct}%`, transition: 'width .5s ease',
            }} />
          </div>
        </div>

        {/* Sentence list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {BANK_SENTENCES.map((sentence, i) => {
            const isDone   = !!recordings[i]
            const isActive = activeIdx === i && !isDone
            return (
              <div key={i} onClick={() => !isDone && setActiveIdx(i)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', borderRadius: 'var(--r-lg)', cursor: isDone ? 'default' : 'pointer',
                background: isActive ? 'rgba(232,54,93,.06)' : 'var(--card)',
                border: `1.5px solid ${isDone ? 'rgba(15,219,138,.25)' : isActive ? 'var(--red-glow)' : 'var(--border)'}`,
                transition: 'all var(--t-base)',
                boxShadow: isActive ? 'var(--shadow-red)' : 'none',
              }}>
                {/* Number */}
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
                  background: isDone ? 'var(--green-dim)' : isActive ? 'var(--red)' : 'var(--surf)',
                  color: isDone ? 'var(--green)' : isActive ? '#fff' : 'var(--text-3)',
                  border: `1px solid ${isDone ? 'rgba(15,219,138,.3)' : isActive ? 'var(--red)' : 'var(--border)'}`,
                }}>
                  {isDone ? '✓' : i + 1}
                </div>
                {/* Text */}
                <div style={{ flex: 1, fontSize: 14, lineHeight: 1.5, color: isDone ? 'var(--text-3)' : 'var(--text)' }}>
                  {sentence}
                </div>
                {/* Action */}
                {isDone ? (
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(15,219,138,.2)', flexShrink: 0 }}>
                    Recorded ✓
                  </span>
                ) : isActive ? (
                  <div onClick={e => { e.stopPropagation(); handleRecord(i) }} style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--red-dim)', border: '1px solid var(--red-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, cursor: 'pointer',
                    animation: recording ? 'pulse 1.5s ease infinite' : 'none',
                  }}>
                    {recording ? '⏹' : '🎙'}
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>Pending</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ padding: '44px 28px', background: 'rgba(13,13,26,.5)' }}>

        <SideCard title="Live Recording" icon="🎙">
          <Waveform bars={14} color="var(--red)" height={56} active={recording} />
          <div style={{ textAlign: 'center', fontSize: 13, color: recording ? 'var(--red)' : 'var(--text-3)', marginTop: 10, fontWeight: 500 }}>
            {recording ? `● Recording sentence ${activeIdx + 1}…` : 'Click 🎙 to start recording'}
          </div>
        </SideCard>

        <SideCard title="Voice Quality" icon="📊">
          {[['Clarity', 4], ['Range', 3], ['Consistency', 5]].map(([label, dots]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-3)' }}>{label}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < dots ? 'var(--green)' : 'var(--border2)' }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </SideCard>

        <SideCard title="ElevenLabs Status" icon="⚡">
          <StatRow label="API Connection" value="● Connected" color="var(--green)" />
          <StatRow label="Model" value="eleven_turbo_v2" color="var(--blue)" />
          <StatRow label="Cloning Engine" value="● Ready" color="var(--green)" />
        </SideCard>

        {/* Clone button */}
        <button onClick={handleClone} disabled={cloning || cloned} style={{
          width: '100%', padding: 16,
          background: cloned ? 'linear-gradient(135deg,#065F46,#047857)' : 'linear-gradient(135deg, var(--red), #c42d4e)',
          border: 'none', borderRadius: 'var(--r-lg)', color: '#fff',
          fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
          cursor: cloning || cloned ? 'not-allowed' : 'pointer',
          transition: 'all var(--t-base)', marginTop: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          opacity: cloning ? .8 : 1,
        }}>
          {cloning ? (
            <><span style={{ width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin .8s linear infinite' }} />Cloning your voice…</>
          ) : cloned ? '✅ Voice Banked Successfully!'
          : '🧬 Clone My Voice with ElevenLabs'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 9 }}>
          Minimum 3 recordings needed · More = better quality
        </p>
      </div>
    </div>
  )
}
